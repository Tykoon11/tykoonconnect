'use client'

import { useState, useEffect } from 'react'
import { Navigation } from '@/components/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useAuth } from '@/lib/auth/context'
import { 
  BarChart3, 
  Users, 
  DollarSign, 
  TrendingUp,
  Download,
  Calendar,
  Filter,
  RefreshCw,
  ArrowLeft,
  Eye,
  AlertTriangle,
  CheckCircle,
  Clock
} from 'lucide-react'
import Link from 'next/link'

interface ReportData {
  totalUsers: number
  activeUsers: number
  newSignups: number
  totalJobs: number
  completedJobs: number
  activeJobs: number
  totalRevenue: number
  platformFees: number
  averageJobValue: number
  userGrowth: number
  jobGrowth: number
  revenueGrowth: number
}

interface ActivityItem {
  id: string
  type: 'user' | 'job' | 'payment' | 'issue'
  title: string
  description: string
  timestamp: string
  status: 'success' | 'warning' | 'error'
}

export default function AdminReportsPage() {
  const { isAuthenticated, user } = useAuth()
  const [reportData, setReportData] = useState<ReportData>({
    totalUsers: 12847,
    activeUsers: 8432,
    newSignups: 234,
    totalJobs: 3942,
    completedJobs: 3124,
    activeJobs: 818,
    totalRevenue: 2450000,
    platformFees: 0,
    averageJobValue: 1250,
    userGrowth: 15.2,
    jobGrowth: 8.7,
    revenueGrowth: 23.1
  })

  const [recentActivity, setRecentActivity] = useState<ActivityItem[]>([
    {
      id: '1',
      type: 'user',
      title: 'New User Registration',
      description: 'sarah_designer joined the platform',
      timestamp: '2 minutes ago',
      status: 'success'
    },
    {
      id: '2',
      type: 'job',
      title: 'Job Completed',
      description: 'React Developer position completed successfully',
      timestamp: '15 minutes ago',
      status: 'success'
    },
    {
      id: '3',
      type: 'payment',
      title: 'Payment Processed',
      description: '$2,500 payment completed via escrow',
      timestamp: '1 hour ago',
      status: 'success'
    },
    {
      id: '4',
      type: 'issue',
      title: 'Dispute Reported',
      description: 'Client reported issue with web design project',
      timestamp: '2 hours ago',
      status: 'warning'
    }
  ])

  const [timeRange, setTimeRange] = useState('7d')
  const [isLoading, setIsLoading] = useState(false)

  // Check if user is admin (in a real app, this would be more robust)
  useEffect(() => {
    if (!isAuthenticated) {
      window.location.href = '/auth/signin'
      return
    }
    
    // Demo: Only allow admin access for specific users
    const isAdmin = user?.email === 'admin@tykoonconnect.com' || user?.user_metadata?.role === 'admin'
    if (!isAdmin) {
      alert('Access denied. Admin privileges required.')
      window.location.href = '/dashboard'
    }
  }, [isAuthenticated, user])

  const handleRefresh = async () => {
    setIsLoading(true)
    // Simulate API call
    setTimeout(() => {
      // In a real app, this would fetch fresh data
      setReportData({
        ...reportData,
        newSignups: Math.floor(Math.random() * 50) + 200,
        activeUsers: Math.floor(Math.random() * 1000) + 8000
      })
      setIsLoading(false)
    }, 1000)
  }

  const handleExport = () => {
    // In a real app, this would generate and download a report
    alert('Report export functionality would be implemented here')
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'user': return Users
      case 'job': return BarChart3
      case 'payment': return DollarSign
      case 'issue': return AlertTriangle
      default: return Eye
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'text-green-600 bg-green-100'
      case 'warning': return 'text-yellow-600 bg-yellow-100'
      case 'error': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <Button variant="outline" className="mb-4" asChild>
                  <Link href="/admin">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Admin
                  </Link>
                </Button>
                
                <div className="flex items-center space-x-3 mb-4">
                  <div className="bg-gradient-to-br from-blue-600 to-blue-700 text-white p-3 rounded-xl shadow-lg">
                    <BarChart3 className="h-6 w-6" />
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-slate-100">Reports & Analytics</h1>
                    <p className="text-gray-600 dark:text-slate-300">
                      Platform performance and user insights
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="flex space-x-2">
                <Button variant="outline" onClick={handleExport}>
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
                <Button onClick={handleRefresh} disabled={isLoading}>
                  <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                  Refresh
                </Button>
              </div>
            </div>
            
            {/* Demo Notice */}
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
              <p className="text-yellow-800 dark:text-yellow-200 text-sm">
                <strong>Admin Demo:</strong> This is a preview of the admin reporting system. All data is simulated for demonstration purposes.
              </p>
            </div>
          </div>

          {/* Time Range Filter */}
          <div className="mb-6">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-700 dark:text-slate-300">Time Range:</span>
              </div>
              <div className="flex space-x-2">
                {[
                  { value: '24h', label: '24 Hours' },
                  { value: '7d', label: '7 Days' },
                  { value: '30d', label: '30 Days' },
                  { value: '90d', label: '90 Days' }
                ].map((range) => (
                  <Button
                    key={range.value}
                    variant={timeRange === range.value ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setTimeRange(range.value)}
                  >
                    {range.label}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{reportData.totalUsers.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-600">+{reportData.userGrowth}%</span> from last month
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Jobs</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{reportData.activeJobs.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-600">+{reportData.jobGrowth}%</span> from last month
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Volume</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${(reportData.totalRevenue / 1000).toFixed(0)}K</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-600">+{reportData.revenueGrowth}%</span> from last month
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Platform Fees</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">${reportData.platformFees}</div>
                <p className="text-xs text-muted-foreground">
                  Zero-fee platform model
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid lg:grid-cols-2 gap-6 mb-8">
            {/* User Statistics */}
            <Card>
              <CardHeader>
                <CardTitle>User Statistics</CardTitle>
                <CardDescription>User registration and activity metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Total Registered Users</span>
                    <span className="font-bold">{reportData.totalUsers.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Active Users (30 days)</span>
                    <span className="font-bold">{reportData.activeUsers.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">New Signups (7 days)</span>
                    <span className="font-bold text-green-600">+{reportData.newSignups}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">User Retention Rate</span>
                    <span className="font-bold">87.2%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Job Statistics */}
            <Card>
              <CardHeader>
                <CardTitle>Job Statistics</CardTitle>
                <CardDescription>Job posting and completion metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Total Jobs Posted</span>
                    <span className="font-bold">{reportData.totalJobs.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Completed Jobs</span>
                    <span className="font-bold">{reportData.completedJobs.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Active Jobs</span>
                    <span className="font-bold text-blue-600">{reportData.activeJobs}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Average Job Value</span>
                    <span className="font-bold">${reportData.averageJobValue.toLocaleString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Eye className="h-5 w-5" />
                <span>Recent Activity</span>
              </CardTitle>
              <CardDescription>Latest platform events and user activities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((item) => {
                  const Icon = getActivityIcon(item.type)
                  return (
                    <div key={item.id} className="flex items-start space-x-4 p-4 bg-gray-50 dark:bg-slate-800 rounded-lg">
                      <div className={`p-2 rounded-full ${getStatusColor(item.status)}`}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-semibold text-gray-900 dark:text-slate-100">
                          {item.title}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-slate-300">
                          {item.description}
                        </p>
                        <div className="flex items-center space-x-2 mt-1">
                          <Clock className="h-3 w-3 text-gray-400" />
                          <span className="text-xs text-gray-500 dark:text-slate-400">
                            {item.timestamp}
                          </span>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <div className="mt-8">
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid sm:grid-cols-4 gap-4">
                  <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2" asChild>
                    <Link href="/admin/users">
                      <Users className="h-6 w-6" />
                      <span>Manage Users</span>
                    </Link>
                  </Button>
                  <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2" asChild>
                    <Link href="/admin/agreements">
                      <CheckCircle className="h-6 w-6" />
                      <span>View Agreements</span>
                    </Link>
                  </Button>
                  <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2" asChild>
                    <Link href="/admin/donations">
                      <DollarSign className="h-6 w-6" />
                      <span>Donations</span>
                    </Link>
                  </Button>
                  <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2" asChild>
                    <Link href="/admin/feature-flags">
                      <Filter className="h-6 w-6" />
                      <span>Feature Flags</span>
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}