import { prisma } from './prisma'

interface RateLimitConfig {
  windowMs: number
  maxRequests: number
}

const RATE_LIMITS: Record<string, RateLimitConfig> = {
  'proposals': { windowMs: 24 * 60 * 60 * 1000, maxRequests: 20 }, // 20 per day
  'messages': { windowMs: 60 * 60 * 1000, maxRequests: 120 }, // 120 per hour
  'reports': { windowMs: 24 * 60 * 60 * 1000, maxRequests: 10 }, // 10 per day
  'jobs': { windowMs: 24 * 60 * 60 * 1000, maxRequests: 5 }, // 5 per day
  'auth': { windowMs: 15 * 60 * 1000, maxRequests: 5 }, // 5 per 15 minutes
}

export async function checkRateLimit(
  userId: string, 
  action: keyof typeof RATE_LIMITS
): Promise<{ allowed: boolean; remaining: number; resetTime: Date }> {
  const config = RATE_LIMITS[action]
  if (!config) {
    return { allowed: true, remaining: Infinity, resetTime: new Date() }
  }

  const now = new Date()
  const windowStart = new Date(now.getTime() - config.windowMs)
  const windowKey = `${action}-${Math.floor(now.getTime() / config.windowMs)}`

  try {
    // Clean up old rate limit records
    await prisma.rateLimit.deleteMany({
      where: {
        windowEnd: { lt: now }
      }
    })

    // Get or create current window record
    const existing = await prisma.rateLimit.findFirst({
      where: {
        userId,
        windowKey
      }
    })

    if (!existing) {
      // First request in this window
      await prisma.rateLimit.create({
        data: {
          userId,
          windowKey,
          count: 1,
          windowEnd: new Date(now.getTime() + config.windowMs)
        }
      })
      
      return {
        allowed: true,
        remaining: config.maxRequests - 1,
        resetTime: new Date(now.getTime() + config.windowMs)
      }
    }

    if (existing.count >= config.maxRequests) {
      return {
        allowed: false,
        remaining: 0,
        resetTime: existing.windowEnd
      }
    }

    // Increment counter
    await prisma.rateLimit.update({
      where: { id: existing.id },
      data: { count: existing.count + 1 }
    })

    return {
      allowed: true,
      remaining: config.maxRequests - (existing.count + 1),
      resetTime: existing.windowEnd
    }
  } catch (error) {
    console.error('Rate limit check error:', error)
    // Fail open - allow request if there's a database error
    return { allowed: true, remaining: Infinity, resetTime: new Date() }
  }
}

export function createRateLimitMiddleware(action: keyof typeof RATE_LIMITS) {
  return async (userId: string) => {
    const result = await checkRateLimit(userId, action)
    
    if (!result.allowed) {
      const error = new Error(`Rate limit exceeded for ${action}`)
      ;(error as any).statusCode = 429
      ;(error as any).retryAfter = Math.ceil((result.resetTime.getTime() - Date.now()) / 1000)
      throw error
    }

    return result
  }
}

export async function getRateLimitStatus(userId: string, action: keyof typeof RATE_LIMITS) {
  const config = RATE_LIMITS[action]
  if (!config) return null

  const now = new Date()
  const windowKey = `${action}-${Math.floor(now.getTime() / config.windowMs)}`

  const existing = await prisma.rateLimit.findFirst({
    where: { userId, windowKey }
  })

  return {
    action,
    limit: config.maxRequests,
    used: existing?.count || 0,
    remaining: config.maxRequests - (existing?.count || 0),
    resetTime: existing?.windowEnd || new Date(now.getTime() + config.windowMs)
  }
}