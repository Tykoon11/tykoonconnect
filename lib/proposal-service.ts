'use client'

export interface JobProposal {
  id: string
  jobId: string
  jobTitle: string
  freelancerId: string
  freelancerName: string
  freelancerHandle: string
  freelancerRating: number
  freelancerAvatar?: string
  clientId: string
  clientName: string
  proposedRate: number
  rateType: 'fixed' | 'hourly'
  estimatedHours?: number
  timeline: string
  coverLetter: string
  attachments: {
    id: string
    name: string
    type: string
    size: number
    url: string
  }[]
  skills: string[]
  portfolio: {
    id: string
    title: string
    description: string
    url: string
    thumbnail?: string
  }[]
  status: 'pending' | 'accepted' | 'rejected' | 'withdrawn' | 'interviewing'
  createdAt: string
  updatedAt: string
  viewedAt?: string
  clientFeedback?: {
    rating?: number
    comment?: string
    timestamp: string
  }
  milestones?: {
    id: string
    title: string
    description: string
    amount: number
    dueDate: string
    deliverables: string[]
  }[]
}

export interface ProposalFilter {
  status?: JobProposal['status']
  minRate?: number
  maxRate?: number
  rateType?: JobProposal['rateType']
  skills?: string[]
  dateRange?: {
    start: string
    end: string
  }
  freelancerId?: string
  clientId?: string
  jobId?: string
}

export interface ProposalMetrics {
  totalProposals: number
  acceptedProposals: number
  rejectedProposals: number
  pendingProposals: number
  averageRate: number
  acceptanceRate: number
  averageResponseTime: number
  topSkills: { skill: string; count: number }[]
  monthlyStats: {
    month: string
    submitted: number
    accepted: number
    rejected: number
    avgRate: number
  }[]
}

class ProposalService {
  private baseUrl = '/api/proposals'

