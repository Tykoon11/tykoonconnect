import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const isSignup = requestUrl.searchParams.get('signup') === 'true'

  if (code) {
    const supabase = createClient()
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error && data.user) {
      // Check if user already exists in our database
      const existingUser = await prisma.user.findUnique({
        where: { email: data.user.email! }
      })

      if (!existingUser && isSignup) {
        // Create new user profile from signup metadata
        const metadata = data.user.user_metadata
        const handle = metadata.handle || data.user.email!.split('@')[0]
        
        try {
          await prisma.user.create({
            data: {
              id: data.user.id,
              email: data.user.email!,
              name: metadata.name || '',
              handle: handle,
              roleClient: metadata.role_client || true,
              roleFreelancer: metadata.role_freelancer || false,
            }
          })
        } catch (error) {
          console.error('Error creating user:', error)
          // If handle is taken, generate a unique one
          const uniqueHandle = `${handle}_${Date.now().toString().slice(-4)}`
          await prisma.user.create({
            data: {
              id: data.user.id,
              email: data.user.email!,
              name: metadata.name || '',
              handle: uniqueHandle,
              roleClient: metadata.role_client || true,
              roleFreelancer: metadata.role_freelancer || false,
            }
          })
        }
      }

      // Redirect to dashboard or profile setup
      return NextResponse.redirect(new URL(existingUser ? '/dashboard' : '/profile/setup', requestUrl.origin))
    }
  }

  // Return to sign in page if something went wrong
  return NextResponse.redirect(new URL('/auth/signin', requestUrl.origin))
}