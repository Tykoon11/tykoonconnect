'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Input } from '@/components/ui/input'
import { 
  FileText, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  DollarSign,
  Calendar,
  User,
  Briefcase,
  Shield,
  Eye,
  MessageSquare,
  Download,
  Upload,
  Search,
  Filter,
  MoreHorizontal,
  ExternalLink
} from 'lucide-react'
import Link from 'next/link'
import { useToast } from '@/components/ui/toast'
import { DEMO_MODE } from '@/lib/prisma'
import { useAuth } from '@/lib/auth/context'

interface Agreement {
  id: string
  jobId: string
  jobTitle: string
  clientId: string
  clientName: string
  clientHandle: string
  freelancerId: string
  freelancerName: string
  freelancerHandle: string
  scopeSummary: string
  priceTotal: number
  startDate: string
  targetDate: string
  assuranceMethod: 'MILESTONE_INVOICE' | 'EXTERNAL_ESCROW' | 'CARD_HOLD'
  assuranceState: 'DRAFT' | 'PENDING_SECURE' | 'SECURED' | 'IN_PROGRESS' | 'SUBMITTED' | 'ACCEPTED' | 'CLOSED'
  createdAt: string
  updatedAt: string
  
  // Progress tracking
  milestonesCompleted?: number
  milestonesTotal?: number
  
  // Latest activity
  lastActivity: string
  lastActivityType: string
}