  // Submit a new proposal
  async submitProposal(data: {
    jobId: string
    proposedRate: number
    rateType: 'fixed' | 'hourly'
    estimatedHours?: number
    timeline: string
    coverLetter: string
    attachments?: File[]
    milestones?: Omit<JobProposal['milestones'][0], 'id'>[]
  }): Promise<JobProposal> {
    try {
      const formData = new FormData()
      formData.append('jobId', data.jobId)
      formData.append('proposedRate', data.proposedRate.toString())
      formData.append('rateType', data.rateType)
      formData.append('timeline', data.timeline)
      formData.append('coverLetter', data.coverLetter)
      
      if (data.estimatedHours) {
        formData.append('estimatedHours', data.estimatedHours.toString())
      }
      
      if (data.milestones) {
        formData.append('milestones', JSON.stringify(data.milestones))
      }
      
      // Add attachments
      data.attachments?.forEach((file, index) => {
        formData.append(`attachment_${index}`, file)
      })

      const response = await fetch(`${this.baseUrl}/submit`, {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Failed to submit proposal')
      }

      return await response.json()
    } catch (error) {
      console.error('Error submitting proposal:', error)
      throw error
    }
  }

  // Get proposals for a freelancer
  async getFreelancerProposals(freelancerId: string, filters?: ProposalFilter): Promise<JobProposal[]> {
    try {
      const queryParams = new URLSearchParams()
      if (filters?.status) queryParams.append('status', filters.status)
      if (filters?.minRate) queryParams.append('minRate', filters.minRate.toString())
      if (filters?.maxRate) queryParams.append('maxRate', filters.maxRate.toString())
      if (filters?.rateType) queryParams.append('rateType', filters.rateType)
      if (filters?.dateRange?.start) queryParams.append('startDate', filters.dateRange.start)
      if (filters?.dateRange?.end) queryParams.append('endDate', filters.dateRange.end)

      const response = await fetch(`${this.baseUrl}/freelancer/${freelancerId}?${queryParams}`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch proposals')
      }

      return await response.json()
    } catch (error) {
      console.error('Error fetching freelancer proposals:', error)
      return this.getDemoFreelancerProposals(freelancerId)
    }
  }

  // Get proposals for a job (client view)
  async getJobProposals(jobId: string): Promise<JobProposal[]> {
    try {
      const response = await fetch(`${this.baseUrl}/job/${jobId}`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch job proposals')
      }

      return await response.json()
    } catch (error) {
      console.error('Error fetching job proposals:', error)
      return this.getDemoJobProposals(jobId)
    }
  }

  // Update proposal status (client action)
  async updateProposalStatus(proposalId: string, status: JobProposal['status'], feedback?: {
    rating?: number
    comment?: string
  }): Promise<JobProposal> {
    try {
      const response = await fetch(`${this.baseUrl}/${proposalId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status, feedback }),
      })

      if (!response.ok) {
        throw new Error('Failed to update proposal status')
      }

      return await response.json()
    } catch (error) {
      console.error('Error updating proposal status:', error)
      throw error
    }
  }

  // Withdraw proposal (freelancer action)
  async withdrawProposal(proposalId: string): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/${proposalId}/withdraw`, {
        method: 'POST',
      })

      if (!response.ok) {
        throw new Error('Failed to withdraw proposal')
      }
    } catch (error) {
      console.error('Error withdrawing proposal:', error)
      throw error
    }
  }

  // Get proposal metrics for freelancer
  async getProposalMetrics(freelancerId: string, period?: '30d' | '90d' | '1y' | 'all'): Promise<ProposalMetrics> {
    try {
      const response = await fetch(`${this.baseUrl}/metrics/${freelancerId}?period=${period || '30d'}`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch proposal metrics')
      }

      return await response.json()
    } catch (error) {
      console.error('Error fetching proposal metrics:', error)
      return this.getDemoMetrics(freelancerId)
    }
  }

  // Schedule interview
  async scheduleInterview(proposalId: string, interviewData: {
    dateTime: string
    duration: number
    platform: 'zoom' | 'meet' | 'skype' | 'phone'
    notes?: string
  }): Promise<{ meetingLink?: string; calendarEvent?: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/${proposalId}/interview`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(interviewData),
      })

      if (!response.ok) {
        throw new Error('Failed to schedule interview')
      }

      return await response.json()
    } catch (error) {
      console.error('Error scheduling interview:', error)
      throw error
    }
  }

  // Get proposal analytics for clients
  async getClientProposalAnalytics(clientId: string): Promise<{
    totalJobs: number
    totalProposals: number
    averageProposalsPerJob: number
    acceptanceRate: number
    averageResponseTime: number
    topFreelancerSkills: { skill: string; count: number }[]
    avgProposalRate: number
    rateDistribution: { range: string; count: number }[]
  }> {
    try {
      const response = await fetch(`${this.baseUrl}/analytics/client/${clientId}`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch client analytics')
      }

      return await response.json()
    } catch (error) {
      console.error('Error fetching client analytics:', error)
      return {
        totalJobs: 8,
        totalProposals: 67,
        averageProposalsPerJob: 8.4,
        acceptanceRate: 15.2,
        averageResponseTime: 2.3,
        topFreelancerSkills: [
          { skill: 'React', count: 23 },
          { skill: 'Node.js', count: 18 },
          { skill: 'TypeScript', count: 15 }
        ],
        avgProposalRate: 75.50,
        rateDistribution: [
          { range: '$20-40/hr', count: 15 },
          { range: '$40-80/hr', count: 32 },
          { range: '$80-120/hr', count: 18 },
          { range: '$120+/hr', count: 2 }
        ]
      }
    }
  }

  // Smart proposal recommendations
  async getProposalRecommendations(freelancerId: string, jobId: string): Promise<{
    suggestedRate: { min: number; max: number; recommended: number }
    competitionLevel: 'low' | 'medium' | 'high'
    winProbability: number
    tips: string[]
    similarProposals: {
      rate: number
      status: string
      timeline: string
      skills: string[]
    }[]
  }> {
    try {
      const response = await fetch(`${this.baseUrl}/recommendations/${freelancerId}/${jobId}`)
      
      if (!response.ok) {
        throw new Error('Failed to get recommendations')
      }

      return await response.json()
    } catch (error) {
      console.error('Error getting recommendations:', error)
      return {
        suggestedRate: { min: 60, max: 85, recommended: 75 },
        competitionLevel: 'medium',
        winProbability: 68,
        tips: [
          'Your skills match 90% of the job requirements',
          'Consider highlighting your React and TypeScript experience',
          'Propose 2-3 milestones to increase client confidence',
          'Your proposed timeline is competitive'
        ],
        similarProposals: [
          { rate: 70, status: 'accepted', timeline: '3 weeks', skills: ['React', 'TypeScript'] },
          { rate: 80, status: 'rejected', timeline: '2 weeks', skills: ['React', 'Node.js'] },
          { rate: 65, status: 'pending', timeline: '4 weeks', skills: ['React', 'Next.js'] }
        ]
      }
    }
  }

  // Demo data generators
  private getDemoFreelancerProposals(freelancerId: string): JobProposal[] {
    return [
      {
        id: 'prop_1',
        jobId: 'job_1',
        jobTitle: 'React E-commerce Dashboard Development',
        freelancerId,
        freelancerName: 'Your Profile',
        freelancerHandle: 'demo_user',
        freelancerRating: 4.9,
        clientId: 'client_1',
        clientName: 'TechCorp Inc.',
        proposedRate: 85,
        rateType: 'hourly',
        estimatedHours: 120,
        timeline: '6-8 weeks',
        coverLetter: 'I have extensive experience building e-commerce dashboards with React and have delivered similar projects for Fortune 500 companies. I can start immediately and deliver a high-quality solution.',
        attachments: [
          {
            id: 'att_1',
            name: 'portfolio_sample.pdf',
            type: 'application/pdf',
            size: 1024000,
            url: '/demo/portfolio.pdf'
          }
        ],
        skills: ['React', 'TypeScript', 'Node.js', 'PostgreSQL'],
        portfolio: [
          {
            id: 'port_1',
            title: 'E-commerce Admin Dashboard',
            description: 'Full-stack dashboard with real-time analytics',
            url: 'https://demo-dashboard.vercel.app',
            thumbnail: '/demo/dashboard-thumb.jpg'
          }
        ],
        status: 'pending',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
        updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
        milestones: [
          {
            id: 'mile_1',
            title: 'Project Setup & Architecture',
            description: 'Set up the development environment and core architecture',
            amount: 1200,
            dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7).toISOString(),
            deliverables: ['Project structure', 'Development environment', 'Database schema']
          },
          {
            id: 'mile_2',
            title: 'Core Dashboard Features',
            description: 'Implement main dashboard functionality and components',
            amount: 3400,
            dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 21).toISOString(),
            deliverables: ['Dashboard UI', 'Data visualization', 'User management']
          }
        ]
      },
      {
        id: 'prop_2',
        jobId: 'job_2',
        jobTitle: 'Mobile App UI/UX Design',
        freelancerId,
        freelancerName: 'Your Profile',
        freelancerHandle: 'demo_user',
        freelancerRating: 4.9,
        clientId: 'client_2',
        clientName: 'StartupXYZ',
        proposedRate: 2500,
        rateType: 'fixed',
        timeline: '3-4 weeks',
        coverLetter: 'I specialize in mobile UI/UX design and have created award-winning apps. I understand your target audience and can deliver a design that converts.',
        attachments: [],
        skills: ['UI Design', 'UX Research', 'Figma', 'Prototyping'],
        portfolio: [
          {
            id: 'port_2',
            title: 'FinTech Mobile App Design',
            description: 'Complete UI/UX design for banking app',
            url: 'https://figma.com/demo-fintech',
            thumbnail: '/demo/fintech-thumb.jpg'
          }
        ],
        status: 'accepted',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
        updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1).toISOString(),
        viewedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
        clientFeedback: {
          rating: 5,
          comment: 'Excellent proposal with great portfolio examples. Looking forward to working together!',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1).toISOString()
        }
      }
    ]
  }

  private getDemoJobProposals(jobId: string): JobProposal[] {
    return [
      {
        id: 'prop_3',
        jobId,
        jobTitle: 'React Developer Position',
        freelancerId: 'freelancer_1',
        freelancerName: 'Sarah Johnson',
        freelancerHandle: 'sarah_dev',
        freelancerRating: 4.9,
        clientId: 'demo_user',
        clientName: 'Your Company',
        proposedRate: 75,
        rateType: 'hourly',
        estimatedHours: 160,
        timeline: '8-10 weeks',
        coverLetter: 'I\'m a senior React developer with 6 years of experience. I\'ve built similar e-commerce platforms and can deliver a high-quality solution that meets all your requirements.',
        attachments: [
          {
            id: 'att_2',
            name: 'react_portfolio.pdf',
            type: 'application/pdf',
            size: 2048000,
            url: '/demo/react-portfolio.pdf'
          }
        ],
        skills: ['React', 'Next.js', 'TypeScript', 'Redux', 'CSS3'],
        portfolio: [
          {
            id: 'port_3',
            title: 'E-commerce Platform',
            description: 'Full-stack e-commerce solution with payment integration',
            url: 'https://ecommerce-demo.com',
            thumbnail: '/demo/ecommerce-thumb.jpg'
          }
        ],
        status: 'pending',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1).toISOString(),
        updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1).toISOString()
      },
      {
        id: 'prop_4',
        jobId,
        jobTitle: 'React Developer Position',
        freelancerId: 'freelancer_2',
        freelancerName: 'Mike Chen',
        freelancerHandle: 'mike_fullstack',
        freelancerRating: 4.7,
        clientId: 'demo_user',
        clientName: 'Your Company',
        proposedRate: 3500,
        rateType: 'fixed',
        timeline: '6 weeks',
        coverLetter: 'I can deliver your React project with modern best practices and clean code. My fixed-price approach ensures you get exactly what you need within budget.',
        attachments: [],
        skills: ['React', 'Node.js', 'MongoDB', 'AWS'],
        portfolio: [
          {
            id: 'port_4',
            title: 'SaaS Dashboard',
            description: 'Real-time analytics dashboard for B2B clients',
            url: 'https://saas-dashboard-demo.com',
            thumbnail: '/demo/saas-thumb.jpg'
          }
        ],
        status: 'interviewing',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
        updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
        viewedAt: new Date(Date.now() - 1000 * 60 * 60 * 18).toISOString()
      }
    ]
  }

  private getDemoMetrics(freelancerId: string): ProposalMetrics {
    return {
      totalProposals: 24,
      acceptedProposals: 8,
      rejectedProposals: 12,
      pendingProposals: 4,
      averageRate: 78.50,
      acceptanceRate: 33.3,
      averageResponseTime: 2.1,
      topSkills: [
        { skill: 'React', count: 18 },
        { skill: 'TypeScript', count: 15 },
        { skill: 'Node.js', count: 12 },
        { skill: 'Next.js', count: 10 }
      ],
      monthlyStats: [
        { month: '2024-06', submitted: 6, accepted: 2, rejected: 3, avgRate: 72.00 },
        { month: '2024-07', submitted: 8, accepted: 3, rejected: 4, avgRate: 76.50 },
        { month: '2024-08', submitted: 7, accepted: 2, rejected: 4, avgRate: 81.00 },
        { month: '2024-09', submitted: 3, accepted: 1, rejected: 1, avgRate: 85.00 }
      ]
    }
  }
}

export const proposalService = new ProposalService()