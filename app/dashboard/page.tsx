'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { StatCard, BarChart, ProgressRing, SimpleLineChart } from '@/components/ui/charts'
import { LoadingSpinner, LoadingCard } from '@/components/ui/loading-spinner'
import { analyticsService, type DashboardData } from '@/lib/analytics'
import { useAuth } from '@/lib/auth/context'
import { useToast } from '@/components/ui/toast'
import { Users, Briefcase, MessageSquare, Star, Plus, Search, Calendar, DollarSign, TrendingUp, Award, Target, Zap, RefreshCw, Crown, AlertCircle } from 'lucide-react'
import { useMandatoryReview } from '@/hooks/use-mandatory-review'
import { ReviewModal } from '@/components/ui/review-modal'
import Link from 'next/link'
import { AnalyticsModal } from '@/components/ui/analytics-modals'
import { PaymentAnalyticsModal } from '@/components/ui/payment-analytics-modal'
import { premiumService } from '@/lib/premium-service'

export default function DashboardPage() {
  const { user } = useAuth()
  const { addToast } = useToast()
  const [activeTab, setActiveTab] = useState<'client' | 'freelancer'>('client')
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [modalType, setModalType] = useState<'spending' | 'earnings' | 'active-jobs' | 'active-projects' | 'rating' | 'premium'>('spending')
  const [modalTitle, setModalTitle] = useState('')
  const [paymentModalOpen, setPaymentModalOpen] = useState(false)
  const [paymentModalType, setPaymentModalType] = useState<'spending' | 'earnings' | 'overview'>('overview')
  const [isPremium, setIsPremium] = useState(false)
  
  // Mandatory review system
  const {
    pendingReviews,
    submitReview,
    showReviewModal,
    currentReviewAgreement,
    openReviewModal,
    closeReviewModal
  } = useMandatoryReview()

  const loadDashboardData = async (showRefreshIndicator = false) => {
    if (showRefreshIndicator) setIsRefreshing(true)
    
    try {
      const userId = user?.id || 'demo-user'
      const data = await analyticsService.getDashboardData(userId)
      setDashboardData(data)
      
      // Check premium status
      const premiumStatus = await premiumService.hasPremiumStatus(userId)
      setIsPremium(premiumStatus)
      
      if (showRefreshIndicator) {
        addToast({
          type: 'success',
          title: 'Dashboard Updated',
          description: 'Analytics data has been refreshed with the latest information.',
          duration: 3000
        })
      }
    } catch (error) {
      console.error('Error loading dashboard:', error)
      addToast({
        type: 'error',
        title: 'Loading Error',
        description: 'Failed to load dashboard data. Using cached information.',
        duration: 4000
      })
    } finally {
      setIsLoading(false)
      setIsRefreshing(false)
    }
  }

  useEffect(() => {
    loadDashboardData()
  }, [user])

  const handleRefresh = () => {
    const userId = user?.id || 'demo-user'
    analyticsService.clearCache(userId)
    loadDashboardData(true)
  }

  const handleAnalyticsClick = (type: typeof modalType, title: string) => {
    // Use Payment Analytics Modal for spending and earnings
    if (type === 'spending' || type === 'earnings') {
      setPaymentModalType(type)
      setModalTitle(title)
      setPaymentModalOpen(true)
    } else {
      setModalType(type)
      setModalTitle(title)
      setModalOpen(true)
    }
  }

  const demoStats = {
    client: {
      activeJobs: 3,
      totalSpent: 15750,
      avgRating: 4.8,
      proposals: 23,
      completionRate: 95,
      avgResponseTime: '2.4 hours'
    },
    freelancer: {
      activeProjects: 2,
      totalEarned: 12400,
      avgRating: 4.9,
      completedJobs: 18,
      successRate: 98,
      avgDeliveryTime: '1.2 days early'
    }
  }

  // Chart data
  const monthlyData = [
    { x: 'Jan', y: 2400 },
    { x: 'Feb', y: 3200 },
    { x: 'Mar', y: 2800 },
    { x: 'Apr', y: 4100 },
    { x: 'May', y: 3600 },
    { x: 'Jun', y: 4200 }
  ]

  const skillsData = [
    { label: 'React', value: 95, color: '#61DAFB' },
    { label: 'Node.js', value: 88, color: '#339933' },
    { label: 'TypeScript', value: 92, color: '#3178C6' },
    { label: 'Python', value: 76, color: '#3776AB' }
  ]

  const demoJobs = [
    {
      id: '1',
      title: 'E-commerce Website Development',
      status: 'In Progress',
      budget: 5000,
      proposals: 8,
      created: '2024-09-10'
    },
    {
      id: '2',
      title: 'Brand Identity Design Package', 
      status: 'Open',
      budget: 2500,
      proposals: 3,
      created: '2024-09-11'
    },
    {
      id: '3',
      title: 'Mobile App UI/UX Design',
      status: 'Completed',
      budget: 3500,
      proposals: 12,
      created: '2024-09-09'
    }
  ]

  const demoProjects = [
    {
      id: '1',
      title: 'React Dashboard Development',
      client: 'TechCorp Inc.',
      status: 'In Progress',
      earned: 4200,
      deadline: '2024-09-20'
    },
    {
      id: '2', 
      title: 'Logo Design for Startup',
      client: 'Innovation Labs',
      status: 'Under Review',
      earned: 800,
      deadline: '2024-09-15'
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Welcome & Role Tabs */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold mb-2">Dashboard</h2>
            <p className="text-gray-600 mb-4">Manage your projects and track your progress</p>
            
            <div className="flex items-center justify-between">
              <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit">
                <button
                  onClick={() => setActiveTab('client')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeTab === 'client'
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Client View
                </button>
                <button
                  onClick={() => setActiveTab('freelancer')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeTab === 'freelancer'
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Freelancer View
                </button>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="flex items-center gap-2"
              >
                <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                {isRefreshing ? 'Refreshing...' : 'Refresh Data'}
              </Button>
            </div>
          </div>

          {/* Client View */}
          {activeTab === 'client' && (
            <div className="space-y-8">
              {/* Enhanced Stats Cards */}
              {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <LoadingCard key={i} />
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <StatCard
                    title="Active Jobs"
                    value={dashboardData?.stats.activeJobs || 0}
                    icon={Briefcase}
                    trend={12}
                    description="2 closing soon"
                    color="#3B82F6"
                    onClick={() => handleAnalyticsClick('active-jobs', 'Active Jobs Breakdown')}
                  />
                  <StatCard
                    title="Total Spent"
                    value={`$${(dashboardData?.stats.totalSpent || 0).toLocaleString()}`}
                    icon={DollarSign}
                    trend={8}
                    description="This month"
                    color="#10B981"
                    onClick={() => handleAnalyticsClick('spending', 'Spending History & Analytics')}
                  />
                  <StatCard
                    title="Average Rating"
                    value={dashboardData?.stats.avgRating ? (
                      <div className="flex items-center gap-2">
                        {dashboardData.stats.avgRating.toFixed(1)}
                        {isPremium && <Crown className="h-4 w-4 text-yellow-500" />}
                      </div>
                    ) : '0.0'}
                    icon={Star}
                    trend={0.2}
                    description="From 23 reviews"
                    color="#F59E0B"
                    onClick={() => handleAnalyticsClick(isPremium ? 'premium' : 'rating', isPremium ? 'Premium Status & Benefits' : 'Rating Breakdown')}
                  />
                  <StatCard
                    title="Response Time"
                    value={dashboardData?.stats.avgResponseTime || '0 hours'}
                    icon={Zap}
                    trend={-15}
                    description="Average"
                    color="#8B5CF6"
                    onClick={() => handleAnalyticsClick('active-jobs', 'Performance Analytics')}
                  />
                </div>
              )}

              {/* Analytics Section */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Monthly Spending Chart */}
                <Card className="lg:col-span-2">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <TrendingUp className="h-5 w-5 text-blue-600" />
                      <span>Monthly Spending Trends</span>
                    </CardTitle>
                    <CardDescription>Your spending patterns over the last 6 months</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {isLoading ? (
                      <div className="h-48 flex items-center justify-center">
                        <LoadingSpinner size="lg" />
                      </div>
                    ) : (
                      <SimpleLineChart 
                        data={dashboardData?.stats.monthlyData || []}
                        height={200}
                        color="#3B82F6"
                      />
                    )}
                  </CardContent>
                </Card>

                {/* Completion Rate */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Target className="h-5 w-5 text-green-600" />
                      <span>Project Success</span>
                    </CardTitle>
                    <CardDescription>Completion rate of your posted jobs</CardDescription>
                  </CardHeader>
                  <CardContent className="flex flex-col items-center space-y-4">
                    {isLoading ? (
                      <LoadingSpinner size="xl" />
                    ) : (
                      <>
                        <ProgressRing 
                          progress={dashboardData?.stats.completionRate || 0}
                          size={120}
                          color="#10B981"
                        />
                        <div className="text-center">
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {demoStats.client.completionRate}% of projects completed successfully
                          </p>
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Mandatory Review Prompt */}
              {pendingReviews.length > 0 && (
                <Card className="border-amber-200 bg-amber-50 dark:bg-amber-900/10 dark:border-amber-800">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3 text-amber-800 dark:text-amber-200">
                      <AlertCircle className="h-5 w-5" />
                      Reviews Required
                      <Badge variant="secondary" className="bg-amber-100 text-amber-800">
                        {pendingReviews.length}
                      </Badge>
                    </CardTitle>
                    <CardDescription className="text-amber-700 dark:text-amber-300">
                      Complete your project reviews to help maintain platform quality and close your agreements.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {pendingReviews.slice(0, 3).map((agreement) => (
                        <div key={agreement.id} className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border">
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900 dark:text-slate-100">
                              {agreement.jobTitle}
                            </h4>
                            <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-slate-400 mt-1">
                              <span>Freelancer: {agreement.freelancerName}</span>
                              <span>${(agreement.priceTotal / 100).toLocaleString()}</span>
                              <span>Completed {new Date(agreement.completedAt).toLocaleDateString()}</span>
                            </div>
                          </div>
                          <Button 
                            size="sm"
                            onClick={() => openReviewModal(agreement)}
                            className="bg-amber-600 hover:bg-amber-700 text-white"
                          >
                            Submit Review
                          </Button>
                        </div>
                      ))}
                      {pendingReviews.length > 3 && (
                        <div className="text-center pt-2">
                          <Button variant="outline" size="sm">
                            View All {pendingReviews.length} Pending Reviews
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-4">
                    <Button asChild>
                      <Link href="/jobs/new">
                        <Plus className="mr-2 h-4 w-4" />
                        Post New Job
                      </Link>
                    </Button>
                    <Button variant="outline" asChild>
                      <Link href="/jobs">
                        <Search className="mr-2 h-4 w-4" />
                        Browse Talent
                      </Link>
                    </Button>
                    <Button variant="outline" asChild>
                      <Link href="/messages">
                        <MessageSquare className="mr-2 h-4 w-4" />
                        View Messages
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Your Jobs */}
              <Card>
                <CardHeader>
                  <CardTitle>Your Jobs</CardTitle>
                  <CardDescription>Manage your posted projects</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {(dashboardData?.recentJobs || []).map((job) => (
                      <div key={job.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex-1">
                          <h3 className="font-medium">{job.title}</h3>
                          <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                            <span>${job.budget.toLocaleString()}</span>
                            <span>{job.proposals} proposals</span>
                            <span>Posted {new Date(job.created).toLocaleDateString()}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge variant={job.status === 'Open' ? 'default' : job.status === 'In Progress' ? 'secondary' : 'outline'}>
                            {job.status}
                          </Badge>
                          <Button 
                            variant={job.status === 'Open' ? 'default' : 'outline'} 
                            size="sm" 
                            asChild
                          >
                            <Link href={`/dashboard/jobs/${job.id}`}>
                              {job.status === 'Open' ? 'Manage' : 'View'}
                            </Link>
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Freelancer View */}
          {activeTab === 'freelancer' && (
            <div className="space-y-8">
              {/* Enhanced Stats Cards */}
              {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <LoadingCard key={i} />
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <StatCard
                    title="Active Projects"
                    value={dashboardData?.stats.activeProjects || 0}
                    icon={Briefcase}
                    trend={25}
                    description="1 due this week"
                    color="#3B82F6"
                    onClick={() => handleAnalyticsClick('active-projects', 'Active Projects Breakdown')}
                  />
                  <StatCard
                    title="Total Earned"
                    value={`$${(dashboardData?.stats.totalEarned || 0).toLocaleString()}`}
                    icon={DollarSign}
                    trend={18}
                    description="This month"
                    color="#10B981"
                    onClick={() => handleAnalyticsClick('earnings', 'Earnings History & Analytics')}
                  />
                  <StatCard
                    title="Average Rating"
                    value={dashboardData?.stats.avgRating ? (
                      <div className="flex items-center gap-2">
                        {dashboardData.stats.avgRating.toFixed(1)}
                        {isPremium && <Crown className="h-4 w-4 text-yellow-500" />}
                      </div>
                    ) : '0.0'}
                    icon={Star}
                    trend={0.1}
                    description="From 18 reviews"
                    color="#F59E0B"
                    onClick={() => handleAnalyticsClick(isPremium ? 'premium' : 'rating', isPremium ? 'Premium Status & Benefits' : 'Rating Breakdown')}
                  />
                  <StatCard
                    title="Jobs Completed"
                    value={dashboardData?.stats.completedJobs || 0}
                    icon={Award}
                    trend={11}
                    description="This quarter"
                    color="#8B5CF6"
                    onClick={() => handleAnalyticsClick('active-projects', 'Completion Analytics')}
                  />
                </div>
              )}

              {/* Analytics Section */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Skills Chart */}
                <Card className="lg:col-span-2">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Award className="h-5 w-5 text-purple-600" />
                      <span>Skills Proficiency</span>
                    </CardTitle>
                    <CardDescription>Your skill ratings based on client feedback</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {isLoading ? (
                      <div className="h-48 flex items-center justify-center">
                        <LoadingSpinner size="lg" />
                      </div>
                    ) : (
                      <BarChart 
                        data={dashboardData?.skillsData || []}
                        height={200}
                        showValues={true}
                      />
                    )}
                  </CardContent>
                </Card>

                {/* Success Rate */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Target className="h-5 w-5 text-emerald-600" />
                      <span>Success Rate</span>
                    </CardTitle>
                    <CardDescription>Projects delivered on time and budget</CardDescription>
                  </CardHeader>
                  <CardContent className="flex flex-col items-center space-y-4">
                    {isLoading ? (
                      <LoadingSpinner size="xl" />
                    ) : (
                      <>
                        <ProgressRing 
                          progress={dashboardData?.stats.successRate || 0}
                          size={120}
                          color="#059669"
                        />
                        <div className="text-center">
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {demoStats.freelancer.successRate}% success rate
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                            Average: {demoStats.freelancer.avgDeliveryTime}
                          </p>
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-4">
                    <Button asChild>
                      <Link href="/jobs">
                        <Search className="mr-2 h-4 w-4" />
                        Find Work
                      </Link>
                    </Button>
                    <Button variant="outline" asChild>
                      <Link href="/profile">
                        <Users className="mr-2 h-4 w-4" />
                        Update Profile
                      </Link>
                    </Button>
                    <Button variant="outline" asChild>
                      <Link href="/messages">
                        <MessageSquare className="mr-2 h-4 w-4" />
                        View Messages
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Your Projects */}
              <Card>
                <CardHeader>
                  <CardTitle>Your Projects</CardTitle>
                  <CardDescription>Track your active work</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {(dashboardData?.recentProjects || []).map((project) => (
                      <div key={project.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex-1">
                          <h3 className="font-medium">{project.title}</h3>
                          <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                            <span>Client: {project.client}</span>
                            <span>${project.earned.toLocaleString()}</span>
                            <span className="flex items-center">
                              <Calendar className="h-3 w-3 mr-1" />
                              Due {new Date(project.deadline).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge variant={project.status === 'In Progress' ? 'default' : 'secondary'}>
                            {project.status}
                          </Badge>
                          <Button variant="outline" size="sm">
                            View Details
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Demo Notice */}
          <Card className="mt-8">
            <CardContent className="pt-6">
              <div className="text-center text-sm text-gray-600">
                <p><strong>Demo Mode:</strong> This dashboard shows sample data. In production, this would display your actual jobs, projects, and statistics.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Analytics Modal */}
      <AnalyticsModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        type={modalType}
        title={modalTitle}
      />
      
      {/* Payment Analytics Modal */}
      <PaymentAnalyticsModal
        isOpen={paymentModalOpen}
        onClose={() => setPaymentModalOpen(false)}
        userId={user?.id || 'demo-user'}
        type={paymentModalType}
        title={modalTitle}
      />
      
      {/* Mandatory Review Modal */}
      {showReviewModal && currentReviewAgreement && (
        <ReviewModal
          isOpen={showReviewModal}
          onClose={closeReviewModal}
          onSubmit={submitReview}
          agreement={currentReviewAgreement}
          userRole="client"
        />
      )}
    </div>
  )
}