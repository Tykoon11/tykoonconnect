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

    // Fetch LinkedIn positions data
    const positionsResponse = await fetch('https://api.linkedin.com/v2/people/~/positions?projection=(elements*(id,title,summary,startDate,endDate,company~(name,logo)))', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Accept': 'application/json',
      },
    })

    if (!positionsResponse.ok) {
      const error = await positionsResponse.text()
      console.error('LinkedIn positions error:', error)
      
      if (positionsResponse.status === 401) {
        return NextResponse.json(
          { error: 'Invalid or expired access token' },
          { status: 401 }
        )
      }
      
      return NextResponse.json(
        { error: 'Failed to fetch LinkedIn positions' },
        { status: 400 }
      )
    }

    const positionsData = await positionsResponse.json()
    
    return NextResponse.json(positionsData)

  } catch (error) {
    console.error('Positions fetch error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}