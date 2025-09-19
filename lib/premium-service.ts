'use client'

export interface PremiumQualifications {
  completionRate: number
  averageRating: number
  membershipMonths: number
  totalEarnings: number
  isPremiumQualified: boolean
  qualificationDetails: {
    completionRate: { required: number; current: number; met: boolean }
    rating: { required: number; current: number; met: boolean }
    membership: { required: number; current: number; met: boolean }
    earnings: { required: number; current: number; met: boolean }
  }
}

class PremiumService {
  private static instance: PremiumService
  private readonly REQUIREMENTS = {
    COMPLETION_RATE: 95, // 95% or higher
    AVERAGE_RATING: 4.8, // 4.8/5.0 or higher
    MEMBERSHIP_MONTHS: 12, // 1+ years on platform
    TOTAL_EARNINGS: 10000 // $10,000+ earned
  }

  public static getInstance(): PremiumService {
    if (!PremiumService.instance) {
      PremiumService.instance = new PremiumService()
    }
    return PremiumService.instance
  }

  /**
   * Check if user qualifies for premium status
   */
  async checkPremiumQualification(userId: string): Promise<PremiumQualifications> {
    try {
      // Make API call to get user premium data
      const response = await fetch(`/api/premium/qualification/${userId}`)
      if (!response.ok) {
        throw new Error('Failed to fetch premium qualification data')
      }
      
      return await response.json()
    } catch (error) {
      console.error('Error checking premium qualification:', error)
      // Return demo data for development
      return this.getDemoPremiumQualifications(userId)
    }
  }

  /**
   * Demo premium qualifications for development
   */
  private getDemoPremiumQualifications(userId: string): PremiumQualifications {
    // Simulate different qualification levels for demo
    const demoData = {
      completionRate: 96.5,
      averageRating: 4.9,
      membershipMonths: 14,
      totalEarnings: 18784
    }

    const qualificationDetails = {
      completionRate: {
        required: this.REQUIREMENTS.COMPLETION_RATE,
        current: demoData.completionRate,
        met: demoData.completionRate >= this.REQUIREMENTS.COMPLETION_RATE
      },
      rating: {
        required: this.REQUIREMENTS.AVERAGE_RATING,
        current: demoData.averageRating,
        met: demoData.averageRating >= this.REQUIREMENTS.AVERAGE_RATING
      },
      membership: {
        required: this.REQUIREMENTS.MEMBERSHIP_MONTHS,
        current: demoData.membershipMonths,
        met: demoData.membershipMonths >= this.REQUIREMENTS.MEMBERSHIP_MONTHS
      },
      earnings: {
        required: this.REQUIREMENTS.TOTAL_EARNINGS,
        current: demoData.totalEarnings,
        met: demoData.totalEarnings >= this.REQUIREMENTS.TOTAL_EARNINGS
      }
    }

    const isPremiumQualified = Object.values(qualificationDetails).every(req => req.met)

    return {
      ...demoData,
      isPremiumQualified,
      qualificationDetails
    }
  }

  /**
   * Simple check if user has premium status
   */
  async hasPremiumStatus(userId: string): Promise<boolean> {
    try {
      const response = await fetch(`/api/premium/status/${userId}`)
      if (!response.ok) {
        // Return demo data for development
        return true // Assume premium for demo
      }
      
      const { isPremium } = await response.json()
      return isPremium
    } catch (error) {
      console.error('Error checking premium status:', error)
      // Return demo data
      return true
    }
  }

