import { supabase } from '@/lib/supabase/client'

export interface UserAnalytics {
  userId: string
  activeJobs: number
  totalSpent: number
  avgRating: number
  proposals: number
  completionRate: number
  avgResponseTime: string
  activeProjects: number
  totalEarned: number
  completedJobs: number
  successRate: number
  avgDeliveryTime: string
  monthlyData: Array<{ x: string; y: number }>
  lastUpdated: Date
}

export interface DashboardData {
  stats: UserAnalytics
  recentJobs: Array<{
    id: string
    title: string
    status: string
    budget: number
    proposals: number
    created: string
  }>
  recentProjects: Array<{
    id: string
    title: string
    client: string
    status: string
    earned: number
    deadline: string
  }>
  skillsData: Array<{
    label: string
    value: number
    color: string
  }>
}

class AnalyticsService {
  private static instance: AnalyticsService
  private cache: Map<string, { data: DashboardData; timestamp: number }> = new Map()
  private readonly CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

  public static getInstance(): AnalyticsService {
    if (!AnalyticsService.instance) {
      AnalyticsService.instance = new AnalyticsService()
    }
    return AnalyticsService.instance
  }

  async getDashboardData(userId: string): Promise<DashboardData> {
    // Check cache first
    const cached = this.cache.get(userId)
    if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
      return cached.data
    }

