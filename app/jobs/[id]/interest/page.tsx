'use client'

import { use, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Users, Heart, Clock, AlertCircle, CheckCircle } from 'lucide-react'
import Link from 'next/link'
import { notFound } from 'next/navigation'

// Demo job data
const demoJobs = {
  '1': {
    id: '1',
    title: 'E-commerce Website Development',
    positionsTotal: 2,
    positionsFilled: 0,
    client: {
      name: 'Alice Johnson',
      handle: 'alicej'
    }
  },
  '2': {
    id: '2', 
    title: 'Brand Identity Design Package',
    positionsTotal: 1,
    positionsFilled: 0,
    client: {
      name: 'Bob Wilson',
      handle: 'bobw'
    }
  },
  '3': {
    id: '3',
    title: 'Mobile App UI/UX Design',
    positionsTotal: 1,
    positionsFilled: 0,
    client: {
      name: 'Carol Davis',
      handle: 'carold'
    }
  }
}

// Mock user data
const mockUser = {
  dailyInterestsUsed: 3,
  dailyInterestsMax: 15,
  isPremium: false
}

export default function ShowInterestPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const job = demoJobs[resolvedParams.id as keyof typeof demoJobs]
  
  const [message, setMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  if (!job) {
    notFound()
  }

  const remainingInterests = mockUser.dailyInterestsMax - mockUser.dailyInterestsUsed
  const isAllPositionsFilled = (job.positionsFilled || 0) >= job.positionsTotal
  const canShowInterest = remainingInterests > 0 && !isAllPositionsFilled && !isSubmitted

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!canShowInterest) return

    setIsSubmitting(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    setIsSubmitted(true)
    setIsSubmitting(false)
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <Card className="text-center">
              <CardContent className="pt-12 pb-12">
                <div className="bg-green-100 text-green-600 p-4 rounded-full w-16 h-16 mx-auto mb-6 flex items-center justify-center">
                  <CheckCircle className="h-8 w-8" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Interest Sent Successfully!
                </h2>
                <p className="text-gray-600 mb-6">
                  Your interest has been sent to {job.client.name}. They can now contact you directly about this position.
                </p>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                  <p className="text-sm text-blue-800">
                    <strong>Daily Interests Remaining:</strong> {remainingInterests - 1} of {mockUser.dailyInterestsMax}
                    {!mockUser.isPremium && (
                      <span className="block mt-1">
                        Upgrade to Premium for {mockUser.dailyInterestsMax + 10} daily interests!
                      </span>
                    )}
                  </p>
                </div>
                <div className="space-y-3">
                  <Button asChild className="w-full">
                    <Link href={`/jobs/${job.id}`}>
                      Back to Job Details
                    </Link>
                  </Button>
                  <Button variant="outline" asChild className="w-full">
                    <Link href="/jobs">
                      Browse More Jobs
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Back Button */}
          <div className="mb-6">
            <Button variant="outline" asChild>
              <Link href={`/jobs/${job.id}`}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Job Details
              </Link>
            </Button>
          </div>

          {/* Main Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5 text-red-500" />
                Show Interest in Job
              </CardTitle>
              <CardDescription>
                Express your interest in "{job.title}" by {job.client.name}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Job Info */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <h3 className="font-semibold text-blue-900 mb-2">{job.title}</h3>
                <div className="flex items-center gap-4 text-sm text-blue-700">
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    {job.positionsFilled || 0}/{job.positionsTotal} positions filled
                  </div>
                  {job.positionsTotal > 1 && (
                    <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                      Multi-hire position
                    </Badge>
                  )}
                </div>
              </div>

              {/* Daily Limits Info */}
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">Daily Interest Limit</p>
                    <p className="text-sm text-gray-600">
                      {remainingInterests} of {mockUser.dailyInterestsMax} remaining today
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <Clock className="h-4 w-4" />
                      Resets at midnight
                    </div>
                    {!mockUser.isPremium && (
                      <Badge variant="outline" className="mt-1">
                        Free Plan
                      </Badge>
                    )}
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                    style={{ width: `${((mockUser.dailyInterestsMax - remainingInterests) / mockUser.dailyInterestsMax) * 100}%` }}
                  />
                </div>
              </div>

              {/* Warnings */}
              {isAllPositionsFilled && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-red-900">All Positions Filled</p>
                      <p className="text-sm text-red-700">
                        This job has already filled all available positions.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {remainingInterests === 0 && !isAllPositionsFilled && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-yellow-900">Daily Limit Reached</p>
                      <p className="text-sm text-yellow-700">
                        You've used all {mockUser.dailyInterestsMax} daily interests. 
                        {!mockUser.isPremium && ' Upgrade to Premium for 25 daily interests!'}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Interest Form */}
              {canShowInterest && (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="message">Personal Message (Optional)</Label>
                    <Textarea
                      id="message"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Write a brief message to the client about why you're interested in this job..."
                      rows={4}
                      className="mt-1"
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      {message.length}/500 characters
                    </p>
                  </div>

                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h4 className="font-medium text-green-900 mb-2">What happens next?</h4>
                    <ul className="text-sm text-green-800 space-y-1">
                      <li>• The client will see your interest and can message you directly</li>
                      <li>• You can message the client once you show interest</li>
                      <li>• No fees or connects required - completely free!</li>
                    </ul>
                  </div>

                  <div className="flex gap-4 pt-4">
                    <Button
                      type="submit"
                      className="flex-1"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                          Sending Interest...
                        </>
                      ) : (
                        <>
                          <Heart className="mr-2 h-4 w-4" />
                          Show Interest
                        </>
                      )}
                    </Button>
                    <Button type="button" variant="outline" asChild>
                      <Link href={`/jobs/${job.id}`}>
                        Cancel
                      </Link>
                    </Button>
                  </div>
                </form>
              )}

              {!canShowInterest && (
                <div className="pt-4">
                  <Button asChild variant="outline" className="w-full">
                    <Link href={`/jobs/${job.id}`}>
                      Back to Job Details
                    </Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Info Card */}
          <Card className="mt-6">
            <CardContent className="pt-6">
              <h3 className="font-medium mb-2">About Interest System</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• <strong>Daily Limits:</strong> Free users get {mockUser.dailyInterestsMax} interests per day</li>
                <li>• <strong>Direct Messaging:</strong> Show interest to unlock messaging with clients</li>
                <li>• <strong>No Fees:</strong> Showing interest is completely free</li>
                <li>• <strong>Quality Control:</strong> Limits prevent spam and ensure quality interactions</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}