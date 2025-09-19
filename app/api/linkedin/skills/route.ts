import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const authorization = request.headers.get('authorization')
    
    if (!authorization) {
      return NextResponse.json(
        { error: 'Authorization header required' },
        { status: 401 }
      )
    }

    const accessToken = authorization.replace('Bearer ', '')

    // Fetch LinkedIn skills data
    const skillsResponse = await fetch('https://api.linkedin.com/v2/people/~/skills?projection=(elements*(id,name,endorsementCount))', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Accept': 'application/json',
      },
    })

    if (!skillsResponse.ok) {
      const error = await skillsResponse.text()
      console.error('LinkedIn skills error:', error)
      
      if (skillsResponse.status === 401) {
        return NextResponse.json(
          { error: 'Invalid or expired access token' },
          { status: 401 }
        )
      }
      
      return NextResponse.json(
        { error: 'Failed to fetch LinkedIn skills' },
        { status: 400 }
      )
    }

    const skillsData = await skillsResponse.json()
    
    return NextResponse.json(skillsData)

  } catch (error) {
    console.error('Skills fetch error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}