import { NextResponse } from 'next/server'
import { z } from 'zod'

export class APIError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500,
    public code?: string
  ) {
    super(message)
    this.name = 'APIError'
  }
}

export function handleAPIError(error: unknown): NextResponse {
  console.error('API Error:', error)

  // Zod validation errors
  if (error instanceof z.ZodError) {
    return NextResponse.json(
      { 
        error: 'Validation failed', 
        details: error.errors,
        code: 'VALIDATION_ERROR'
      },
      { status: 400 }
    )
  }

  // Custom API errors
  if (error instanceof APIError) {
    return NextResponse.json(
      { 
        error: error.message,
        code: error.code || 'API_ERROR'
      },
      { status: error.statusCode }
    )
  }

  // Prisma errors
  if (error && typeof error === 'object' && 'code' in error) {
    const prismaError = error as { code: string; message: string }
    
    switch (prismaError.code) {
      case 'P2002':
        return NextResponse.json(
          { 
            error: 'Resource already exists',
            code: 'DUPLICATE_ERROR'
          },
          { status: 409 }
        )
      case 'P2025':
        return NextResponse.json(
          { 
            error: 'Resource not found',
            code: 'NOT_FOUND'
          },
          { status: 404 }
        )
      case 'P1001':
        return NextResponse.json(
          { 
            error: 'Database connection failed',
            code: 'DATABASE_ERROR'
          },
          { status: 503 }
        )
      default:
        return NextResponse.json(
          { 
            error: 'Database operation failed',
            code: 'DATABASE_ERROR'
          },
          { status: 500 }
        )
    }
  }

  // Network/fetch errors
  if (error instanceof TypeError && error.message.includes('fetch')) {
    return NextResponse.json(
      { 
        error: 'External service unavailable',
        code: 'SERVICE_UNAVAILABLE'
      },
      { status: 503 }
    )
  }

  // Default server error
  return NextResponse.json(
    { 
      error: 'Internal server error',
      code: 'INTERNAL_ERROR'
    },
    { status: 500 }
  )
}

// Demo mode check utility
export const isDemoMode = () => {
  return !process.env.DATABASE_URL || 
    process.env.DATABASE_URL.includes('placeholder') ||
    !process.env.SUPABASE_URL ||
    process.env.SUPABASE_URL.includes('placeholder')
}

// Create demo response helper
export function createDemoResponse<T>(data: T, status: number = 200): NextResponse {
  return NextResponse.json({
    ...data,
    _demo: true,
    _message: 'This is demo data. Configure your environment variables for full functionality.'
  }, { status })
}