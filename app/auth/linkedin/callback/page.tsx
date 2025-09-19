'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CheckCircle, XCircle, Linkedin } from 'lucide-react'
import Link from 'next/link'

export default function LinkedInCallbackPage() {
  const searchParams = useSearchParams()
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('')

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const code = searchParams.get('code')
        const error = searchParams.get('error')
        const state = searchParams.get('state')

        if (error) {
          throw new Error(`LinkedIn authorization failed: ${error}`)
        }

        if (!code) {
          throw new Error('No authorization code received from LinkedIn')
        }

        // Exchange authorization code for access token
        const tokenResponse = await fetch('/api/linkedin/token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            code,
            redirect_uri: `${window.location.origin}/auth/linkedin/callback`,
            client_id: process.env.NEXT_PUBLIC_LINKEDIN_CLIENT_ID,
            client_secret: process.env.LINKEDIN_CLIENT_SECRET,
          }),
        })

        if (!tokenResponse.ok) {
          const errorData = await tokenResponse.json()
          throw new Error(errorData.error || 'Failed to exchange authorization code')
        }

        const tokenData = await tokenResponse.json()
        
        // Store access token securely
        localStorage.setItem('linkedin_access_token', tokenData.access_token)
        localStorage.setItem('linkedin_token_expires', (Date.now() + (tokenData.expires_in * 1000)).toString())

        setStatus('success')
        setMessage('Successfully connected to LinkedIn! You can now import your profile data.')

        // Redirect back to profile page after 2 seconds
        const redirectUrl = sessionStorage.getItem('linkedin_redirect_url') || '/profile'
        sessionStorage.removeItem('linkedin_redirect_url')
        
        setTimeout(() => {
          window.location.href = redirectUrl
        }, 2000)

      } catch (error) {
        console.error('LinkedIn callback error:', error)
        setStatus('error')
        setMessage(error.message || 'An unexpected error occurred')
      }
    }

    handleCallback()
  }, [searchParams])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="bg-[#0077B5] text-white p-2 rounded-lg">
              <Linkedin className="h-6 w-6" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-slate-100">LinkedIn Integration</h1>
          </div>
          <CardTitle className="text-gray-900 dark:text-slate-100">
            {status === 'loading' && 'Connecting to LinkedIn...'}
            {status === 'success' && 'Connection Successful!'}
            {status === 'error' && 'Connection Failed'}
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          {status === 'loading' && (
            <div className="flex flex-col items-center space-y-4">
              <LoadingSpinner size="lg" />
              <p className="text-gray-600 dark:text-slate-400">
                Processing your LinkedIn authorization...
              </p>
            </div>
          )}

          {status === 'success' && (
            <div className="flex flex-col items-center space-y-4">
              <CheckCircle className="h-16 w-16 text-green-500" />
              <p className="text-gray-600 dark:text-slate-400">
                {message}
              </p>
              <p className="text-sm text-gray-500 dark:text-slate-500">
                Redirecting you back to your profile...
              </p>
            </div>
          )}

          {status === 'error' && (
            <div className="flex flex-col items-center space-y-4">
              <XCircle className="h-16 w-16 text-red-500" />
              <p className="text-red-600 dark:text-red-400">
                {message}
              </p>
              <div className="flex space-x-3">
                <Button variant="outline" asChild>
                  <Link href="/profile">
                    Back to Profile
                  </Link>
                </Button>
                <Button asChild>
                  <Link href="/profile">
                    Try Again
                  </Link>
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}