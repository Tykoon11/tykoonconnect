'use client'

interface LinkedInProfile {
  firstName: string
  lastName: string
  headline: string
  summary: string
  location: {
    name: string
    country: string
  }
  positions: {
    title: string
    companyName: string
    startDate: { year: number; month: number }
    endDate?: { year: number; month: number }
    description?: string
    location?: string
  }[]
  skills: {
    name: string
    endorsementCount?: number
  }[]
  educations: {
    schoolName: string
    degree?: string
    fieldOfStudy?: string
    startDate?: { year: number; month: number }
    endDate?: { year: number; month: number }
  }[]
  emailAddress?: string
  profilePicture?: string
}

interface LinkedInApiConfig {
  clientId: string
  clientSecret: string
  redirectUri: string
  scopes: string[]
}

class LinkedInApiService {
  private config: LinkedInApiConfig
  private accessToken: string | null = null

  constructor() {
    this.config = {
      clientId: process.env.NEXT_PUBLIC_LINKEDIN_CLIENT_ID || '',
      clientSecret: process.env.LINKEDIN_CLIENT_SECRET || '',
      redirectUri: process.env.NEXT_PUBLIC_LINKEDIN_REDIRECT_URI || `${window.location.origin}/auth/linkedin/callback`,
      scopes: [
        'r_liteprofile',
        'r_emailaddress', 
        'r_basicprofile',
        'r_organization_social',
        'rw_organization_admin'
      ]
    }
  }

  // Generate LinkedIn OAuth URL
  getAuthorizationUrl(): string {
    const params = new URLSearchParams({
      response_type: 'code',
      client_id: this.config.clientId,
      redirect_uri: this.config.redirectUri,
      scope: this.config.scopes.join(' '),
      state: this.generateState()
    })

    return `https://www.linkedin.com/oauth/v2/authorization?${params.toString()}`
  }

  // Exchange authorization code for access token
  async exchangeCodeForToken(code: string): Promise<string> {
    try {
      const response = await fetch('/api/linkedin/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code,
          redirect_uri: this.config.redirectUri,
          client_id: this.config.clientId,
          client_secret: this.config.clientSecret,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to exchange code for token')
      }

      const data = await response.json()
      this.accessToken = data.access_token
      
      // Store token securely
      localStorage.setItem('linkedin_access_token', data.access_token)
      
      return data.access_token
    } catch (error) {
      console.error('Token exchange error:', error)
      throw new Error('Failed to authenticate with LinkedIn')
    }
  }

  // Get LinkedIn profile data
  async getProfile(): Promise<LinkedInProfile> {
    if (!this.accessToken) {
      this.accessToken = localStorage.getItem('linkedin_access_token')
      if (!this.accessToken) {
        throw new Error('No access token available')
      }
    }

    try {
      // Get basic profile
      const profileResponse = await fetch('/api/linkedin/profile', {
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
        },
      })

      if (!profileResponse.ok) {
        if (profileResponse.status === 401) {
          // Token expired, clear it
          this.clearToken()
          throw new Error('LinkedIn token expired. Please re-authenticate.')
        }
        throw new Error('Failed to fetch LinkedIn profile')
      }

      const profileData = await profileResponse.json()

      // Get positions
      const positionsResponse = await fetch('/api/linkedin/positions', {
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
        },
      })

      let positions = []
      if (positionsResponse.ok) {
        const positionsData = await positionsResponse.json()
        positions = positionsData.elements || []
      }

