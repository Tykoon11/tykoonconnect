import { prisma } from './prisma'
import { startOfDay, endOfDay } from 'date-fns'
import { premiumService } from './premium-service'

export interface InterestStats {
  remaining: number
  used: number
  maxAllowed: number
  resetsAt: Date
  isPremium: boolean
}

export interface InterestResult {
  success: boolean
  message: string
  remainingToday?: number
}

class InterestService {
  private static instance: InterestService

  public static getInstance(): InterestService {
    if (!InterestService.instance) {
      InterestService.instance = new InterestService()
    }
    return InterestService.instance
  }

  /**
   * Check if user can show interest in a job
   */
  async canShowInterest(userId: string, jobId: string): Promise<{
    canShow: boolean
    reason?: string
    stats: InterestStats
  }> {
    try {
      // Check if already interested
      const existingInterest = await prisma.interest.findUnique({
        where: {
          jobId_freelancerId: {
            jobId,
            freelancerId: userId
          }
        }
      })

      if (existingInterest) {
        const stats = await this.getDailyStats(userId)
        return {
          canShow: false,
          reason: 'You have already shown interest in this job',
          stats
        }
      }

      // Check daily limits
      const stats = await this.getDailyStats(userId)
      
      if (stats.remaining <= 0) {
        return {
          canShow: false,
          reason: `Daily interest limit reached (${stats.maxAllowed}). Resets at midnight.`,
          stats
        }
      }

      // Check if job is still accepting interests
      const job = await prisma.job.findUnique({
        where: { id: jobId },
        select: { 
          status: true, 
          positionsTotal: true, 
          positionsFilled: true,
          _count: { select: { interests: true } }
        }
      })

      if (!job) {
        return {
          canShow: false,
          reason: 'Job not found',
          stats
        }
      }

      if (job.status !== 'open') {
        return {
          canShow: false,
          reason: 'This job is no longer accepting applications',
          stats
        }
      }

      if (job.positionsFilled >= job.positionsTotal) {
        return {
          canShow: false,
          reason: 'All positions for this job have been filled',
          stats
        }
      }

      return { canShow: true, stats }

    } catch (error) {
      console.error('Error checking interest eligibility:', error)
      const stats = await this.getDailyStats(userId)
      return {
        canShow: false,
        reason: 'Unable to process request. Please try again.',
        stats
      }
    }
  }

  /**
   * Show interest in a job
   */
  async showInterest(userId: string, jobId: string, message?: string): Promise<InterestResult> {
    try {
      // Check eligibility first
      const eligibility = await this.canShowInterest(userId, jobId)
      
      if (!eligibility.canShow) {
        return {
          success: false,
          message: eligibility.reason || 'Cannot show interest at this time'
        }
      }

      // Start transaction
      const result = await prisma.$transaction(async (tx) => {
        // Create the interest
        await tx.interest.create({
          data: {
            jobId,
            freelancerId: userId,
            message: message?.trim() || null
          }
        })

        // Update/create daily limit counter
        const today = startOfDay(new Date())
        await tx.dailyInterestLimit.upsert({
          where: {
            userId_date: {
              userId,
              date: today
            }
          },
          create: {
            userId,
            date: today,
            interestCount: 1,
            maxAllowed: 15 // Default limit
          },
          update: {
            interestCount: {
              increment: 1
            }
          }
        })

        return true
      })

      if (result) {
        const stats = await this.getDailyStats(userId)
        return {
          success: true,
          message: 'Interest shown successfully! The client can now contact you.',
          remainingToday: stats.remaining
        }
      }

      return {
        success: false,
        message: 'Failed to show interest. Please try again.'
      }

    } catch (error) {
      console.error('Error showing interest:', error)
      return {
        success: false,
        message: 'An error occurred. Please try again later.'
      }
    }
  }

