import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'

// Check if we're in demo mode
const isDemoMode = !process.env.SUPABASE_URL || 
  !process.env.SUPABASE_ANON_KEY ||
  process.env.SUPABASE_URL.includes('placeholder') ||
  process.env.SUPABASE_ANON_KEY.includes('placeholder')

export function createClient() {
  // Return null in demo mode to trigger fallback behavior
  if (isDemoMode) {
    return null
  }

  const cookieStore = cookies()

  try {
    return createServerClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value
          },
          set(name: string, value: string, options: CookieOptions) {
            try {
              cookieStore.set({ name, value, ...options })
            } catch (error) {
              // The `set` method was called from a Server Component.
              // This can be ignored if you have middleware refreshing
              // user sessions.
            }
          },
          remove(name: string, options: CookieOptions) {
            try {
              cookieStore.set({ name, value: '', ...options })
            } catch (error) {
              // The `delete` method was called from a Server Component.
              // This can be ignored if you have middleware refreshing
              // user sessions.
            }
          },
        },
      }
    )
  } catch (error) {
    console.error('Failed to create Supabase client:', error)
    return null
  }
}

export async function getUser() {
  if (isDemoMode) {
    // Check for demo auth in session/cookies
    return null
  }

  const supabase = createClient()
  if (!supabase) {
    return null
  }

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    return user
  } catch (error) {
    console.error('Error getting user:', error)
    return null
  }
}