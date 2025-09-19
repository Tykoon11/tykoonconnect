'use server'

import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { prisma } from '@/lib/prisma'
import { DEMO_MODE } from '@/lib/prisma'

interface ReviewData {
  rating: number
  comment: string
  agreementId: string
  revieweeId: string
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const agreementId = params.id
    const body = await request.json()
    const { rating, comment, revieweeId } = body as ReviewData

    if (DEMO_MODE) {
      // Demo mode - simulate successful review submission
      await new Promise(resolve => setTimeout(resolve, 500))
      
      return NextResponse.json({
        success: true,
        review: {
          id: `review_${Date.now()}`,
          agreementId,
          reviewerId: 'demo_user',
          revieweeId,
          rating,
          comment,
          createdAt: new Date().toISOString()
        }
      })
    }

    // Validate required fields
    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: 'Rating must be between 1 and 5' },
        { status: 400 }
      )
    }

    if (!comment || comment.trim().length < 10) {
      return NextResponse.json(
        { error: 'Comment must be at least 10 characters long' },
        { status: 400 }
      )
    }

    // Get the agreement to validate it exists and get context
    const agreement = await prisma.agreement.findUnique({
      where: { id: agreementId },
      include: {
        client: true,
        freelancer: true
      }
    })

    if (!agreement) {
      return NextResponse.json(
        { error: 'Agreement not found' },
        { status: 404 }
      )
    }

    // Check if agreement is in a state that allows review
    if (!['SUBMITTED', 'ACCEPTED'].includes(agreement.assuranceState)) {
      return NextResponse.json(
        { error: 'Agreement is not in a state that allows review' },
        { status: 400 }
      )
    }

    // TODO: Get actual user from auth header
    const reviewerId = agreement.clientId // For now, assume client is reviewing

    // Check if review already exists
    const existingReview = await prisma.review.findFirst({
      where: {
        agreementId,
        reviewerId
      }
    })

    if (existingReview) {
      return NextResponse.json(
        { error: 'Review already submitted for this agreement' },
        { status: 400 }
      )
    }

    // Create the review
    const review = await prisma.review.create({
      data: {
        agreementId,
        reviewerId,
        revieweeId,
        rating,
        comment: comment.trim()
      }
    })

    // Update the reviewee's rating statistics
    const reviewee = await prisma.user.findUnique({
      where: { id: revieweeId },
      select: { ratingCount: true, ratingAverage: true }
    })

    if (reviewee) {
      const newRatingCount = reviewee.ratingCount + 1
      const newRatingAverage = ((reviewee.ratingAverage * reviewee.ratingCount) + rating) / newRatingCount

      await prisma.user.update({
        where: { id: revieweeId },
        data: {
          ratingCount: newRatingCount,
          ratingAverage: newRatingAverage
        }
      })
    }

    // Update agreement state to CLOSED if review is submitted
    await prisma.agreement.update({
      where: { id: agreementId },
      data: {
        assuranceState: 'CLOSED'
      }
    })

    return NextResponse.json({
      success: true,
      review: {
        id: review.id,
        agreementId: review.agreementId,
        reviewerId: review.reviewerId,
        revieweeId: review.revieweeId,
        rating: review.rating,
        comment: review.comment,
        createdAt: review.createdAt
      }
    })

  } catch (error) {
    console.error('Error submitting review:', error)
    return NextResponse.json(
      { error: 'Failed to submit review' },
      { status: 500 }
    )
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const agreementId = params.id

    if (DEMO_MODE) {
      // Demo mode - return mock review data
      return NextResponse.json({
        review: null,
        canReview: true,
        agreement: {
          id: agreementId,
          jobTitle: 'Sample Web Development Project',
          freelancerName: 'John Developer',
          freelancerHandle: 'john_dev',
          clientName: 'Jane Client',
          completedAt: new Date().toISOString(),
          priceTotal: 150000 // $1,500 in cents
        }
      })
    }

    // Check if review exists for this agreement
    const review = await prisma.review.findFirst({
      where: { agreementId }
    })

    // Get agreement details for review modal
    const agreement = await prisma.agreement.findUnique({
      where: { id: agreementId },
      include: {
        client: true,
        freelancer: true,
        proposal: {
          include: {
            job: true
          }
        }
      }
    })

    if (!agreement) {
      return NextResponse.json(
        { error: 'Agreement not found' },
        { status: 404 }
      )
    }

    const canReview = ['SUBMITTED', 'ACCEPTED'].includes(agreement.assuranceState) && !review

    return NextResponse.json({
      review,
      canReview,
      agreement: {
        id: agreement.id,
        jobTitle: agreement.proposal.job.title,
        freelancerName: agreement.freelancer.name,
        freelancerHandle: agreement.freelancer.handle,
        freelancerAvatarUrl: agreement.freelancer.avatarUrl,
        clientName: agreement.client.name,
        completedAt: agreement.updatedAt.toISOString(),
        priceTotal: agreement.priceTotal || 0
      }
    })

  } catch (error) {
    console.error('Error fetching review data:', error)
    return NextResponse.json(
      { error: 'Failed to fetch review data' },
      { status: 500 }
    )
  }
}