  /**
   * Get user's daily interest statistics
   */
  async getDailyStats(userId: string): Promise<InterestStats> {
    try {
      const today = startOfDay(new Date())
      const tomorrow = startOfDay(new Date(Date.now() + 24 * 60 * 60 * 1000))

      // Get or create today's limit record
      const dailyLimit = await prisma.dailyInterestLimit.upsert({
        where: {
          userId_date: {
            userId,
            date: today
          }
        },
        create: {
          userId,
          date: today,
          interestCount: 0,
          maxAllowed: 15 // Default limit - can be upgraded for premium
        },
        update: {}
      })

      // Check if user has premium benefits
      const isPremium = await premiumService.hasPremiumStatus(userId)
      const maxAllowed = isPremium ? 25 : dailyLimit.maxAllowed

      return {
        remaining: Math.max(0, maxAllowed - dailyLimit.interestCount),
        used: dailyLimit.interestCount,
        maxAllowed,
        resetsAt: tomorrow,
        isPremium
      }

    } catch (error) {
      console.error('Error getting daily stats:', error)
      // Return safe defaults
      return {
        remaining: 0,
        used: 15,
        maxAllowed: 15,
        resetsAt: startOfDay(new Date(Date.now() + 24 * 60 * 60 * 1000)),
        isPremium: false
      }
    }
  }

  /**
   * Get all users who showed interest in a job (for client messaging)
   */
  async getJobInterests(jobId: string) {
    try {
      return await prisma.interest.findMany({
        where: { jobId },
        include: {
          freelancer: {
            select: {
              id: true,
              name: true,
              handle: true,
              avatarUrl: true,
              ratingAverage: true,
              ratingCount: true,
              skills: true,
              location: true
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      })
    } catch (error) {
      console.error('Error getting job interests:', error)
      return []
    }
  }

  /**
   * Check if messaging is allowed between two users for a specific job
   */
  async canMessage(fromUserId: string, toUserId: string, jobId: string): Promise<boolean> {
    try {
      // Get the job to determine client
      const job = await prisma.job.findUnique({
        where: { id: jobId },
        select: { clientId: true }
      })

      if (!job) return false

      // Check if there's an interest relationship
      const interest = await prisma.interest.findFirst({
        where: {
          jobId,
          freelancerId: job.clientId === fromUserId ? toUserId : fromUserId
        }
      })

      // Allow messaging if:
      // 1. From user is the client (clients can always message interested talents)
      // 2. To user is the client AND from user showed interest
      const isClientMessaging = fromUserId === job.clientId
      const isInterestedTalentMessaging = interest && fromUserId !== job.clientId

      return isClientMessaging || isInterestedTalentMessaging

    } catch (error) {
      console.error('Error checking messaging permissions:', error)
      return false
    }
  }

  /**
   * Get interest statistics for admin dashboard
   */
  async getGlobalStats() {
    try {
      const today = startOfDay(new Date())
      const yesterday = startOfDay(new Date(Date.now() - 24 * 60 * 60 * 1000))

      const [todayInterests, yesterdayInterests, totalInterests] = await Promise.all([
        prisma.interest.count({
          where: {
            createdAt: {
              gte: today,
              lt: endOfDay(new Date())
            }
          }
        }),
        prisma.interest.count({
          where: {
            createdAt: {
              gte: yesterday,
              lt: today
            }
          }
        }),
        prisma.interest.count()
      ])

      return {
        todayInterests,
        yesterdayInterests,
        totalInterests,
        changeFromYesterday: todayInterests - yesterdayInterests
      }

    } catch (error) {
      console.error('Error getting global stats:', error)
      return {
        todayInterests: 0,
        yesterdayInterests: 0,
        totalInterests: 0,
        changeFromYesterday: 0
      }
    }
  }

  /**
   * Reset daily limits (called by cron job at midnight)
   */
  async resetDailyLimits() {
    try {
      const threeDaysAgo = startOfDay(new Date(Date.now() - 3 * 24 * 60 * 60 * 1000))
      
      // Clean up old records (keep only last 3 days)
      await prisma.dailyInterestLimit.deleteMany({
        where: {
          date: {
            lt: threeDaysAgo
          }
        }
      })

      console.log('Daily limits reset and old records cleaned up')
      return true
    } catch (error) {
      console.error('Error resetting daily limits:', error)
      return false
    }
  }
}

export const interestService = InterestService.getInstance()