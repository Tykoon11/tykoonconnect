'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { 
  DollarSign, 
  Calendar, 
  TrendingUp, 
  TrendingDown, 
  Clock, 
  Star, 
  Award,
  Crown,
  Target,
  CheckCircle,
  Users,
  Briefcase,
  Zap
} from 'lucide-react'

// Mock data - replace with real data from API
const mockSpendingHistory = [
  {
    id: '1',
    projectTitle: 'E-commerce Website Development',
    freelancerName: 'John Developer',
    amount: 5000,
    date: '2024-09-10',
    status: 'completed',
    category: 'Web Development'
  },
  {
    id: '2', 
    projectTitle: 'Mobile App UI Design',
    freelancerName: 'Sarah Designer',
    amount: 2500,
    date: '2024-09-08',
    status: 'in_progress',
    category: 'Design'
  },
  {
    id: '3',
    projectTitle: 'Content Writing Package',
    freelancerName: 'Mike Writer',
    amount: 800,
    date: '2024-09-05',
    status: 'completed',
    category: 'Writing'
  },
  {
    id: '4',
    projectTitle: 'SEO Optimization',
    freelancerName: 'Lisa SEO Expert',
    amount: 1200,
    date: '2024-09-03',
    status: 'completed',
    category: 'Marketing'
  }
]

const mockEarningsHistory = [
  {
    id: '1',
    projectTitle: 'React Dashboard Development',
    clientName: 'TechCorp Inc.',
    amount: 4200,
    date: '2024-09-10',
    status: 'completed',
    category: 'Web Development',
    rating: 5
  },
  {
    id: '2',
    projectTitle: 'Logo Design Package', 
    clientName: 'StartupXYZ',
    amount: 1500,
    date: '2024-09-07',
    status: 'completed',
    category: 'Design',
    rating: 4.8
  },
  {
    id: '3',
    projectTitle: 'API Integration',
    clientName: 'DataFlow Ltd',
    amount: 2800,
    date: '2024-09-02',
    status: 'in_progress',
    category: 'Backend',
    rating: null
  }
]

const mockActiveJobsData = [
  {
    id: '1',
    title: 'WordPress Website Redesign',
    budget: 3500,
    proposals: 12,
    posted: '2024-09-10',
    deadline: '2024-10-15',
    status: 'active',
    category: 'Web Development'
  },
  {
    id: '2',
    title: 'Brand Identity Design',
    budget: 2000,
    proposals: 8,
    posted: '2024-09-08',
    deadline: '2024-10-08',
    status: 'active',
    category: 'Design'
  }
]

const mockPremiumQualifications = {
  completionRate: 96.5,
  averageRating: 4.9,
  membershipDuration: 14, // months
  totalEarnings: 18784,
  requirements: {
    completionRate: { required: 95, current: 96.5, met: true },
    rating: { required: 4.8, current: 4.9, met: true },
    membership: { required: 12, current: 14, met: true },
    earnings: { required: 10000, current: 18784, met: true }
  }
}

interface AnalyticsModalProps {
  isOpen: boolean
  onClose: () => void
  type: 'spending' | 'earnings' | 'active-jobs' | 'active-projects' | 'rating' | 'premium'
  title: string
  data?: any
}

