'use client'

export interface UserProfile {
  id: string
  name: string
  handle: string
  email: string
  phone?: string
  avatar?: string
  title: string
  bio: string
  location: string
  website?: string
  hourlyRate?: number
  availability: string
  joinDate: string
  lastActive: string
  isOnline: boolean
  roles: ('client' | 'freelancer')[]
  skills: {
    name: string
    level: 'beginner' | 'intermediate' | 'expert'
    endorsements?: number
  }[]
  experience: {
    id: string
    title: string
    company: string
    duration: string
    description: string
    location?: string
  }[]
  education: {
    id: string
    institution: string
    degree: string
    field: string
    startYear: number
    endYear?: number
    description?: string
  }[]
  certifications: {
    id: string
    name: string
    issuer: string
    issueDate: string
    expirationDate?: string
    credentialId?: string
    url?: string
  }[]
  portfolio: {
    id: string
    title: string
    description: string
    url: string
    thumbnail?: string
    tags: string[]
    completionDate: string
  }[]
  languages: {
    language: string
    proficiency: 'basic' | 'conversational' | 'fluent' | 'native'
  }[]
  socialLinks: {
    platform: string
    url: string
    verified?: boolean
  }[]
  preferences: {
    emailNotifications: boolean
    pushNotifications: boolean
    profileVisibility: 'public' | 'private' | 'clients_only'
    showHourlyRate: boolean
    jobAlerts: boolean
  }
  statistics: {
    completedProjects: number
    totalEarnings: number
    averageRating: number
    responseTime: string
    successRate: number
    repeatClientRate: number
  }
  verification: {
    email: boolean
    phone: boolean
    identity: boolean
    payment: boolean
    linkedIn?: boolean
  }
}

export interface ProfileUpdateData {
  name?: string
  title?: string
  bio?: string
  location?: string
  website?: string
  phone?: string
  hourlyRate?: number
  availability?: string
  skills?: UserProfile['skills']
  experience?: UserProfile['experience']
  education?: UserProfile['education']
  certifications?: UserProfile['certifications']
  portfolio?: UserProfile['portfolio']
  languages?: UserProfile['languages']
  socialLinks?: UserProfile['socialLinks']
  preferences?: Partial<UserProfile['preferences']>
}

class ProfileService {
  private baseUrl = '/api/profile'

  // Get user profile
  async getProfile(userId: string): Promise<UserProfile | null> {
    try {
      const response = await fetch(`${this.baseUrl}/${userId}`)
      if (!response.ok) {
        if (response.status === 404) return null
        throw new Error('Failed to fetch profile')
      }
      return await response.json()
    } catch (error) {
      console.error('Error fetching profile:', error)
      return this.getDemoProfile(userId)
    }
  }

