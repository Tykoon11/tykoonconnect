'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/lib/auth/context'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Users, Mail, Github, Linkedin } from 'lucide-react'

export default function SignUpPage() {
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    handle: '',
    roleClient: true,
    roleFreelancer: false,
  })
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('')
  const { demoSignIn } = useAuth()
  const router = useRouter()
  const supabase = createClient()

  const handleChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage('')

    if (!formData.roleClient && !formData.roleFreelancer) {
      setMessage('Please select at least one role')
      setIsLoading(false)
      return
    }

    // Demo mode handling
    if (!supabase) {
      demoSignIn(formData)
      setMessage('Demo mode: Account created successfully! Redirecting to dashboard...')
      setTimeout(() => {
        router.push('/dashboard')
      }, 1500)
      setIsLoading(false)
      return
    }

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email: formData.email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback?signup=true`,
          data: {
            name: formData.name,
            handle: formData.handle,
            role_client: formData.roleClient,
            role_freelancer: formData.roleFreelancer,
          }
        },
      })

      if (error) {
        setMessage(error.message)
      } else {
        setMessage('Check your email for a magic link to complete signup!')
      }
    } catch (error) {
      setMessage('An unexpected error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  const handleOAuthSignUp = async (provider: 'google' | 'github' | 'linkedin_oidc') => {
    setIsLoading(true)
    setMessage('')

    // Demo mode handling
    if (!supabase) {
      demoSignIn({ 
        email: `demo@${provider}.com`, 
        name: `Demo User (${provider})`,
        handle: `demo_${provider}_user`,
        roleClient: formData.roleClient,
        roleFreelancer: formData.roleFreelancer
      })
      setMessage(`Demo mode: ${provider.charAt(0).toUpperCase() + provider.slice(1)} signup successful! Redirecting...`)
      setTimeout(() => {
        router.push('/dashboard')
      }, 1500)
      setIsLoading(false)
      return
    }

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback?signup=true`,
          queryParams: {
            role_client: formData.roleClient.toString(),
            role_freelancer: formData.roleFreelancer.toString(),
          }
        }
      })

      if (error) {
        setMessage(error.message)
      }
    } catch (error) {
      setMessage('An unexpected error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 p-4">
      <Card className="w-full max-w-md bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="bg-blue-600 text-white p-2 rounded-lg">
              <Users className="h-6 w-6" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-slate-100">tykoonConnect</h1>
          </div>
          <CardTitle className="text-gray-900 dark:text-slate-100">Join tykoonConnect</CardTitle>
          <CardDescription className="text-gray-600 dark:text-slate-400">
            Create your free account and start connecting
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignUp} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-gray-700 dark:text-slate-300">Full Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="John Doe"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="handle" className="text-gray-700 dark:text-slate-300">Handle</Label>
              <Input
                id="handle"
                type="text"
                placeholder="johndoe"
                value={formData.handle}
                onChange={(e) => handleChange('handle', e.target.value.toLowerCase())}
                required
                pattern="[a-z0-9_-]+"
                title="Only lowercase letters, numbers, hyphens, and underscores"
              />
              <p className="text-xs text-gray-500 dark:text-slate-400">Your unique username (lowercase only)</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-700 dark:text-slate-300">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                required
              />
            </div>

            <div className="space-y-3">
              <Label className="text-gray-700 dark:text-slate-300">I want to:</Label>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="client"
                  checked={formData.roleClient}
                  onCheckedChange={(checked) => handleChange('roleClient', !!checked)}
                />
                <Label htmlFor="client" className="text-sm text-gray-700 dark:text-slate-300">
                  Hire freelancers (Client)
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="freelancer"
                  checked={formData.roleFreelancer}
                  onCheckedChange={(checked) => handleChange('roleFreelancer', !!checked)}
                />
                <Label htmlFor="freelancer" className="text-sm text-gray-700 dark:text-slate-300">
                  Offer services (Freelancer)
                </Label>
              </div>
            </div>
            
            <Button type="submit" className="w-full" disabled={isLoading}>
              <Mail className="mr-2 h-4 w-4" />
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </Button>

            {message && (
              <div className={`text-sm p-3 rounded ${
                message.includes('Check your email') || message.includes('Demo mode') 
                  ? 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-700' 
                  : 'bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-700'
              }`}>
                {message}
              </div>
            )}
          </form>

          {/* OAuth Divider */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white dark:bg-slate-800 px-2 text-gray-500 dark:text-slate-400">Or continue with</span>
              </div>
            </div>
          </div>

          {/* OAuth Buttons */}
          <div className="mt-6 grid grid-cols-1 gap-3">
            <Button 
              variant="outline" 
              onClick={() => handleOAuthSignUp('google')}
              disabled={isLoading}
              className="w-full"
            >
              <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </Button>

            <Button 
              variant="outline" 
              onClick={() => handleOAuthSignUp('linkedin_oidc')}
              disabled={isLoading}
              className="w-full bg-[#0077B5] hover:bg-[#005582] text-white border-[#0077B5]"
            >
              <Linkedin className="mr-2 h-4 w-4" />
              Continue with LinkedIn
            </Button>
            
            <Button 
              variant="outline" 
              onClick={() => handleOAuthSignUp('github')}
              disabled={isLoading}
              className="w-full"
            >
              <Github className="mr-2 h-4 w-4" />
              Continue with GitHub
            </Button>
          </div>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 dark:text-slate-400">
              Already have an account?{' '}
              <Link href="/auth/signin" className="text-blue-600 dark:text-blue-400 hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}