export function AnalyticsModal({ isOpen, onClose, type, title, data }: AnalyticsModalProps) {
  const [activeTab, setActiveTab] = useState('overview')

  const renderSpendingBreakdown = () => (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">This Month</p>
                <p className="text-2xl font-bold">$8,500</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-500" />
            </div>
            <p className="text-xs text-green-600 mt-1">+18% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Average Project</p>
                <p className="text-2xl font-bold">$2,375</p>
              </div>
              <DollarSign className="h-8 w-8 text-blue-500" />
            </div>
            <p className="text-xs text-blue-600 mt-1">Across 4 projects</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Top Category</p>
                <p className="text-lg font-bold">Web Dev</p>
              </div>
              <Briefcase className="h-8 w-8 text-purple-500" />
            </div>
            <p className="text-xs text-purple-600 mt-1">52% of spending</p>
          </CardContent>
        </Card>
      </div>

      {/* Spending History */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold">Recent Transactions</h3>
        {mockSpendingHistory.map((transaction) => (
          <Card key={transaction.id}>
            <CardContent className="pt-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h4 className="font-medium">{transaction.projectTitle}</h4>
                  <p className="text-sm text-gray-600">by {transaction.freelancerName}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline">{transaction.category}</Badge>
                    <Badge variant={transaction.status === 'completed' ? 'default' : 'secondary'}>
                      {transaction.status}
                    </Badge>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-lg">${transaction.amount.toLocaleString()}</p>
                  <p className="text-sm text-gray-500">{new Date(transaction.date).toLocaleDateString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )

  const renderEarningsBreakdown = () => (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">This Month</p>
                <p className="text-2xl font-bold">$6,200</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-500" />
            </div>
            <p className="text-xs text-green-600 mt-1">+25% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Hourly Rate</p>
                <p className="text-2xl font-bold">$85</p>
              </div>
              <Clock className="h-8 w-8 text-blue-500" />
            </div>
            <p className="text-xs text-blue-600 mt-1">Average across projects</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Success Rate</p>
                <p className="text-2xl font-bold">98%</p>
              </div>
              <Target className="h-8 w-8 text-purple-500" />
            </div>
            <p className="text-xs text-purple-600 mt-1">Project completion</p>
          </CardContent>
        </Card>
      </div>

      {/* Earnings History */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold">Recent Projects</h3>
        {mockEarningsHistory.map((project) => (
          <Card key={project.id}>
            <CardContent className="pt-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h4 className="font-medium">{project.projectTitle}</h4>
                  <p className="text-sm text-gray-600">for {project.clientName}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline">{project.category}</Badge>
                    <Badge variant={project.status === 'completed' ? 'default' : 'secondary'}>
                      {project.status}
                    </Badge>
                    {project.rating && (
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        <span className="text-xs">{project.rating}</span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-lg">${project.amount.toLocaleString()}</p>
                  <p className="text-sm text-gray-500">{new Date(project.date).toLocaleDateString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )

  const renderActiveJobsBreakdown = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Budget</p>
                <p className="text-2xl font-bold">$5,500</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Proposals</p>
                <p className="text-2xl font-bold">20</p>
              </div>
              <Users className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-3">
        <h3 className="text-lg font-semibold">Active Job Listings</h3>
        {mockActiveJobsData.map((job) => (
          <Card key={job.id}>
            <CardContent className="pt-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h4 className="font-medium">{job.title}</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline">{job.category}</Badge>
                    <Badge variant="default">{job.status}</Badge>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    Posted: {new Date(job.posted).toLocaleDateString()} • 
                    Deadline: {new Date(job.deadline).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-lg">${job.budget.toLocaleString()}</p>
                  <p className="text-sm text-gray-500">{job.proposals} proposals</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )

  const renderPremiumQualification = () => (
    <div className="space-y-6">
      {/* Premium Status */}
      <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200">
        <CardContent className="pt-6">
          <div className="flex items-center justify-center mb-4">
            <Crown className="h-12 w-12 text-yellow-500" />
          </div>
          <div className="text-center">
            <h3 className="text-xl font-bold text-yellow-800 mb-2">🎉 Premium Status Achieved!</h3>
            <p className="text-yellow-700">
              You've met all requirements for Premium status and earned 25 daily interests!
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Requirements */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Premium Requirements</h3>
        
        {Object.entries(mockPremiumQualifications.requirements).map(([key, req]) => {
          const labels = {
            completionRate: 'Success Rate',
            rating: 'Average Rating', 
            membership: 'Platform Membership',
            earnings: 'Total Earnings'
          }
          
          const formatValue = (key: string, value: number) => {
            if (key === 'completionRate') return `${value}%`
            if (key === 'rating') return `${value}/5.0`
            if (key === 'membership') return `${value} months`
            if (key === 'earnings') return `$${value.toLocaleString()}`
            return value.toString()
          }

          return (
            <Card key={key}>
              <CardContent className="pt-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">{labels[key as keyof typeof labels]}</span>
                  <div className="flex items-center gap-2">
                    {req.met ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                      <div className="h-5 w-5 rounded-full border-2 border-gray-300" />
                    )}
                    <span className={`font-bold ${req.met ? 'text-green-600' : 'text-orange-600'}`}>
                      {formatValue(key, req.current)}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                  <span>Required: {formatValue(key, req.required)}</span>
                  <span>{req.met ? 'Achieved' : 'In Progress'}</span>
                </div>
                <Progress 
                  value={Math.min(100, (req.current / req.required) * 100)} 
                  className={`h-2 ${req.met ? 'text-green-500' : 'text-orange-500'}`}
                />
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Premium Benefits */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-yellow-500" />
            Premium Benefits Unlocked
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              25 daily interests (vs 15 for free users)
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              Premium badge on profile
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              Higher visibility in search results
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              Priority customer support
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )

  const getModalContent = () => {
    switch (type) {
      case 'spending':
        return renderSpendingBreakdown()
      case 'earnings':
        return renderEarningsBreakdown()
      case 'active-jobs':
      case 'active-projects':
        return renderActiveJobsBreakdown()
      case 'premium':
        return renderPremiumQualification()
      default:
        return <p>Detailed breakdown coming soon...</p>
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">{title}</DialogTitle>
          <DialogDescription>
            Detailed breakdown and analysis of your {type.replace('-', ' ')} data
          </DialogDescription>
        </DialogHeader>
        
        <div className="mt-6">
          {getModalContent()}
        </div>
        
        <div className="flex justify-end mt-6 pt-4 border-t">
          <Button onClick={onClose}>Close</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}