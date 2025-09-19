'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { CheckCircle, Heart, Users, Share2, Download, Home } from 'lucide-react'
import Link from 'next/link'
import { useToast } from '@/components/ui/toast'
import { DEMO_MODE } from '@/lib/prisma'

interface DonationDetails {
  sessionId: string
  amount: number
  currency: string
  donorName?: string
  message?: string
  isRecurring: boolean
  showOnWall: boolean
  status: 'processing' | 'completed' | 'failed'
}

export default function DonationSuccessPage() {
  const searchParams = useSearchParams()
  const { addToast } = useToast()
  const [donation, setDonation] = useState<DonationDetails | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showShareOptions, setShowShareOptions] = useState(false)

  useEffect(() => {
    const sessionId = searchParams.get('session_id')
    const isDemoMode = searchParams.get('demo') === 'true'
    
    const fetchDonationDetails = async () => {
      try {
        if (isDemoMode || DEMO_MODE) {
          // Demo mode - simulate donation details
          setDonation({
            sessionId: sessionId || 'demo_session_123',
            amount: 2500, // $25.00
            currency: 'USD',
            donorName: 'Demo Supporter',
            message: 'Keep up the great work! Love this platform.',
            isRecurring: false,
            showOnWall: true,
            status: 'completed'
          })
        } else if (sessionId) {
          // Real mode - fetch from API
          const response = await fetch(`/api/donations/verify?session_id=${sessionId}`)
          if (!response.ok) throw new Error('Failed to verify donation')
          
          const data = await response.json()
          setDonation(data)
        } else {
          throw new Error('No session ID provided')
        }
      } catch (error) {
        console.error('Error fetching donation details:', error)
        addToast({
          type: 'error',
          title: 'Error',
          description: 'Unable to verify donation. Please contact support.',
          duration: 5000
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchDonationDetails()
  }, [searchParams, addToast])

  const formatAmount = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(amount / 100)
  }

  const handleShare = () => {
    setShowShareOptions(!showShareOptions)
  }

  const shareOnTwitter = () => {
    const text = `I just supported @tykoonConnect - the world's first 100% free marketplace for freelancers! 🎉 #FreelanceLife #NoFees`
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(window.location.origin)}`
    window.open(url, '_blank')
  }

  const shareOnLinkedIn = () => {
    const text = 'I just supported tykoonConnect - the world\'s first 100% free marketplace for freelancers!'
    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.origin)}&summary=${encodeURIComponent(text)}`
    window.open(url, '_blank')
  }

  const downloadReceipt = () => {
    if (DEMO_MODE) {
      addToast({
        type: 'info',
        title: 'Demo Mode',
        description: 'Receipt download is not available in demo mode.',
        duration: 3000
      })
    } else {
      // Real receipt download logic
      window.open(`/api/donations/${donation?.sessionId}/receipt`, '_blank')
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-slate-400">Verifying your donation...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!donation) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle className="text-center text-red-600">Donation Not Found</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-gray-600 dark:text-slate-400 mb-4">
              We couldn't find details for this donation. Please contact support if you believe this is an error.
            </p>
            <Button asChild>
              <Link href="/donations">Return to Donations</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Success Background */}
      <div className="absolute inset-0 bg-grid-gray-900/[0.04] dark:bg-grid-slate-100/[0.02]" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-green-400/20 to-blue-600/20 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-blue-400/20 to-purple-500/20 rounded-full blur-3xl" />
      
      <div className="relative py-16 px-4">
        <div className="container mx-auto max-w-2xl">
          {/* Success Header */}
          <div className="text-center mb-8">
            <div className="relative inline-block">
              <div className="absolute -inset-2 bg-gradient-to-r from-green-600 to-blue-600 rounded-full blur-lg opacity-75 animate-pulse"></div>
              <div className="relative bg-gradient-to-r from-green-500 to-blue-500 text-white p-6 rounded-full">
                <CheckCircle className="h-16 w-16" />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-slate-100 mt-6 mb-4">
              Thank You! 🎉
            </h1>
            <p className="text-xl text-gray-600 dark:text-slate-300">
              Your donation has been processed successfully.
            </p>
          </div>

          {/* Donation Details Card */}
          <Card className="mb-8 border-0 shadow-2xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl text-green-600 dark:text-green-400 flex items-center justify-center gap-2">
                <Heart className="h-6 w-6" />
                Donation Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-900 dark:text-slate-100 mb-2">
                    {formatAmount(donation.amount, donation.currency)}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-slate-400">
                    {donation.isRecurring ? 'Monthly Donation' : 'One-time Donation'}
                  </div>
                  {donation.isRecurring && (
                    <Badge className="mt-2 bg-gradient-to-r from-purple-500 to-blue-500">
                      Recurring
                    </Badge>
                  )}
                </div>
                
                <div className="text-center">
                  <div className="text-lg font-semibold text-gray-900 dark:text-slate-100 mb-2">
                    Status
                  </div>
                  <Badge 
                    className={`
                      ${donation.status === 'completed' 
                        ? 'bg-gradient-to-r from-green-500 to-emerald-500' 
                        : 'bg-gradient-to-r from-yellow-500 to-orange-500'
                      } text-white
                    `}
                  >
                    {donation.status.charAt(0).toUpperCase() + donation.status.slice(1)}
                  </Badge>
                </div>
              </div>

              {donation.donorName && (
                <div className="text-center">
                  <div className="text-sm text-gray-500 dark:text-slate-400 mb-1">From</div>
                  <div className="font-semibold text-gray-900 dark:text-slate-100">
                    {donation.donorName}
                  </div>
                </div>
              )}

              {donation.message && (
                <div className="bg-gray-50 dark:bg-slate-700 rounded-lg p-4">
                  <div className="text-sm text-gray-500 dark:text-slate-400 mb-2">Message</div>
                  <div className="italic text-gray-700 dark:text-slate-300">
                    "{donation.message}"
                  </div>
                </div>
              )}

              <div className="text-center text-sm text-gray-500 dark:text-slate-400">
                Transaction ID: {donation.sessionId}
              </div>
            </CardContent>
          </Card>

          {/* Impact Message */}
          <Card className="mb-8 border-0 bg-gradient-to-r from-blue-500 to-purple-600 text-white">
            <CardContent className="p-8 text-center">
              <Users className="h-12 w-12 mx-auto mb-4 opacity-90" />
              <h3 className="text-2xl font-bold mb-4">Making an Impact</h3>
              <p className="text-lg opacity-90 leading-relaxed">
                Your support helps keep tykoonConnect completely free for all freelancers and clients. 
                Thanks to supporters like you, we can maintain a platform with zero fees, 
                helping creative professionals keep 100% of their earnings.
              </p>
              {donation.showOnWall && (
                <div className="mt-6 bg-white/20 backdrop-blur-sm rounded-lg p-4">
                  <p className="text-sm">
                    🌟 Your support will be featured on our Wall of Support (unless you opted out)
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="grid md:grid-cols-2 gap-4 mb-8">
            <Button 
              onClick={downloadReceipt}
              variant="outline" 
              className="h-auto p-4 border-2 hover:bg-blue-50 dark:hover:bg-slate-800"
            >
              <div className="flex flex-col items-center">
                <Download className="h-8 w-8 mb-2 text-blue-600" />
                <div className="font-semibold">Download Receipt</div>
                <div className="text-sm text-gray-500">For your records</div>
              </div>
            </Button>
            
            <Button 
              onClick={handleShare}
              variant="outline" 
              className="h-auto p-4 border-2 hover:bg-green-50 dark:hover:bg-slate-800"
            >
              <div className="flex flex-col items-center">
                <Share2 className="h-8 w-8 mb-2 text-green-600" />
                <div className="font-semibold">Share Your Support</div>
                <div className="text-sm text-gray-500">Spread the word</div>
              </div>
            </Button>
          </div>

          {/* Share Options */}
          {showShareOptions && (
            <Card className="mb-8 border-blue-200 bg-blue-50 dark:bg-blue-900/10">
              <CardContent className="p-4">
                <div className="text-center mb-4">
                  <h4 className="font-semibold text-blue-800 dark:text-blue-200">
                    Share on Social Media
                  </h4>
                </div>
                <div className="flex justify-center gap-4">
                  <Button 
                    onClick={shareOnTwitter}
                    className="bg-blue-500 hover:bg-blue-600 text-white"
                  >
                    Share on Twitter
                  </Button>
                  <Button 
                    onClick={shareOnLinkedIn}
                    className="bg-blue-700 hover:bg-blue-800 text-white"
                  >
                    Share on LinkedIn
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Navigation */}
          <div className="flex justify-center gap-4">
            <Button asChild variant="outline" className="px-8">
              <Link href="/donations">
                <Heart className="h-4 w-4 mr-2" />
                Donate Again
              </Link>
            </Button>
            <Button asChild className="px-8 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
              <Link href="/">
                <Home className="h-4 w-4 mr-2" />
                Back to Home
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}