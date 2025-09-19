'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Input } from '@/components/ui/input'
import { 
  Send, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  DollarSign,
  Calendar,
  User,
  Briefcase,
  Eye,
  MessageSquare,
  Edit,
  Trash2,
  Search,
  Star,
  ExternalLink,
  FileText,
  Heart
} from 'lucide-react'
import Link from 'next/link'
import { useToast } from '@/components/ui/toast'
import { DEMO_MODE } from '@/lib/prisma'
import { useAuth } from '@/lib/auth/context'

interface Proposal {
  id: string
  jobId: string
  jobTitle: string
  jobDescription: string
  clientId: string
  clientName: string
  clientHandle: string
  cover: string
  price: number
  timelineDays: number
  status: 'sent' | 'shortlisted' | 'withdrawn' | 'accepted' | 'rejected'
  createdAt: string
  updatedAt: string
  
  // Client details
  clientLocation?: string
  clientRating?: number
  
  // Job details
  budgetType: 'hourly' | 'fixed'
  budgetAmount?: number
  skills: string[]
}

export default function ProposalsPage() {
  const { user, isAuthenticated } = useAuth()
  const { addToast } = useToast()
  const [proposals, setProposals] = useState<Proposal[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'sent' | 'shortlisted' | 'accepted' | 'rejected'>('all')
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    const fetchProposals = async () => {
      if (DEMO_MODE) {
        // Demo proposals
        const demoProposals: Proposal[] = [
          {
            id: 'proposal-1',
            jobId: 'job-123',
            jobTitle: 'React Developer for SaaS Platform',
            jobDescription: 'Looking for an experienced React developer to help build our SaaS dashboard with modern UI/UX.',
            clientId: 'client-1',
            clientName: 'TechStart Inc',
            clientHandle: 'techstart',
            cover: 'Hi! I\'m excited about this React project. With 5+ years of React experience and expertise in SaaS platforms, I can deliver a high-quality, scalable solution. I\'ve built similar dashboards for 10+ companies, focusing on performance and user experience. I\'d love to discuss your specific requirements and show you some relevant portfolio pieces.',
            price: 450000, // $4,500
            timelineDays: 30,
            status: 'shortlisted',
            createdAt: '2024-01-20',
            updatedAt: '2024-01-22',
            clientLocation: 'San Francisco, CA',
            clientRating: 4.8,
            budgetType: 'fixed',
            budgetAmount: 500000,
            skills: ['React', 'TypeScript', 'Node.js', 'PostgreSQL']
          },
          {
            id: 'proposal-2',
            jobId: 'job-456',
            jobTitle: 'E-commerce Website Development',
            jobDescription: 'Need a complete e-commerce solution with payment integration, inventory management, and admin dashboard.',
            clientId: 'client-2',
            clientName: 'ShopCorp',
            clientHandle: 'shopcorp',
            cover: 'Hello! Your e-commerce project caught my attention. I specialize in building scalable online stores with React and Node.js. I can handle the complete development including Stripe/PayPal integration, inventory system, and responsive design. My recent e-commerce projects achieved 40% better conversion rates. Let me know if you\'d like to see examples of my work.',
            price: 750000, // $7,500
            timelineDays: 45,
            status: 'sent',
            createdAt: '2024-01-18',
            updatedAt: '2024-01-18',
            clientLocation: 'New York, NY',
            clientRating: 4.6,
            budgetType: 'fixed',
            budgetAmount: 800000,
            skills: ['React', 'Node.js', 'MongoDB', 'Stripe API']
          },
          {
            id: 'proposal-3',
            jobId: 'job-789',
            jobTitle: 'Mobile App Backend API',
            jobDescription: 'Building REST API for mobile application with user authentication, real-time features, and data analytics.',
            clientId: 'client-3',
            clientName: 'MobileFlow',
            clientHandle: 'mobileflow',
            cover: 'Great to see this API project! I have extensive experience building scalable Node.js APIs for mobile apps. I can implement JWT authentication, WebSocket real-time features, and comprehensive analytics. I use MongoDB for flexibility and Redis for caching. I\'ve built APIs serving 100K+ users with 99.9% uptime. Would love to discuss your architecture needs.',
            price: 350000, // $3,500
            timelineDays: 25,
            status: 'accepted',
            createdAt: '2024-01-15',
            updatedAt: '2024-01-16',
            clientLocation: 'Austin, TX',
            clientRating: 4.9,
            budgetType: 'fixed',
            budgetAmount: 400000,
            skills: ['Node.js', 'MongoDB', 'Socket.io', 'JWT']
          },
          {
            id: 'proposal-4',
            jobId: 'job-012',
            jobTitle: 'WordPress Custom Theme',
            jobDescription: 'Custom WordPress theme development with responsive design and SEO optimization.',
            clientId: 'client-4',
            clientName: 'BlogMaster',
            clientHandle: 'blogmaster',
            cover: 'Hi there! I see you need a custom WordPress theme. I\'ve developed 50+ WordPress themes with focus on speed, SEO, and mobile responsiveness. I can create a pixel-perfect design that loads in under 2 seconds and ranks well on Google. All themes include Gutenberg blocks and easy customization options.',
            price: 125000, // $1,250
            timelineDays: 14,
            status: 'rejected',
            createdAt: '2024-01-12',
            updatedAt: '2024-01-14',
            clientLocation: 'Los Angeles, CA',
            clientRating: 4.3,
            budgetType: 'fixed',
            budgetAmount: 150000,
            skills: ['WordPress', 'PHP', 'CSS', 'JavaScript']
          }
        ]
        setProposals(demoProposals)
      } else {
        // Real API call
        try {
          const response = await fetch('/api/proposals')
          if (!response.ok) throw new Error('Failed to fetch proposals')
          const data = await response.json()
          setProposals(data.proposals)
        } catch (error) {
          addToast({
            type: 'error',
            title: 'Error',
            description: 'Failed to load proposals.',
            duration: 5000
          })
        }
      }
      setIsLoading(false)
    }

    if (isAuthenticated) {
      fetchProposals()
    } else {
      setIsLoading(false)
    }
  }, [isAuthenticated, addToast])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'sent':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400'
      case 'shortlisted':
        return 'bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400'
      case 'accepted':
        return 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400'
      case 'rejected':
        return 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400'
      case 'withdrawn':
        return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'sent':
        return Send
      case 'shortlisted':
        return Star
      case 'accepted':
        return CheckCircle
      case 'rejected':
        return AlertTriangle
      case 'withdrawn':
        return Clock
      default:
        return Send
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

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInMs = now.getTime() - date.getTime()
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24))

    if (diffInDays === 0) return 'Today'
    if (diffInDays === 1) return 'Yesterday'
    if (diffInDays < 7) return `${diffInDays} days ago`
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`
    return formatDate(dateString)
  }

  const handleWithdrawProposal = async (proposalId: string) => {
    if (DEMO_MODE) {
      setProposals(proposals.map(p => 
        p.id === proposalId ? { ...p, status: 'withdrawn' as const } : p
      ))
      addToast({
        type: 'success',
        title: 'Proposal Withdrawn',
        description: 'Your proposal has been withdrawn.',
        duration: 3000
      })
    } else {
      try {
        const response = await fetch(`/api/proposals/${proposalId}/withdraw`, {
          method: 'PATCH'
        })
        if (!response.ok) throw new Error('Failed to withdraw proposal')
        
        setProposals(proposals.map(p => 
          p.id === proposalId ? { ...p, status: 'withdrawn' as const } : p
        ))
        
        addToast({
          type: 'success',
          title: 'Proposal Withdrawn',
          description: 'Your proposal has been withdrawn successfully.',
          duration: 3000
        })
      } catch (error) {
        addToast({
          type: 'error',
          title: 'Error',
          description: 'Failed to withdraw proposal.',
          duration: 5000
        })
      }
    }
  }

  const filteredProposals = proposals
    .filter(proposal => {
      if (filter === 'all') return true
      return proposal.status === filter
    })
    .filter(proposal => {
      if (!searchQuery) return true
      const query = searchQuery.toLowerCase()
      return (
        proposal.jobTitle.toLowerCase().includes(query) ||
        proposal.clientName.toLowerCase().includes(query) ||
        proposal.cover.toLowerCase().includes(query)
      )
    })

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900 flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader className="text-center">
            <Send className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <CardTitle>Sign In Required</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-gray-600 dark:text-slate-400 mb-4">
              Please sign in to view your proposals.
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
              <Send className="h-8 w-8 text-blue-600" />
              My Proposals
            </h1>
            <p className="text-gray-600 dark:text-slate-400 mt-2">
              Track your job proposals and their status.
            </p>
          </div>
          
          <Button asChild className="gap-2">
            <Link href="/jobs">
              <Search className="h-4 w-4" />
              Browse Jobs
            </Link>
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[
            { 
              label: 'Total Sent', 
              value: proposals.length,
              icon: Send,
              color: 'text-blue-600 bg-blue-100 dark:bg-blue-900/20'
            },
            { 
              label: 'Shortlisted', 
              value: proposals.filter(p => p.status === 'shortlisted').length,
              icon: Star,
              color: 'text-purple-600 bg-purple-100 dark:bg-purple-900/20'
            },
            { 
              label: 'Accepted', 
              value: proposals.filter(p => p.status === 'accepted').length,
              icon: CheckCircle,
              color: 'text-green-600 bg-green-100 dark:bg-green-900/20'
            },
            { 
              label: 'Success Rate', 
              value: proposals.length > 0 ? Math.round((proposals.filter(p => p.status === 'accepted').length / proposals.length) * 100) + '%' : '0%',
              icon: Heart,
              color: 'text-red-600 bg-red-100 dark:bg-red-900/20'
            }
          ].map((stat, index) => {
            const Icon = stat.icon
            return (
              <Card key={index}>
                <CardContent className="p-6 text-center">
                  <div className={`inline-flex p-3 rounded-full ${stat.color} mb-3`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-slate-100 mb-1">
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-slate-400">
                    {stat.label}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Filters and Search */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search proposals..."
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
                  All ({proposals.length})
                </Button>
                <Button
                  variant={filter === 'sent' ? 'default' : 'outline'}
                  onClick={() => setFilter('sent')}
                  size="sm"
                >
                  Sent ({proposals.filter(p => p.status === 'sent').length})
                </Button>
                <Button
                  variant={filter === 'shortlisted' ? 'default' : 'outline'}
                  onClick={() => setFilter('shortlisted')}
                  size="sm"
                >
                  Shortlisted ({proposals.filter(p => p.status === 'shortlisted').length})
                </Button>
                <Button
                  variant={filter === 'accepted' ? 'default' : 'outline'}
                  onClick={() => setFilter('accepted')}
                  size="sm"
                >
                  Accepted ({proposals.filter(p => p.status === 'accepted').length})
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Proposals List */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-slate-400">Loading proposals...</p>
          </div>
        ) : filteredProposals.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Send className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-100 mb-2">
                No Proposals Found
              </h3>
              <p className="text-gray-600 dark:text-slate-400 mb-4">
                {searchQuery 
                  ? 'No proposals match your search.' 
                  : 'You haven\'t sent any proposals yet.'}
              </p>
              {!searchQuery && (
                <Button asChild>
                  <Link href="/jobs">Browse Jobs to Apply</Link>
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {filteredProposals.map((proposal) => {
              const StatusIcon = getStatusIcon(proposal.status)
              
              return (
                <Card key={proposal.id} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-start gap-4">
                          {/* Status Icon */}
                          <div className={`p-3 rounded-xl ${getStatusColor(proposal.status)}`}>
                            <StatusIcon className="h-6 w-6" />
                          </div>
                          
                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-3">
                              <div>
                                <h3 className="text-xl font-semibold text-gray-900 dark:text-slate-100 mb-2">
                                  {proposal.jobTitle}
                                </h3>
                                
                                <div className="flex items-center gap-4 mb-2">
                                  <div className="flex items-center text-gray-600 dark:text-slate-400">
                                    <User className="h-4 w-4 mr-1" />
                                    {proposal.clientName}
                                  </div>
                                  {proposal.clientLocation && (
                                    <div className="text-gray-600 dark:text-slate-400">
                                      📍 {proposal.clientLocation}
                                    </div>
                                  )}
                                  {proposal.clientRating && (
                                    <div className="flex items-center text-yellow-600">
                                      <Star className="h-4 w-4 mr-1 fill-current" />
                                      {proposal.clientRating}
                                    </div>
                                  )}
                                </div>
                                
                                <Badge className={getStatusColor(proposal.status)}>
                                  {proposal.status.charAt(0).toUpperCase() + proposal.status.slice(1)}
                                </Badge>
                              </div>
                              
                              <div className="text-right">
                                <div className="text-2xl font-bold text-gray-900 dark:text-slate-100">
                                  {formatAmount(proposal.price)}
                                </div>
                                <div className="text-sm text-gray-600 dark:text-slate-400">
                                  {proposal.timelineDays} days
                                </div>
                              </div>
                            </div>
                            
                            <p className="text-gray-600 dark:text-slate-400 mb-4 leading-relaxed">
                              {proposal.cover.length > 200 
                                ? proposal.cover.substring(0, 200) + '...'
                                : proposal.cover
                              }
                            </p>
                            
                            {/* Skills */}
                            <div className="flex flex-wrap gap-2 mb-4">
                              {proposal.skills.map((skill) => (
                                <Badge key={skill} variant="outline" className="text-xs">
                                  {skill}
                                </Badge>
                              ))}
                            </div>
                            
                            {/* Budget comparison */}
                            {proposal.budgetAmount && (
                              <div className="text-sm text-gray-600 dark:text-slate-400 mb-4">
                                Client budget: {formatAmount(proposal.budgetAmount)} ({proposal.budgetType})
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Actions */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <Button 
                          asChild 
                          variant="outline" 
                          size="sm"
                          className="gap-2"
                        >
                          <Link href={`/jobs/${proposal.jobId}`}>
                            <Eye className="h-4 w-4" />
                            View Job
                          </Link>
                        </Button>
                        
                        <Button 
                          asChild 
                          variant="outline" 
                          size="sm"
                          className="gap-2"
                        >
                          <Link href={`/messages?recipient=${proposal.clientHandle}`}>
                            <MessageSquare className="h-4 w-4" />
                            Message Client
                          </Link>
                        </Button>
                        
                        {proposal.status === 'sent' && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleWithdrawProposal(proposal.id)}
                            className="gap-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                          >
                            <Trash2 className="h-4 w-4" />
                            Withdraw
                          </Button>
                        )}
                      </div>
                      
                      <div className="text-sm text-gray-500 dark:text-slate-500">
                        Sent {formatTimeAgo(proposal.createdAt)}
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