export default function AgreementsPage() {
  const { user, isAuthenticated } = useAuth()
  const { addToast } = useToast()
  const [agreements, setAgreements] = useState<Agreement[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'active' | 'completed' | 'draft'>('all')
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    const fetchAgreements = async () => {
      if (DEMO_MODE) {
        // Demo agreements
        const demoAgreements: Agreement[] = [
          {
            id: 'agreement-1',
            jobId: 'job-123',
            jobTitle: 'E-commerce Website Development',
            clientId: 'client-1',
            clientName: 'TechStart Inc',
            clientHandle: 'techstart',
            freelancerId: 'freelancer-1',
            freelancerName: 'Alex Johnson',
            freelancerHandle: 'alexjdev',
            scopeSummary: 'Complete e-commerce platform with React frontend and Node.js backend, including payment integration and admin dashboard.',
            priceTotal: 500000, // $5,000
            startDate: '2024-01-15',
            targetDate: '2024-03-15',
            assuranceMethod: 'MILESTONE_INVOICE',
            assuranceState: 'IN_PROGRESS',
            createdAt: '2024-01-10',
            updatedAt: '2024-01-20',
            milestonesCompleted: 2,
            milestonesTotal: 4,
            lastActivity: '2024-01-20',
            lastActivityType: 'milestone_completed'
          },
          {
            id: 'agreement-2',
            jobId: 'job-456',
            jobTitle: 'Mobile App API Integration',
            clientId: 'client-2',
            clientName: 'StartupCo',
            clientHandle: 'startupco',
            freelancerId: 'freelancer-1',
            freelancerName: 'Alex Johnson',
            freelancerHandle: 'alexjdev',
            scopeSummary: 'Integration of payment processing and user authentication APIs for mobile application.',
            priceTotal: 150000, // $1,500
            startDate: '2023-12-01',
            targetDate: '2024-01-01',
            assuranceMethod: 'EXTERNAL_ESCROW',
            assuranceState: 'ACCEPTED',
            createdAt: '2023-11-25',
            updatedAt: '2024-01-05',
            lastActivity: '2024-01-05',
            lastActivityType: 'work_delivered'
          },
          {
            id: 'agreement-3',
            jobId: 'job-789',
            jobTitle: 'SaaS Dashboard Development',
            clientId: 'client-3',
            clientName: 'DataFlow Systems',
            clientHandle: 'dataflow',
            freelancerId: 'freelancer-1',
            freelancerName: 'Alex Johnson',
            freelancerHandle: 'alexjdev',
            scopeSummary: 'Custom dashboard for data visualization and analytics with real-time updates.',
            priceTotal: 750000, // $7,500
            startDate: '2024-02-01',
            targetDate: '2024-04-30',
            assuranceMethod: 'CARD_HOLD',
            assuranceState: 'PENDING_SECURE',
            createdAt: '2024-01-25',
            updatedAt: '2024-01-25',
            lastActivity: '2024-01-25',
            lastActivityType: 'agreement_created'
          },
          {
            id: 'agreement-4',
            jobId: 'job-012',
            jobTitle: 'WordPress Plugin Development',
            clientId: 'client-4',
            clientName: 'BlogCorp',
            clientHandle: 'blogcorp',
            freelancerId: 'freelancer-1',
            freelancerName: 'Alex Johnson',
            freelancerHandle: 'alexjdev',
            scopeSummary: 'Custom WordPress plugin for content management and SEO optimization.',
            priceTotal: 200000, // $2,000
            startDate: '2023-10-15',
            targetDate: '2023-12-15',
            assuranceMethod: 'MILESTONE_INVOICE',
            assuranceState: 'CLOSED',
            createdAt: '2023-10-10',
            updatedAt: '2023-12-20',
            milestonesCompleted: 3,
            milestonesTotal: 3,
            lastActivity: '2023-12-20',
            lastActivityType: 'agreement_closed'
          }
        ]
        setAgreements(demoAgreements)
      } else {
        // Real API call
        try {
          const response = await fetch('/api/agreements')
          if (!response.ok) throw new Error('Failed to fetch agreements')
          const data = await response.json()
          setAgreements(data.agreements)
        } catch (error) {
          addToast({
            type: 'error',
            title: 'Error',
            description: 'Failed to load agreements.',
            duration: 5000
          })
        }
      }
      setIsLoading(false)
    }

    if (isAuthenticated) {
      fetchAgreements()
    } else {
      setIsLoading(false)
    }
  }, [isAuthenticated, addToast])

  const getStatusColor = (state: string) => {
    switch (state) {
      case 'DRAFT':
        return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
      case 'PENDING_SECURE':
        return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400'
      case 'SECURED':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400'
      case 'IN_PROGRESS':
        return 'bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400'
      case 'SUBMITTED':
        return 'bg-orange-100 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400'
      case 'ACCEPTED':
        return 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400'
      case 'CLOSED':
        return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
    }
  }

  const getAssuranceMethodLabel = (method: string) => {
    switch (method) {
      case 'MILESTONE_INVOICE':
        return 'Milestone Invoice'
      case 'EXTERNAL_ESCROW':
        return 'External Escrow'
      case 'CARD_HOLD':
        return 'Card Hold'
      default:
        return method
    }
  }

  const getAssuranceIcon = (method: string) => {
    switch (method) {
      case 'MILESTONE_INVOICE':
        return FileText
      case 'EXTERNAL_ESCROW':
        return Shield
      case 'CARD_HOLD':
        return DollarSign
      default:
        return FileText
    }
  }

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount / 100)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const getProgressPercentage = (agreement: Agreement) => {
    if (!agreement.milestonesCompleted || !agreement.milestonesTotal) return 0
    return Math.round((agreement.milestonesCompleted / agreement.milestonesTotal) * 100)
  }

  const filteredAgreements = agreements
    .filter(agreement => {
      if (filter === 'active') return ['IN_PROGRESS', 'SUBMITTED', 'SECURED'].includes(agreement.assuranceState)
      if (filter === 'completed') return ['ACCEPTED', 'CLOSED'].includes(agreement.assuranceState)
      if (filter === 'draft') return ['DRAFT', 'PENDING_SECURE'].includes(agreement.assuranceState)
      return true
    })
    .filter(agreement => {
      if (!searchQuery) return true
      const query = searchQuery.toLowerCase()
      return (
        agreement.jobTitle.toLowerCase().includes(query) ||
        agreement.clientName.toLowerCase().includes(query) ||
        agreement.scopeSummary.toLowerCase().includes(query)
      )
    })

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900 flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader className="text-center">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <CardTitle>Sign In Required</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-gray-600 dark:text-slate-400 mb-4">
              Please sign in to view your agreements.
            </p>
            <Button asChild>
              <Link href="/auth/signin">Sign In</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-slate-100 flex items-center gap-3">
              <FileText className="h-8 w-8 text-blue-600" />
              Agreements
            </h1>
            <p className="text-gray-600 dark:text-slate-400 mt-2">
              Manage your project agreements and track progress.
            </p>
          </div>
        </div>

        {/* Filters and Search */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search agreements..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant={filter === 'all' ? 'default' : 'outline'}
                  onClick={() => setFilter('all')}
                  size="sm"
                >
                  All ({agreements.length})
                </Button>
                <Button
                  variant={filter === 'active' ? 'default' : 'outline'}
                  onClick={() => setFilter('active')}
                  size="sm"
                >
                  Active ({agreements.filter(a => ['IN_PROGRESS', 'SUBMITTED', 'SECURED'].includes(a.assuranceState)).length})
                </Button>
                <Button
                  variant={filter === 'completed' ? 'default' : 'outline'}
                  onClick={() => setFilter('completed')}
                  size="sm"
                >
                  Completed ({agreements.filter(a => ['ACCEPTED', 'CLOSED'].includes(a.assuranceState)).length})
                </Button>
                <Button
                  variant={filter === 'draft' ? 'default' : 'outline'}
                  onClick={() => setFilter('draft')}
                  size="sm"
                >
                  Draft ({agreements.filter(a => ['DRAFT', 'PENDING_SECURE'].includes(a.assuranceState)).length})
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Agreements List */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-slate-400">Loading agreements...</p>
          </div>
        ) : filteredAgreements.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-100 mb-2">
                No Agreements Found
              </h3>
              <p className="text-gray-600 dark:text-slate-400 mb-4">
                {searchQuery 
                  ? 'No agreements match your search.' 
                  : 'You don\'t have any agreements yet.'}
              </p>
              {!searchQuery && (
                <Button asChild>
                  <Link href="/jobs">Browse Jobs</Link>
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {filteredAgreements.map((agreement) => {
              const AssuranceIcon = getAssuranceIcon(agreement.assuranceMethod)
              const progressPercentage = getProgressPercentage(agreement)
              
              return (
                <Card key={agreement.id} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-start gap-4">
                          {/* Job Icon */}
                          <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-xl">
                            <Briefcase className="h-6 w-6 text-blue-600" />
                          </div>
                          
                          <div className="flex-1">
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-slate-100 mb-2">
                              {agreement.jobTitle}
                            </h3>
                            
                            <div className="flex items-center gap-4 mb-3">
                              <div className="flex items-center text-gray-600 dark:text-slate-400">
                                <User className="h-4 w-4 mr-1" />
                                {agreement.clientName}
                              </div>
                              <Badge className={getStatusColor(agreement.assuranceState)}>
                                {agreement.assuranceState.replace('_', ' ').toLowerCase()}
                              </Badge>
                              <div className="flex items-center text-gray-600 dark:text-slate-400">
                                <AssuranceIcon className="h-4 w-4 mr-1" />
                                {getAssuranceMethodLabel(agreement.assuranceMethod)}
                              </div>
                            </div>
                            
                            <p className="text-gray-600 dark:text-slate-400 mb-4 leading-relaxed">
                              {agreement.scopeSummary}
                            </p>
                            
                            {/* Progress Bar */}
                            {agreement.milestonesCompleted !== undefined && agreement.milestonesTotal !== undefined && (
                              <div className="mb-4">
                                <div className="flex items-center justify-between mb-2">
                                  <span className="text-sm text-gray-600 dark:text-slate-400">
                                    Progress: {agreement.milestonesCompleted} of {agreement.milestonesTotal} milestones
                                  </span>
                                  <span className="text-sm font-medium text-gray-900 dark:text-slate-100">
                                    {progressPercentage}%
                                  </span>
                                </div>
                                <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-2">
                                  <div 
                                    className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                                    style={{ width: `${progressPercentage}%` }}
                                  />
                                </div>
                              </div>
                            )}
                            
                            {/* Details Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                              <div>
                                <div className="text-gray-500 dark:text-slate-500">Value</div>
                                <div className="font-semibold text-gray-900 dark:text-slate-100">
                                  {formatAmount(agreement.priceTotal)}
                                </div>
                              </div>
                              <div>
                                <div className="text-gray-500 dark:text-slate-500">Start Date</div>
                                <div className="font-semibold text-gray-900 dark:text-slate-100">
                                  {formatDate(agreement.startDate)}
                                </div>
                              </div>
                              <div>
                                <div className="text-gray-500 dark:text-slate-500">Target Date</div>
                                <div className="font-semibold text-gray-900 dark:text-slate-100">
                                  {formatDate(agreement.targetDate)}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Actions */}
                      <div className="flex items-center gap-2">
                        <Button 
                          asChild 
                          variant="outline" 
                          size="sm"
                          className="gap-2"
                        >
                          <Link href={`/agreements/${agreement.id}`}>
                            <Eye className="h-4 w-4" />
                            View Details
                          </Link>
                        </Button>
                        
                        <Button 
                          asChild 
                          variant="outline" 
                          size="sm"
                          className="gap-2"
                        >
                          <Link href={`/messages?recipient=${agreement.clientHandle}`}>
                            <MessageSquare className="h-4 w-4" />
                            Message
                          </Link>
                        </Button>
                      </div>
                    </div>
                    
                    {/* Footer */}
                    <div className="border-t pt-4 flex items-center justify-between text-sm text-gray-500 dark:text-slate-500">
                      <div>
                        Agreement ID: {agreement.id}
                      </div>
                      <div>
                        Last activity: {formatDate(agreement.lastActivity)}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}