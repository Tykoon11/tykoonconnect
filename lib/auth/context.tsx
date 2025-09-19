'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { User } from '@supabase/supabase-js'

type AuthContextType = {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  signOut: () => void
  demoSignIn: (userData: any) => void
  demoSignOut: () => void
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  isAuthenticated: false,
  signOut: () => {},
  demoSignIn: () => {},
  demoSignOut: () => {}
})

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    // Handle demo mode
    if (!supabase) {
      // Check localStorage for demo auth state
      const demoAuth = localStorage.getItem('demo_auth')
      if (demoAuth) {
        setUser(JSON.parse(demoAuth))
      }
      setIsLoading(false)
      return
    }

    // Real Supabase auth
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setUser(session?.user ?? null)
      setIsLoading(false)
    }

    getSession()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null)
      }
    )

    return () => subscription.unsubscribe()
  }, [supabase])

  const signOut = async () => {
    if (supabase) {
      await supabase.auth.signOut()
    }
    // Clear demo auth
    localStorage.removeItem('demo_auth')
    setUser(null)
  }

  const demoSignIn = (userData: any) => {
    const demoUser = {
      id: 'demo-user-' + Date.now(),
      email: userData.email || 'demo@example.com',
      user_metadata: {
        name: userData.name || 'Demo User',
        handle: userData.handle || 'demouser',
        role_client: userData.roleClient || true,
        role_freelancer: userData.roleFreelancer || false
      },
      created_at: new Date().toISOString()
    }
    
    localStorage.setItem('demo_auth', JSON.stringify(demoUser))
    setUser(demoUser as User)
  }

  const demoSignOut = () => {
    localStorage.removeItem('demo_auth')
    setUser(null)
  }

  const value = {
    user,
    isLoading,
    isAuthenticated: !!user,
    signOut,
    demoSignIn,
    demoSignOut
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}