      // Get skills
      const skillsResponse = await fetch('/api/linkedin/skills', {
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
        },
      })

      let skills = []
      if (skillsResponse.ok) {
        const skillsData = await skillsResponse.json()
        skills = skillsData.elements || []
      }

      // Transform data to our format
      return this.transformLinkedInData(profileData, positions, skills)

    } catch (error) {
      console.error('Profile fetch error:', error)
      throw error
    }
  }

  // Transform LinkedIn API response to our profile format
  private transformLinkedInData(profile: any, positions: any[], skills: any[]): LinkedInProfile {
    return {
      firstName: profile.firstName?.localized?.en_US || profile.localizedFirstName || '',
      lastName: profile.lastName?.localized?.en_US || profile.localizedLastName || '',
      headline: profile.headline?.localized?.en_US || profile.localizedHeadline || '',
      summary: profile.summary?.localized?.en_US || profile.localizedSummary || '',
      location: {
        name: profile.location?.name || '',
        country: profile.location?.country || ''
      },
      positions: positions.map(pos => ({
        title: pos.title?.localized?.en_US || pos.title || '',
        companyName: pos.companyName?.localized?.en_US || pos.companyName || '',
        startDate: pos.startDate || { year: new Date().getFullYear(), month: 1 },
        endDate: pos.endDate,
        description: pos.description?.localized?.en_US || pos.description || '',
        location: pos.location?.name || ''
      })),
      skills: skills.map(skill => ({
        name: skill.name?.localized?.en_US || skill.name || '',
        endorsementCount: skill.endorsementCount || 0
      })),
      educations: [], // Would require additional API call
      emailAddress: profile.emailAddress,
      profilePicture: profile.profilePicture?.displayImage || ''
    }
  }

  // Import LinkedIn data and convert to our profile format
  async importProfileData(): Promise<{
    name: string
    title: string
    bio: string
    location: string
    skills: { name: string; level: 'beginner' | 'intermediate' | 'expert' }[]
    experience: {
      id: string
      title: string
      company: string
      duration: string
      description: string
    }[]
  }> {
    try {
      const linkedInProfile = await this.getProfile()

      // Convert skills with endorsement-based levels
      const skills = linkedInProfile.skills.map(skill => ({
        name: skill.name,
        level: this.determineSkillLevel(skill.endorsementCount || 0)
      }))

      // Convert experience
      const experience = linkedInProfile.positions.map((pos, index) => ({
        id: `linkedin-${index}`,
        title: pos.title,
        company: pos.companyName,
        duration: this.formatDateRange(pos.startDate, pos.endDate),
        description: pos.description || `${pos.title} at ${pos.companyName}`
      }))

      return {
        name: `${linkedInProfile.firstName} ${linkedInProfile.lastName}`.trim(),
        title: linkedInProfile.headline,
        bio: linkedInProfile.summary || linkedInProfile.headline,
        location: linkedInProfile.location.name,
        skills: skills.slice(0, 10), // Limit to top 10 skills
        experience: experience.slice(0, 5) // Limit to recent 5 positions
      }

    } catch (error) {
      console.error('LinkedIn import error:', error)
      throw error
    }
  }

  // Determine skill level based on endorsements
  private determineSkillLevel(endorsements: number): 'beginner' | 'intermediate' | 'expert' {
    if (endorsements >= 20) return 'expert'
    if (endorsements >= 5) return 'intermediate'
    return 'beginner'
  }

  // Format date range for experience
  private formatDateRange(startDate: { year: number; month: number }, endDate?: { year: number; month: number }): string {
    const start = new Date(startDate.year, startDate.month - 1)
    const startFormatted = start.toLocaleDateString('en-US', { year: 'numeric', month: 'short' })
    
    if (!endDate) {
      return `${startFormatted} - Present`
    }
    
    const end = new Date(endDate.year, endDate.month - 1)
    const endFormatted = end.toLocaleDateString('en-US', { year: 'numeric', month: 'short' })
    
    return `${startFormatted} - ${endFormatted}`
  }

  // Generate secure state parameter
  private generateState(): string {
    return btoa(Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15))
  }

  // Clear stored token
  clearToken(): void {
    this.accessToken = null
    localStorage.removeItem('linkedin_access_token')
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return !!(this.accessToken || localStorage.getItem('linkedin_access_token'))
  }
}

export const linkedInApiService = new LinkedInApiService()
export type { LinkedInProfile }