  // Update user profile
  async updateProfile(userId: string, data: ProfileUpdateData): Promise<UserProfile> {
    try {
      const response = await fetch(`${this.baseUrl}/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error('Failed to update profile')
      }

      const updatedProfile = await response.json()
      
      // Update local storage cache
      if (typeof window !== 'undefined') {
        localStorage.setItem(`profile_${userId}`, JSON.stringify(updatedProfile))
      }

      return updatedProfile
    } catch (error) {
      console.error('Error updating profile:', error)
      throw error
    }
  }

  // Upload avatar
  async uploadAvatar(userId: string, file: File): Promise<string> {
    try {
      const formData = new FormData()
      formData.append('avatar', file)
      formData.append('userId', userId)

      const response = await fetch(`${this.baseUrl}/avatar`, {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Failed to upload avatar')
      }

      const { avatarUrl } = await response.json()
      return avatarUrl
    } catch (error) {
      console.error('Error uploading avatar:', error)
      throw error
    }
  }

  // Add portfolio item
  async addPortfolioItem(userId: string, item: {
    title: string
    description: string
    url: string
    thumbnail?: File
    tags: string[]
    completionDate: string
  }): Promise<UserProfile['portfolio'][0]> {
    try {
      const formData = new FormData()
      formData.append('title', item.title)
      formData.append('description', item.description)
      formData.append('url', item.url)
      formData.append('tags', JSON.stringify(item.tags))
      formData.append('completionDate', item.completionDate)
      
      if (item.thumbnail) {
        formData.append('thumbnail', item.thumbnail)
      }

      const response = await fetch(`${this.baseUrl}/${userId}/portfolio`, {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Failed to add portfolio item')
      }

      return await response.json()
    } catch (error) {
      console.error('Error adding portfolio item:', error)
      throw error
    }
  }

  // Delete portfolio item
  async deletePortfolioItem(userId: string, itemId: string): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/${userId}/portfolio/${itemId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete portfolio item')
      }
    } catch (error) {
      console.error('Error deleting portfolio item:', error)
      throw error
    }
  }

  // Verify phone number
  async verifyPhone(userId: string, phoneNumber: string): Promise<{ verificationId: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/${userId}/verify-phone`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phoneNumber }),
      })

      if (!response.ok) {
        throw new Error('Failed to send verification code')
      }

      return await response.json()
    } catch (error) {
      console.error('Error verifying phone:', error)
      throw error
    }
  }

  // Confirm phone verification
  async confirmPhoneVerification(userId: string, verificationId: string, code: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/${userId}/confirm-phone`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ verificationId, code }),
      })

      if (!response.ok) {
        throw new Error('Failed to confirm verification code')
      }

      const { verified } = await response.json()
      return verified
    } catch (error) {
      console.error('Error confirming phone verification:', error)
      return false
    }
  }

  // Search profiles
  async searchProfiles(query: string, filters?: {
    skills?: string[]
    location?: string
    minRating?: number
    maxRate?: number
    availability?: boolean
    role?: 'client' | 'freelancer'
  }): Promise<UserProfile[]> {
    try {
      const queryParams = new URLSearchParams()
      queryParams.append('q', query)
      
      if (filters?.skills?.length) {
        queryParams.append('skills', filters.skills.join(','))
      }
      if (filters?.location) queryParams.append('location', filters.location)
      if (filters?.minRating) queryParams.append('minRating', filters.minRating.toString())
      if (filters?.maxRate) queryParams.append('maxRate', filters.maxRate.toString())
      if (filters?.availability) queryParams.append('availability', 'true')
      if (filters?.role) queryParams.append('role', filters.role)

      const response = await fetch(`${this.baseUrl}/search?${queryParams}`)
      
      if (!response.ok) {
        throw new Error('Failed to search profiles')
      }

      return await response.json()
    } catch (error) {
      console.error('Error searching profiles:', error)
      return this.getDemoSearchResults(query)
    }
  }

  // Get profile analytics
  async getProfileAnalytics(userId: string): Promise<{
    profileViews: number
    profileViewsThisMonth: number
    contactsReceived: number
    proposalsReceived: number
    searchAppearances: number
    topSkillsViewed: { skill: string; views: number }[]
    viewsByLocation: { location: string; count: number }[]
    monthlyViews: { month: string; views: number }[]
  }> {
    try {
      const response = await fetch(`${this.baseUrl}/${userId}/analytics`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch profile analytics')
      }

      return await response.json()
    } catch (error) {
      console.error('Error fetching profile analytics:', error)
      return {
        profileViews: 1247,
        profileViewsThisMonth: 89,
        contactsReceived: 23,
        proposalsReceived: 12,
        searchAppearances: 156,
        topSkillsViewed: [
          { skill: 'React', views: 45 },
          { skill: 'TypeScript', views: 32 },
          { skill: 'Node.js', views: 28 }
        ],
        viewsByLocation: [
          { location: 'San Francisco', count: 34 },
          { location: 'New York', count: 28 },
          { location: 'London', count: 15 }
        ],
        monthlyViews: [
          { month: '2024-06', views: 78 },
          { month: '2024-07', views: 92 },
          { month: '2024-08', views: 105 },
          { month: '2024-09', views: 89 }
        ]
      }
    }
  }

  // Import data from LinkedIn
  async importFromLinkedIn(userId: string, linkedInData: any): Promise<UserProfile> {
    try {
      const response = await fetch(`${this.baseUrl}/${userId}/linkedin-import`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(linkedInData),
      })

      if (!response.ok) {
        throw new Error('Failed to import LinkedIn data')
      }

      return await response.json()
    } catch (error) {
      console.error('Error importing LinkedIn data:', error)
      throw error
    }
  }

  // Generate profile completion score
  getProfileCompletionScore(profile: UserProfile): {
    score: number
    maxScore: number
    percentage: number
    suggestions: string[]
  } {
    let score = 0
    const maxScore = 100
    const suggestions: string[] = []

    // Basic info (25 points)
    if (profile.name) score += 5
    if (profile.title) score += 5
    if (profile.bio && profile.bio.length > 50) score += 10
    else suggestions.push('Add a detailed bio (at least 50 characters)')
    if (profile.location) score += 5

    // Contact info (15 points)
    if (profile.email && profile.verification.email) score += 5
    if (profile.phone && profile.verification.phone) score += 5
    else suggestions.push('Add and verify your phone number')
    if (profile.website) score += 5
    else suggestions.push('Add your website or portfolio URL')

    // Skills and experience (30 points)
    if (profile.skills.length >= 5) score += 15
    else suggestions.push(`Add more skills (${profile.skills.length}/5 minimum)`)
    if (profile.experience.length >= 2) score += 15
    else suggestions.push(`Add more work experience (${profile.experience.length}/2 minimum)`)

    // Portfolio and certifications (20 points)
    if (profile.portfolio.length >= 3) score += 10
    else suggestions.push(`Add more portfolio items (${profile.portfolio.length}/3 recommended)`)
    if (profile.certifications.length >= 1) score += 5
    else suggestions.push('Add professional certifications')
    if (profile.languages.length >= 1) score += 5
    else suggestions.push('Add language skills')

    // Avatar and verification (10 points)
    if (profile.avatar) score += 5
    else suggestions.push('Upload a professional profile picture')
    if (profile.verification.identity) score += 3
    else suggestions.push('Complete identity verification')
    if (profile.verification.linkedIn) score += 2
    else suggestions.push('Connect your LinkedIn profile')

    return {
      score,
      maxScore,
      percentage: Math.round((score / maxScore) * 100),
      suggestions
    }
  }

  // Demo data generator
  private getDemoProfile(userId: string): UserProfile {
    return {
      id: userId,
      name: 'Demo User',
      handle: 'demo_user',
      email: 'demo@example.com',
      phone: '+1 (555) 123-4567',
      avatar: '/demo/avatar.jpg',
      title: 'Full Stack Developer',
      bio: 'Passionate developer with 5+ years of experience in React, Node.js, and cloud technologies. I love building scalable applications that solve real-world problems and deliver exceptional user experiences.',
      location: 'San Francisco, CA',
      website: 'https://demo-portfolio.dev',
      hourlyRate: 85,
      availability: 'Available (40 hours/week)',
      joinDate: '2024-01-15',
      lastActive: new Date().toISOString(),
      isOnline: true,
      roles: ['client', 'freelancer'],
      skills: [
        { name: 'React', level: 'expert', endorsements: 23 },
        { name: 'TypeScript', level: 'expert', endorsements: 18 },
        { name: 'Node.js', level: 'expert', endorsements: 15 },
        { name: 'Next.js', level: 'intermediate', endorsements: 12 },
        { name: 'AWS', level: 'intermediate', endorsements: 8 },
        { name: 'PostgreSQL', level: 'intermediate', endorsements: 6 }
      ],
      experience: [
        {
          id: 'exp_1',
          title: 'Senior Full Stack Developer',
          company: 'TechCorp Solutions',
          duration: '2022 - Present',
          description: 'Leading development of large-scale React applications with millions of users. Architected microservices infrastructure and mentored junior developers.',
          location: 'San Francisco, CA'
        },
        {
          id: 'exp_2',
          title: 'Frontend Developer',
          company: 'StartupXYZ',
          duration: '2020 - 2022',
          description: 'Built responsive web applications using React and TypeScript. Implemented design systems and improved application performance by 40%.',
          location: 'Remote'
        }
      ],
      education: [
        {
          id: 'edu_1',
          institution: 'University of California, Berkeley',
          degree: 'Bachelor of Science',
          field: 'Computer Science',
          startYear: 2016,
          endYear: 2020,
          description: 'Focused on software engineering and algorithms'
        }
      ],
      certifications: [
        {
          id: 'cert_1',
          name: 'AWS Certified Developer - Associate',
          issuer: 'Amazon Web Services',
          issueDate: '2023-03-15',
          expirationDate: '2026-03-15',
          credentialId: 'AWS-DEV-12345',
          url: 'https://aws.amazon.com/certification/verify'
        }
      ],
      portfolio: [
        {
          id: 'port_1',
          title: 'E-commerce Platform',
          description: 'Full-stack e-commerce solution with React frontend and Node.js backend',
          url: 'https://demo-ecommerce.vercel.app',
          thumbnail: '/demo/ecommerce-thumb.jpg',
          tags: ['React', 'Node.js', 'PostgreSQL', 'Stripe'],
          completionDate: '2024-08-15'
        },
        {
          id: 'port_2',
          title: 'Real-time Dashboard',
          description: 'Analytics dashboard with real-time data visualization',
          url: 'https://demo-dashboard.vercel.app',
          thumbnail: '/demo/dashboard-thumb.jpg',
          tags: ['React', 'TypeScript', 'D3.js', 'WebSocket'],
          completionDate: '2024-07-20'
        }
      ],
      languages: [
        { language: 'English', proficiency: 'native' },
        { language: 'Spanish', proficiency: 'conversational' },
        { language: 'French', proficiency: 'basic' }
      ],
      socialLinks: [
        { platform: 'GitHub', url: 'https://github.com/demouser', verified: true },
        { platform: 'LinkedIn', url: 'https://linkedin.com/in/demouser', verified: true },
        { platform: 'Twitter', url: 'https://twitter.com/demouser', verified: false }
      ],
      preferences: {
        emailNotifications: true,
        pushNotifications: true,
        profileVisibility: 'public',
        showHourlyRate: true,
        jobAlerts: true
      },
      statistics: {
        completedProjects: 47,
        totalEarnings: 125000,
        averageRating: 4.9,
        responseTime: '< 2 hours',
        successRate: 98,
        repeatClientRate: 75
      },
      verification: {
        email: true,
        phone: true,
        identity: true,
        payment: true,
        linkedIn: true
      }
    }
  }

  private getDemoSearchResults(query: string): UserProfile[] {
    // Return filtered demo profiles based on query
    const profiles = [
      this.getDemoProfile('user_1'),
      this.getDemoProfile('user_2'),
      this.getDemoProfile('user_3')
    ]
    
    return profiles.filter(profile => 
      profile.name.toLowerCase().includes(query.toLowerCase()) ||
      profile.title.toLowerCase().includes(query.toLowerCase()) ||
      profile.skills.some(skill => skill.name.toLowerCase().includes(query.toLowerCase()))
    )
  }
}

export const profileService = new ProfileService()