    try {
      // For demo purposes, generate realistic data based on user behavior
      // In production, this would query actual database tables
      const data = await this.generateRealtimeAnalytics(userId)
      
      // Cache the result
      this.cache.set(userId, {
        data,
        timestamp: Date.now()
      })

      // Store analytics in local storage for session persistence
      if (typeof window !== 'undefined') {
        localStorage.setItem(`analytics_${userId}`, JSON.stringify({
          data,
          timestamp: Date.now()
        }))
      }

      return data
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
      return this.getFallbackData()
    }
  }

  private async generateRealtimeAnalytics(userId: string): Promise<DashboardData> {
    // Simulate real-time data that changes over time
    const now = new Date()
    const timeBasedVariation = Math.sin(now.getTime() / 1000000) * 0.1 + 1

    // Get stored session data or generate new
    let sessionData = null
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(`analytics_${userId}`)
      if (stored) {
        const parsed = JSON.parse(stored)
        if (Date.now() - parsed.timestamp < 24 * 60 * 60 * 1000) { // 24 hours
          sessionData = parsed.data
        }
      }
    }

    // Generate base stats with some randomization for realism
    const baseActiveJobs = sessionData?.stats?.activeJobs || Math.floor(Math.random() * 5) + 1
    const baseTotalSpent = sessionData?.stats?.totalSpent || Math.floor(Math.random() * 20000) + 5000
    const baseCompletedJobs = sessionData?.stats?.completedJobs || Math.floor(Math.random() * 25) + 10

    const stats: UserAnalytics = {
      userId,
      activeJobs: Math.max(1, Math.floor(baseActiveJobs * timeBasedVariation)),
      totalSpent: Math.floor(baseTotalSpent * timeBasedVariation),
      avgRating: Math.min(5, Math.max(4, 4.8 + (Math.random() - 0.5) * 0.4)),
      proposals: Math.floor((15 + Math.random() * 20) * timeBasedVariation),
      completionRate: Math.min(100, Math.max(85, 95 + (Math.random() - 0.5) * 10)),
      avgResponseTime: `${(2 + Math.random() * 2).toFixed(1)} hours`,
      activeProjects: Math.max(1, Math.floor((2 + Math.random() * 3) * timeBasedVariation)),
      totalEarned: Math.floor((8000 + Math.random() * 15000) * timeBasedVariation),
      completedJobs: Math.floor(baseCompletedJobs * timeBasedVariation),
      successRate: Math.min(100, Math.max(90, 98 + (Math.random() - 0.5) * 8)),
      avgDeliveryTime: `${(0.5 + Math.random() * 2).toFixed(1)} days early`,
      monthlyData: this.generateMonthlyData(),
      lastUpdated: now
    }

    const recentJobs = [
      {
        id: '1',
        title: 'E-commerce Website Development',
        status: 'active',
        budget: Math.floor(3500 + Math.random() * 2000),
        proposals: Math.floor(8 + Math.random() * 10),
        created: this.getRandomRecentDate()
      },
      {
        id: '2',
        title: 'Mobile App UI Design',
        status: 'completed',
        budget: Math.floor(2200 + Math.random() * 1000),
        proposals: Math.floor(5 + Math.random() * 8),
        created: this.getRandomRecentDate()
      },
      {
        id: '3',
        title: 'API Integration Project',
        status: 'in_progress',
        budget: Math.floor(1800 + Math.random() * 1200),
        proposals: Math.floor(12 + Math.random() * 15),
        created: this.getRandomRecentDate()
      }
    ]

    const recentProjects = [
      {
        id: '1',
        title: 'React Dashboard Development',
        client: 'TechCorp Inc.',
        status: 'In Progress',
        earned: Math.floor(3200 + Math.random() * 2000),
        deadline: this.getFutureDate()
      },
      {
        id: '2',
        title: 'Logo Design for Startup',
        client: 'Innovation Labs',
        status: 'Under Review',
        earned: Math.floor(600 + Math.random() * 400),
        deadline: this.getFutureDate()
      }
    ]

    const skillsData = [
      { label: 'React', value: Math.floor(90 + Math.random() * 10), color: '#61DAFB' },
      { label: 'Node.js', value: Math.floor(85 + Math.random() * 10), color: '#339933' },
      { label: 'TypeScript', value: Math.floor(88 + Math.random() * 10), color: '#3178C6' },
      { label: 'Python', value: Math.floor(70 + Math.random() * 15), color: '#3776AB' }
    ]

    return {
      stats,
      recentJobs,
      recentProjects,
      skillsData
    }
  }

  private generateMonthlyData(): Array<{ x: string; y: number }> {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']
    const baseValue = 2000 + Math.random() * 1000
    
    return months.map((month, index) => ({
      x: month,
      y: Math.floor(baseValue + Math.sin(index) * 800 + Math.random() * 600)
    }))
  }

  private getRandomRecentDate(): string {
    const days = Math.floor(Math.random() * 14) + 1
    const date = new Date()
    date.setDate(date.getDate() - days)
    return date.toISOString().split('T')[0]
  }

  private getFutureDate(): string {
    const days = Math.floor(Math.random() * 30) + 5
    const date = new Date()
    date.setDate(date.getDate() + days)
    return date.toISOString().split('T')[0]
  }

  private getFallbackData(): DashboardData {
    return {
      stats: {
        userId: 'demo',
        activeJobs: 3,
        totalSpent: 15750,
        avgRating: 4.8,
        proposals: 23,
        completionRate: 95,
        avgResponseTime: '2.4 hours',
        activeProjects: 2,
        totalEarned: 12400,
        completedJobs: 18,
        successRate: 98,
        avgDeliveryTime: '1.2 days early',
        monthlyData: [
          { x: 'Jan', y: 2400 },
          { x: 'Feb', y: 3200 },
          { x: 'Mar', y: 2800 },
          { x: 'Apr', y: 4100 },
          { x: 'May', y: 3600 },
          { x: 'Jun', y: 4200 }
        ],
        lastUpdated: new Date()
      },
      recentJobs: [],
      recentProjects: [],
      skillsData: [
        { label: 'React', value: 95, color: '#61DAFB' },
        { label: 'Node.js', value: 88, color: '#339933' },
        { label: 'TypeScript', value: 92, color: '#3178C6' },
        { label: 'Python', value: 76, color: '#3776AB' }
      ]
    }
  }

  // Update specific metrics (for real-time updates)
  async updateMetric(userId: string, metric: string, value: number): Promise<void> {
    const cached = this.cache.get(userId)
    if (cached) {
      // Update the specific metric
      (cached.data.stats as any)[metric] = value
      cached.data.stats.lastUpdated = new Date()
      
      // Update localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem(`analytics_${userId}`, JSON.stringify({
          data: cached.data,
          timestamp: Date.now()
        }))
      }
    }
  }

  // Clear cache to force refresh
  clearCache(userId?: string): void {
    if (userId) {
      this.cache.delete(userId)
      if (typeof window !== 'undefined') {
        localStorage.removeItem(`analytics_${userId}`)
      }
    } else {
      this.cache.clear()
      if (typeof window !== 'undefined') {
        const keys = Object.keys(localStorage)
        keys.forEach(key => {
          if (key.startsWith('analytics_')) {
            localStorage.removeItem(key)
          }
        })
      }
    }
  }
}

export const analyticsService = AnalyticsService.getInstance()