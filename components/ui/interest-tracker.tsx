'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Heart, Clock, Users, TrendingUp, Crown } from 'lucide-react'

export interface InterestStats {
  remaining: number
  used: number
  maxAllowed: number
  resetsAt: Date
  isPremium: boolean
}

export interface InterestActivity {
  id: string
  jobId: string
  jobTitle: string
  clientName: string
  createdAt: Date
  status: 'pending' | 'contacted' | 'hired'
}

interface InterestTrackerProps {
  stats: InterestStats
  recentActivity?: InterestActivity[]
  showUpgrade?: boolean
  className?: string
}

export function InterestTracker({ stats, recentActivity = [], showUpgrade = true, className }: InterestTrackerProps) {
  const usagePercentage = (stats.used / stats.maxAllowed) * 100
  const timeUntilReset = Math.ceil((stats.resetsAt.getTime() - Date.now()) / (1000 * 60 * 60))

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-red-500" />
            <CardTitle>Daily Interests</CardTitle>
            {stats.isPremium && (
              <Crown className="h-4 w-4 text-yellow-500" />
            )}
          </div>
          <Badge variant={stats.remaining > 0 ? "default" : "secondary"}>
            {stats.remaining} left
          </Badge>
        </div>
        <CardDescription>
          Track your daily interest usage and activity
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Usage Overview */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Daily Usage</span>
            <span className="font-medium">{stats.used} / {stats.maxAllowed}</span>
          </div>
          <Progress value={usagePercentage} className="h-2" />
          <div className="flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              Resets in {timeUntilReset}h
            </div>
            <span>{stats.maxAllowed - stats.used} remaining</span>
          </div>
        </div>

        {/* Plan Status */}
        <div className={`rounded-lg p-3 ${stats.isPremium ? 'bg-yellow-50 border border-yellow-200' : 'bg-gray-50 border border-gray-200'}`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`font-medium ${stats.isPremium ? 'text-yellow-900' : 'text-gray-900'}`}>
                {stats.isPremium ? 'Premium Plan' : 'Free Plan'}
              </p>
              <p className={`text-sm ${stats.isPremium ? 'text-yellow-700' : 'text-gray-600'}`}>
                {stats.maxAllowed} interests per day
              </p>
            </div>
            {stats.isPremium ? (
              <Crown className="h-5 w-5 text-yellow-500" />
            ) : (
              showUpgrade && (
                <Button size="sm" variant="outline">
                  Upgrade
                </Button>
              )
            )}
          </div>
        </div>

        {/* Recent Activity */}
        {recentActivity.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-medium text-sm flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Recent Activity
            </h4>
            <div className="space-y-2">
              {recentActivity.slice(0, 3).map((activity) => (
                <div key={activity.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{activity.jobTitle}</p>
                    <p className="text-xs text-gray-600">by {activity.clientName}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge 
                      variant={
                        activity.status === 'hired' ? 'default' :
                        activity.status === 'contacted' ? 'secondary' : 
                        'outline'
                      }
                      className="text-xs"
                    >
                      {activity.status === 'hired' ? 'Hired' :
                       activity.status === 'contacted' ? 'Contacted' :
                       'Pending'}
                    </Badge>
                    <span className="text-xs text-gray-500">
                      {Math.floor((Date.now() - activity.createdAt.getTime()) / (1000 * 60 * 60))}h
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-4 pt-3 border-t">
          <div className="text-center">
            <div className="font-semibold text-lg">{stats.used}</div>
            <div className="text-xs text-gray-600">Used Today</div>
          </div>
          <div className="text-center">
            <div className="font-semibold text-lg">{recentActivity.filter(a => a.status === 'contacted').length}</div>
            <div className="text-xs text-gray-600">Contacted</div>
          </div>
          <div className="text-center">
            <div className="font-semibold text-lg">{recentActivity.filter(a => a.status === 'hired').length}</div>
            <div className="text-xs text-gray-600">Hired</div>
          </div>
        </div>

        {/* Low Usage Warning */}
        {stats.remaining <= 2 && stats.remaining > 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <p className="text-sm text-yellow-800">
              <strong>Running low!</strong> You have {stats.remaining} interest{stats.remaining === 1 ? '' : 's'} left today.
              {!stats.isPremium && ' Consider upgrading to Premium for more daily interests.'}
            </p>
          </div>
        )}

        {/* No Interests Left */}
        {stats.remaining === 0 && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <p className="text-sm text-red-800">
              <strong>Daily limit reached!</strong> Your interests will reset in {timeUntilReset} hours.
              {!stats.isPremium && ' Upgrade to Premium for 25 daily interests!'}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// Usage example component
export function InterestTrackerDemo() {
  const demoStats: InterestStats = {
    remaining: 12,
    used: 3,
    maxAllowed: 15,
    resetsAt: new Date(Date.now() + 18 * 60 * 60 * 1000), // 18 hours from now
    isPremium: false
  }

  const demoActivity: InterestActivity[] = [
    {
      id: '1',
      jobId: '1',
      jobTitle: 'E-commerce Website Development',
      clientName: 'Alice Johnson',
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      status: 'contacted'
    },
    {
      id: '2', 
      jobId: '2',
      jobTitle: 'Mobile App Design',
      clientName: 'Bob Wilson',
      createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
      status: 'pending'
    },
    {
      id: '3',
      jobId: '3', 
      jobTitle: 'Logo Design Project',
      clientName: 'Carol Davis',
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
      status: 'hired'
    }
  ]

  return (
    <InterestTracker 
      stats={demoStats} 
      recentActivity={demoActivity} 
      className="max-w-md"
    />
  )
}