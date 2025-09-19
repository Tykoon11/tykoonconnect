'use client'

import { use, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { AssuranceBadge } from '@/components/assurance-badge'
import { 
  ArrowLeft, 
  Users, 
  MessageSquare, 
  Star, 
  Edit, 
  Eye, 
  Calendar,
  DollarSign,
  MapPin,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react'
import Link from 'next/link'
import { notFound } from 'next/navigation'

// Demo job data with proposals
const demoJobs = {
  '1': {
    id: '1',
    title: 'E-commerce Website Development',
    description: 'Looking for a full-stack developer to build a modern e-commerce website using React and Node.js. The site needs to handle payments, inventory management, and user accounts.',
    skills: ['React', 'Node.js', 'PostgreSQL', 'Stripe Integration', 'TypeScript', 'Tailwind CSS'],
    budgetType: 'fixed',
    budgetAmount: 5000,
    status: 'open',
    assuranceHint: 'MILESTONE_INVOICE' as const,
    createdAt: new Date('2024-09-10'),
    client: {
      name: 'Alice Johnson',
      handle: 'alicej'
    },
    proposals: [
      {
        id: '1',
        freelancer: {
          name: 'John Smith',
          handle: 'johnsmith',
          location: 'San Francisco, CA',
          ratingAverage: 4.9,
          ratingCount: 48,
          avatar: null
        },
        cover: 'I have 5 years of experience building e-commerce websites with React and Node.js. I can deliver this project in 6 weeks with milestone-based payments.',
        price: 4800,
        timelineDays: 42,
        status: 'sent',
        createdAt: new Date('2024-09-11T10:30:00'),
        attachments: []
      },
      {
        id: '2',
        freelancer: {
          name: 'Sarah Wilson',
          handle: 'sarahwilson',
          location: 'New York, NY',
          ratingAverage: 4.8,
          ratingCount: 32,
          avatar: null
        },
        cover: 'Hi! I specialize in modern e-commerce solutions. I can build your site with React, Node.js, and integrate Stripe payments. My approach includes responsive design and SEO optimization.',
        price: 5200,
        timelineDays: 35,
        status: 'shortlisted',
        createdAt: new Date('2024-09-11T14:15:00'),
        attachments: []
      },
      {
        id: '3',
        freelancer: {
          name: 'Mike Chen',
          handle: 'mikechen',
          location: 'Austin, TX',
          ratingAverage: 4.7,
          ratingCount: 29,
          avatar: null
        },
        cover: 'Experienced full-stack developer with expertise in e-commerce platforms. I can deliver a scalable solution with all requested features.',
        price: 4500,
        timelineDays: 49,
        status: 'sent',
        createdAt: new Date('2024-09-12T09:20:00'),
        attachments: []
      }
    ]
  },
  '2': {
    id: '2',
    title: 'Brand Identity Design Package',
    description: 'Need a complete brand identity package including logo design, color palette, typography, and brand guidelines for a tech startup.',
    skills: ['Logo Design', 'Brand Identity', 'Adobe Illustrator', 'Figma', 'Typography'],
    budgetType: 'fixed',
    budgetAmount: 2500,
    status: 'open',
    assuranceHint: 'EXTERNAL_ESCROW' as const,
    createdAt: new Date('2024-09-11'),
    client: {
      name: 'Bob Wilson',
      handle: 'bobw'
    },
    proposals: [
      {
        id: '4',
        freelancer: {
          name: 'Lisa Davis',
          handle: 'lisadavis',
          location: 'Los Angeles, CA',
          ratingAverage: 4.9,
          ratingCount: 67,
          avatar: null
        },
        cover: 'I am a brand designer with 8 years of experience creating identities for tech companies. I can provide a complete package with multiple logo concepts and comprehensive guidelines.',
        price: 2800,
        timelineDays: 21,
        status: 'sent',
        createdAt: new Date('2024-09-12T11:45:00'),
        attachments: []
      },
      {
        id: '5',
        freelancer: {
          name: 'Alex Rodriguez',
          handle: 'alexrodriguez',
          location: 'Chicago, IL',
          ratingAverage: 4.6,
          ratingCount: 23,
          avatar: null
        },
        cover: 'Creative designer specializing in modern brand identities. I understand the importance of a strong brand for startups and can deliver designs that resonate with your target audience.',
        price: 2300,
        timelineDays: 28,
        status: 'sent',
        createdAt: new Date('2024-09-12T16:30:00'),
        attachments: []
      }
    ]
  }
}

export default function JobManagementPage({ params }: { params: Promise<{ id: string }> }) {
  const [activeTab, setActiveTab] = useState('proposals')
  const resolvedParams = use(params)
  const job = demoJobs[resolvedParams.id as keyof typeof demoJobs]

  if (!job) {
    notFound()
  }

  const proposalStats = {
    total: job.proposals.length,
    shortlisted: job.proposals.filter(p => p.status === 'shortlisted').length,
    sent: job.proposals.filter(p => p.status === 'sent').length
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Back Button */}
          <div className="mb-6">
            <Button variant="outline" asChild>
              <Link href="/dashboard">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Dashboard
              </Link>
            </Button>
          </div>

          {/* Job Header */}
          <Card className="mb-8">
            <CardHeader>
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <CardTitle className="text-2xl">{job.title}</CardTitle>
                    <Badge variant={job.status === 'open' ? 'default' : 'secondary'}>
                      {job.status === 'open' ? 'Open' : 'Closed'}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      Posted {job.createdAt.toLocaleDateString()}
                    </div>
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-1" />
                      {job.proposals.length} proposals
                    </div>
                    <div className="flex items-center">
                      <DollarSign className="h-4 w-4 mr-1" />
                      ${job.budgetAmount?.toLocaleString()} {job.budgetType}
                    </div>
                  </div>
                  <p className="text-gray-700 leading-relaxed">{job.description}</p>
                </div>
                <div className="flex flex-col sm:flex-row lg:flex-col gap-2">
                  <Button variant="outline" asChild>
                    <Link href={`/jobs/${job.id}`}>
                      <Eye className="mr-2 h-4 w-4" />
                      View Public
                    </Link>
                  </Button>
                  <Button variant="outline">
                    <Edit className="mr-2 h-4 w-4" />
                    Edit Job
                  </Button>
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Management Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="proposals" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Proposals ({proposalStats.total})
              </TabsTrigger>
              <TabsTrigger value="messages" className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                Messages
              </TabsTrigger>
              <TabsTrigger value="activity" className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Activity
              </TabsTrigger>
            </TabsList>

            {/* Proposals Tab */}
            <TabsContent value="proposals" className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold">Proposals Received</h3>
                  <p className="text-gray-600 text-sm">
                    {proposalStats.shortlisted} shortlisted • {proposalStats.sent} pending review
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">Filter</Button>
                  <Button variant="outline" size="sm">Sort</Button>
                </div>
              </div>

              <div className="space-y-4">
                {job.proposals.map((proposal) => (
                  <Card key={proposal.id} className="hover:shadow-md transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-4">
                          <div className="bg-blue-100 text-blue-600 p-3 rounded-full">
                            <Users className="h-6 w-6" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-1">
                              <h4 className="font-semibold text-lg">{proposal.freelancer.name}</h4>
                              <Badge variant={proposal.status === 'shortlisted' ? 'default' : 'secondary'}>
                                {proposal.status === 'shortlisted' ? 'Shortlisted' : 'New'}
                              </Badge>
                            </div>
                            <p className="text-gray-600 text-sm">@{proposal.freelancer.handle}</p>
                            <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                              <div className="flex items-center">
                                <MapPin className="h-4 w-4 mr-1" />
                                {proposal.freelancer.location}
                              </div>
                              <div className="flex items-center">
                                <Star className="h-4 w-4 mr-1 fill-yellow-400 text-yellow-400" />
                                {proposal.freelancer.ratingAverage} ({proposal.freelancer.ratingCount} reviews)
                              </div>
                              <div className="flex items-center">
                                <Calendar className="h-4 w-4 mr-1" />
                                {proposal.timelineDays} days
                              </div>
                              <div className="flex items-center font-semibold text-green-600">
                                <DollarSign className="h-4 w-4 mr-1" />
                                ${proposal.price?.toLocaleString()}
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="text-xs text-gray-500">
                          {proposal.createdAt.toLocaleDateString()} {proposal.createdAt.toLocaleTimeString()}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-700 mb-4 leading-relaxed">{proposal.cover}</p>
                      <div className="flex flex-wrap gap-2">
                        <Button size="sm">
                          <MessageSquare className="mr-2 h-4 w-4" />
                          Message
                        </Button>
                        {proposal.status !== 'shortlisted' && (
                          <Button variant="outline" size="sm">
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Shortlist
                          </Button>
                        )}
                        <Button variant="outline" size="sm">
                          View Profile
                        </Button>
                        <Button variant="outline" size="sm">
                          <XCircle className="mr-2 h-4 w-4" />
                          Decline
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Messages Tab */}
            <TabsContent value="messages">
              <Card>
                <CardContent className="text-center py-12">
                  <MessageSquare className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No messages yet</h3>
                  <p className="text-gray-600">Start a conversation with freelancers by messaging them directly from their proposals.</p>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Activity Tab */}
            <TabsContent value="activity">
              <Card>
                <CardContent className="py-6">
                  <div className="space-y-4">
                    <div className="flex items-start space-x-4">
                      <div className="bg-blue-100 p-2 rounded-full">
                        <AlertCircle className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium">Job posted</p>
                        <p className="text-sm text-gray-600">
                          You posted "{job.title}" on {job.createdAt.toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    
                    {job.proposals.map((proposal, index) => (
                      <div key={proposal.id} className="flex items-start space-x-4">
                        <div className="bg-green-100 p-2 rounded-full">
                          <Users className="h-4 w-4 text-green-600" />
                        </div>
                        <div>
                          <p className="font-medium">New proposal received</p>
                          <p className="text-sm text-gray-600">
                            {proposal.freelancer.name} submitted a proposal for ${proposal.price?.toLocaleString()} 
                            on {proposal.createdAt.toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}