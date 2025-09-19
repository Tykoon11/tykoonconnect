'use client'

import { Alert, AlertDescription } from '@/components/ui/alert'
import { Info, Settings } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useState, useEffect } from 'react'

export function DemoBanner() {
  const [isDemoMode, setIsDemoMode] = useState(false)
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    // Check if we're likely in demo mode by checking for placeholder values
    const checkDemoMode = () => {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
      const stripeKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
      
      return !supabaseUrl || 
        supabaseUrl.includes('placeholder') ||
        !stripeKey ||
        stripeKey.includes('placeholder')
    }
    
    setIsDemoMode(checkDemoMode())
  }, [])

  if (!isDemoMode || !isVisible) {
    return null
  }

  return (
    <Alert className="border-amber-200 bg-amber-50 dark:bg-amber-950/20 dark:border-amber-800 rounded-none border-x-0 border-t-0">
      <Info className="h-4 w-4 text-amber-600 dark:text-amber-400" />
      <AlertDescription className="flex items-center justify-between w-full">
        <div className="flex items-center gap-2 text-amber-800 dark:text-amber-200">
          <span className="font-medium">Demo Mode:</span>
          <span className="text-sm">
            Using placeholder data. Configure environment variables for full functionality.
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="text-amber-700 border-amber-300 hover:bg-amber-100 dark:text-amber-300 dark:border-amber-700 dark:hover:bg-amber-900/20"
            onClick={() => window.open('/help#setup', '_blank')}
          >
            <Settings className="h-3 w-3 mr-1" />
            Setup Guide
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-amber-600 hover:bg-amber-100 dark:text-amber-400 dark:hover:bg-amber-900/20"
            onClick={() => setIsVisible(false)}
          >
            ×
          </Button>
        </div>
      </AlertDescription>
    </Alert>
  )
}