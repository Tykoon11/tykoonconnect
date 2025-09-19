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

    // Fetch LinkedIn profile data
    const profileResponse = await fetch('https://api.linkedin.com/v2/people/~?projection=(id,firstName,lastName,headline,summary,location,emailAddress,profilePicture(displayImage~:playableStreams))', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Accept': 'application/json',
      },
    })

    if (!profileResponse.ok) {
      const error = await profileResponse.text()
      console.error('LinkedIn profile error:', error)
      
      if (profileResponse.status === 401) {
        return NextResponse.json(
          { error: 'Invalid or expired access token' },
          { status: 401 }
        )
      }
      
      return NextResponse.json(
        { error: 'Failed to fetch LinkedIn profile' },
        { status: 400 }
      )
    }

    const profileData = await profileResponse.json()
    
    return NextResponse.json(profileData)

  } catch (error) {
    console.error('Profile fetch error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}