  /**
   * Grant premium status to user
   */
  async grantPremiumStatus(userId: string): Promise<boolean> {
    try {
      const response = await fetch(`/api/premium/grant`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }),
      })

      if (!response.ok) {
        throw new Error('Failed to grant premium status')
      }

      return true
    } catch (error) {
      console.error('Error granting premium status:', error)
      return false
    }
  }

  /**
   * Revoke premium status from user
   */
  async revokePremiumStatus(userId: string): Promise<boolean> {
    try {
      const response = await fetch(`/api/premium/revoke`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }),
      })

      if (!response.ok) {
        throw new Error('Failed to revoke premium status')
      }

      return true
    } catch (error) {
      console.error('Error revoking premium status:', error)
      return false
    }
  }

  /**
   * Get premium benefits for display
   */
  getPremiumBenefits(): Array<{ title: string; description: string; icon: string }> {
    return [
      {
        title: '25 Daily Interests',
        description: 'Express interest in up to 25 projects per day (vs 15 for free users)',
        icon: '⚡'
      },
      {
        title: 'Premium Badge',
        description: 'Display premium status on your profile to stand out',
        icon: '👑'
      },
      {
        title: 'Higher Visibility',
        description: 'Your proposals appear higher in search results',
        icon: '🔍'
      },
      {
        title: 'Priority Support',
        description: 'Get faster response times from our support team',
        icon: '🎧'
      },
      {
        title: 'Advanced Analytics',
        description: 'Access detailed insights about your performance',
        icon: '📊'
      },
      {
        title: 'Early Access',
        description: 'Be first to try new features and improvements',
        icon: '🚀'
      }
    ]
  }

  /**
   * Calculate progress towards premium qualification
   */
  calculatePremiumProgress(qualifications: PremiumQualifications): {
    overallProgress: number
    nextRequirement: string | null
    suggestions: string[]
  } {
    const requirements = qualifications.qualificationDetails
    const metCount = Object.values(requirements).filter(req => req.met).length
    const totalCount = Object.values(requirements).length
    const overallProgress = (metCount / totalCount) * 100

    let nextRequirement: string | null = null
    const suggestions: string[] = []

    if (!requirements.completionRate.met) {
      nextRequirement = nextRequirement || 'Improve completion rate'
      suggestions.push(`Complete more projects successfully (${requirements.completionRate.current}% → ${requirements.completionRate.required}%)`)
    }

    if (!requirements.rating.met) {
      nextRequirement = nextRequirement || 'Improve average rating'
      suggestions.push(`Maintain high client satisfaction (${requirements.rating.current} → ${requirements.rating.required} stars)`)
    }

    if (!requirements.membership.met) {
      nextRequirement = nextRequirement || 'Continue membership'
      suggestions.push(`Stay active on the platform (${requirements.membership.current} → ${requirements.membership.required} months)`)
    }

    if (!requirements.earnings.met) {
      nextRequirement = nextRequirement || 'Increase total earnings'
      suggestions.push(`Complete more projects ($${requirements.earnings.current.toLocaleString()} → $${requirements.earnings.required.toLocaleString()})`)
    }

    if (qualifications.isPremiumQualified) {
      suggestions.push('Congratulations! You meet all premium requirements.')
    }

    return {
      overallProgress,
      nextRequirement,
      suggestions
    }
  }

  /**
   * Get daily interest limits based on premium status
   */
  getDailyInterestLimit(isPremium: boolean): number {
    return isPremium ? 25 : 15
  }

  /**
   * Check if user can express interest in a project
   */
  async canExpressInterest(userId: string): Promise<{
    canExpress: boolean
    remaining: number
    limit: number
    resetsAt: string
  }> {
    try {
      const response = await fetch(`/api/premium/interest-check/${userId}`)
      if (!response.ok) {
        throw new Error('Failed to check interest availability')
      }
      
      return await response.json()
    } catch (error) {
      console.error('Error checking interest availability:', error)
      // Return demo data
      const isPremium = await this.hasPremiumStatus(userId)
      const limit = this.getDailyInterestLimit(isPremium)
      const used = Math.floor(Math.random() * (limit * 0.7)) // Random usage for demo
      
      return {
        canExpress: used < limit,
        remaining: limit - used,
        limit,
        resetsAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // Tomorrow
      }
    }
  }
}

export const premiumService = PremiumService.getInstance()