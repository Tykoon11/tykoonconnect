'use client'

import { useEffect } from 'react'
import { Navigation } from '@/components/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuth } from '@/lib/auth/context'
import { Settings, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function AdminFeatureFlagsPage() {
  const { isAuthenticated, user } = useAuth()

  useEffect(() => {
    if (!isAuthenticated) {
      window.location.href = '/auth/signin'
      return
    }
    
    const isAdmin = user?.email === 'admin@tykoonconnect.com' || user?.user_metadata?.role === 'admin'
    if (!isAdmin) {
      alert('Access denied. Admin privileges required.')
      window.location.href = '/dashboard'
    }
  }, [isAuthenticated, user])

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <Button variant="outline" className="mb-6" asChild>
            <Link href="/admin">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Admin
            </Link>
          </Button>
          
          <div className="flex items-center space-x-3 mb-8">
            <div className="bg-gradient-to-br from-purple-600 to-indigo-600 text-white p-3 rounded-xl shadow-lg">
              <Settings className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-slate-100">Feature Flags</h1>
              <p className="text-gray-600 dark:text-slate-300">
                Control platform features and experimental functionality
              </p>
            </div>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Admin Feature - Feature Flag Management</CardTitle>
              <CardDescription>This page would contain feature flag controls</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-6 text-center">
                <Settings className="h-12 w-12 text-yellow-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-yellow-800 dark:text-yellow-200 mb-2">
                  Feature Flag Control System
                </h3>
                <p className="text-yellow-700 dark:text-yellow-300 mb-4">
                  This admin panel would include feature toggle controls, A/B test management, rollout configuration, and feature usage analytics.
                </p>
                <p className="text-sm text-yellow-600 dark:text-yellow-400">
                  Demo: This is a placeholder page showing the admin interface structure.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}