import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const authorization = request.headers.get('authorization')
    
    if (!authorization) {
      return NextResponse.json(
        { error: 'Authorization header required' },
        { status: 401 }
      )
    }

    const accessToken = authorization.replace('Bearer ', '')

    // Fetch LinkedIn profile data
    const [profileResponse, positionsResponse, skillsResponse] = await Promise.allSettled([
      fetch('https://api.linkedin.com/v2/people/~?projection=(id,firstName,lastName,headline,summary,location)', {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Accept': 'application/json',
        },
      }),
      fetch('https://api.linkedin.com/v2/people/~/positions?projection=(elements*(id,title,summary,startDate,endDate,company~(name)))', {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Accept': 'application/json',
        },
      }),
      fetch('https://api.linkedin.com/v2/people/~/skills?projection=(elements*(id,name,endorsementCount))', {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Accept': 'application/json',
        },
      })
    ])

    // Check if profile request was successful
    if (profileResponse.status === 'rejected' || !profileResponse.value.ok) {
      if (profileResponse.value?.status === 401) {
        return NextResponse.json(
          { error: 'Invalid or expired LinkedIn access token' },
          { status: 401 }
        )
      }
      return NextResponse.json(
        { error: 'Failed to fetch LinkedIn profile' },
        { status: 400 }
      )
    }

    const profileData = await profileResponse.value.json()
    
    // Process positions data
    let positions = []
    if (positionsResponse.status === 'fulfilled' && positionsResponse.value.ok) {
      const positionsData = await positionsResponse.value.json()
      positions = positionsData.elements || []
    }

    // Process skills data
    let skills = []
    if (skillsResponse.status === 'fulfilled' && skillsResponse.value.ok) {
      const skillsData = await skillsResponse.value.json()
      skills = skillsData.elements || []
    }

    // Transform LinkedIn data to our profile format
    const transformedData = {
      name: `${profileData.firstName?.localized?.en_US || profileData.localizedFirstName || ''} ${profileData.lastName?.localized?.en_US || profileData.localizedLastName || ''}`.trim(),
      title: profileData.headline?.localized?.en_US || profileData.localizedHeadline || '',
      bio: profileData.summary?.localized?.en_US || profileData.localizedSummary || profileData.headline?.localized?.en_US || '',
      location: profileData.location?.name || '',
      skills: skills.slice(0, 10).map((skill: any) => ({
        name: skill.name?.localized?.en_US || skill.name || '',
        level: determineSkillLevel(skill.endorsementCount || 0)
      })),
      experience: positions.slice(0, 5).map((pos: any, index: number) => ({
        id: `linkedin-${index}`,
        title: pos.title?.localized?.en_US || pos.title || '',
        company: pos.company?.name || pos.companyName?.localized?.en_US || '',
        duration: formatDateRange(pos.startDate, pos.endDate),
        description: pos.summary?.localized?.en_US || pos.description || `${pos.title?.localized?.en_US || pos.title} at ${pos.company?.name || ''}`
      }))
    }

    return NextResponse.json(transformedData)

  } catch (error) {
    console.error('LinkedIn import error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

function determineSkillLevel(endorsements: number): 'beginner' | 'intermediate' | 'expert' {
  if (endorsements >= 20) return 'expert'
  if (endorsements >= 5) return 'intermediate'
  return 'beginner'
}

function formatDateRange(startDate: any, endDate?: any): string {
  if (!startDate) return 'Unknown'
  
  const start = new Date(startDate.year || 2020, (startDate.month || 1) - 1)
  const startFormatted = start.toLocaleDateString('en-US', { year: 'numeric', month: 'short' })
  
  if (!endDate) {
    return `${startFormatted} - Present`
  }
  
  const end = new Date(endDate.year, (endDate.month || 12) - 1)
  const endFormatted = end.toLocaleDateString('en-US', { year: 'numeric', month: 'short' })
  
  return `${startFormatted} - ${endFormatted}`
}