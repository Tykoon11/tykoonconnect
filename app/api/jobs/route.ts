import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

const createJobSchema = z.object({
  title: z.string().min(5).max(100),
  description: z.string().min(50).max(5000),
  skills: z.array(z.string()).min(1).max(10),
  budgetType: z.enum(['hourly', 'fixed']),
  budgetAmount: z.number().optional(),
  assuranceHint: z.enum(['MILESTONE_INVOICE', 'EXTERNAL_ESCROW', 'CARD_HOLD']).optional(),
})

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const page = parseInt(searchParams.get('page') || '1')
  const limit = parseInt(searchParams.get('limit') || '20')
  const search = searchParams.get('search')
  const budgetMin = searchParams.get('budgetMin')
  const budgetMax = searchParams.get('budgetMax')
  const budgetType = searchParams.get('budgetType')
  const assurance = searchParams.get('assurance')

  const where: any = {
    status: 'open'
  }

  if (search) {
    where.OR = [
      { title: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
      { skills: { hasSome: search.split(' ') } }
    ]
  }

  if (budgetType) {
    where.budgetType = budgetType
  }

  if (budgetMin || budgetMax) {
    where.budgetAmount = {}
    if (budgetMin) where.budgetAmount.gte = parseInt(budgetMin)
    if (budgetMax) where.budgetAmount.lte = parseInt(budgetMax)
  }

  if (assurance) {
    where.OR = where.OR || []
    where.OR.push(
      { assuranceHint: assurance },
      { client: { preferredAssurance: assurance } },
      { client: { alsoAccepts: { has: assurance } } }
    )
  }

  try {
    const [jobs, total] = await Promise.all([
      prisma.job.findMany({
        where,
        include: {
          client: {
            select: {
              name: true,
              handle: true,
              location: true,
              ratingAverage: true,
              ratingCount: true,
              preferredAssurance: true,
              alsoAccepts: true,
            }
          },
          _count: {
            select: { proposals: true }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.job.count({ where })
    ])

    return NextResponse.json({
      jobs,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Error fetching jobs:', error)
    return NextResponse.json(
      { error: 'Failed to fetch jobs' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient()
    
    // Handle demo mode
    if (!supabase) {
      const body = await request.json()
      const validatedData = createJobSchema.parse(body)
      
      // Return a demo job creation response
      const demoJob = {
        id: 'demo-job-' + Date.now(),
        ...validatedData,
        clientId: 'demo-user',
        status: 'open',
        createdAt: new Date(),
        updatedAt: new Date(),
        client: {
          name: 'Demo Client',
          handle: 'democlient',
          location: 'Demo City',
          ratingAverage: 4.8,
          ratingCount: 25,
          preferredAssurance: 'MILESTONE_INVOICE',
          alsoAccepts: []
        }
      }
      
      return NextResponse.json(demoJob, { status: 201 })
    }

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get user profile
    const userProfile = await prisma.user.findUnique({
      where: { id: user.id }
    })

    if (!userProfile?.roleClient) {
      return NextResponse.json(
        { error: 'User is not registered as a client' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const validatedData = createJobSchema.parse(body)

    const job = await prisma.job.create({
      data: {
        ...validatedData,
        clientId: user.id,
      },
      include: {
        client: {
          select: {
            name: true,
            handle: true,
            location: true,
            ratingAverage: true,
            ratingCount: true,
            preferredAssurance: true,
            alsoAccepts: true,
          }
        }
      }
    })

    return NextResponse.json(job, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Error creating job:', error)
    return NextResponse.json(
      { error: 'Failed to create job' },
      { status: 500 }
    )
  }
}