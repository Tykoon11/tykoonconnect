import { use } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { AssuranceBadge } from '@/components/assurance-badge'
import { MapPin, Clock, DollarSign, Users, ArrowLeft, MessageSquare, Star } from 'lucide-react'
import Link from 'next/link'
import { notFound } from 'next/navigation'

// Demo job data
const demoJobs = {
  '1': {
    id: '1',
    title: 'E-commerce Website Development',
    description: `Looking for a full-stack developer to build a modern e-commerce website using React and Node.js. 

The project includes:
- Responsive front-end design
- User authentication and profiles
- Product catalog with search and filtering
- Shopping cart and checkout process
- Payment integration with Stripe
- Admin dashboard for inventory management
- Mobile-first responsive design

Timeline: 6-8 weeks
Budget: $5,000 fixed price

Requirements:
- 3+ years of React experience
- Node.js and Express knowledge
- PostgreSQL database experience
- Stripe payment integration
- Git version control
- Good communication in English

The ideal candidate will be able to start immediately and work EST timezone hours for better collaboration.`,
    skills: ['React', 'Node.js', 'PostgreSQL', 'Stripe Integration', 'TypeScript', 'Tailwind CSS'],
    budgetType: 'fixed',
    budgetAmount: 5000,
    positionsTotal: 2,
    positionsFilled: 0,
    assuranceHint: 'MILESTONE_INVOICE' as const,
    createdAt: new Date('2024-09-10'),
    status: 'open',
    client: {
      name: 'Alice Johnson',
      handle: 'alicej',
      location: 'San Francisco, CA',
      ratingAverage: 4.8,
      ratingCount: 12,
      preferredAssurance: 'MILESTONE_INVOICE' as const,
      alsoAccepts: ['EXTERNAL_ESCROW' as const],
      bio: 'Startup founder building the next generation of e-commerce tools. I value quality work and clear communication.',
      joinedDate: '2023-01-15'
    },
    interests: 8,
    attachments: []
  },
  '2': {
    id: '2',
    title: 'Brand Identity Design Package',
    description: `Looking for a talented designer to create a complete brand identity package for our tech startup.

Deliverables include:
- Logo design (primary and variations)
- Color palette and typography guidelines
- Business card design
- Letterhead template
- Brand guidelines document
- Social media templates
- Website favicon

We're a B2B SaaS company focused on productivity tools. Our target audience is professionals and small businesses. We want a modern, trustworthy, and approachable brand that stands out in the competitive SaaS market.

Timeline: 3-4 weeks
Budget: $2,500 fixed price

Please include:
- Portfolio of recent brand work
- Your design process
- Timeline breakdown
- Number of revision rounds included`,
    skills: ['Logo Design', 'Brand Identity', 'Adobe Illustrator', 'Figma', 'Typography'],
    budgetType: 'fixed',
    budgetAmount: 2500,
    positionsTotal: 1,
    positionsFilled: 0,
    assuranceHint: 'EXTERNAL_ESCROW' as const,
    createdAt: new Date('2024-09-11'),
    status: 'open',
    client: {
      name: 'Bob Wilson',
      handle: 'bobw',
      location: 'Austin, TX',
      ratingAverage: 4.9,
      ratingCount: 24,
      preferredAssurance: 'EXTERNAL_ESCROW' as const,
      alsoAccepts: ['CARD_HOLD' as const, 'MILESTONE_INVOICE' as const],
      bio: 'Marketing agency owner with 8 years of experience. I work with clients to build memorable brands.',
      joinedDate: '2022-06-10'
    },
    interests: 3,
    attachments: []
  },
  '3': {
    id: '3',
    title: 'Mobile App UI/UX Design',
    description: `Design the user interface and user experience for our fitness tracking mobile app.

Project scope:
- User research and persona development
- Wireframes for key user flows
- High-fidelity mockups for iOS and Android
- Interactive prototypes
- Design system and component library
- Handoff documentation for developers

App features:
- Workout tracking and logging
- Progress charts and analytics
- Social features (friend challenges)
- Meal tracking integration
- Custom workout creation
- Achievement system

Timeline: 4-6 weeks
Budget: $3,500 fixed price

Looking for:
- Strong portfolio of mobile app designs
- Experience with fitness/health apps (preferred)
- Figma proficiency
- Understanding of iOS and Android design guidelines
- User research experience`,
    skills: ['Mobile Design', 'UI/UX', 'Figma', 'Prototyping', 'User Research'],
    budgetType: 'fixed',
    budgetAmount: 3500,
    positionsTotal: 1,
    positionsFilled: 0,
    assuranceHint: 'CARD_HOLD' as const,
    createdAt: new Date('2024-09-09'),
    status: 'open',
    client: {
      name: 'Carol Davis',
      handle: 'carold',
      location: 'New York, NY',
      ratingAverage: 4.7,
      ratingCount: 15,
      preferredAssurance: 'CARD_HOLD' as const,
      alsoAccepts: ['MILESTONE_INVOICE' as const],
      bio: 'Product manager at a health tech company. I believe great design drives user engagement.',
      joinedDate: '2023-03-22'
    },
    interests: 12,
    attachments: []
  }
}

export default function JobDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const job = demoJobs[resolvedParams.id as keyof typeof demoJobs]

  if (!job) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Back Button */}
          <div className="mb-6">
            <Button variant="outline" asChild>
              <Link href="/jobs">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Jobs
              </Link>
            </Button>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Job Header */}
              <Card>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-2xl mb-2">{job.title}</CardTitle>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          Posted {job.createdAt.toLocaleDateString()}
                        </div>
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-1" />
                          {job.client.location}
                        </div>
                        {job.positionsTotal && (
                          <div className="flex items-center">
                            <Users className="h-4 w-4 mr-1" />
                            {job.positionsFilled || 0}/{job.positionsTotal} positions filled
                          </div>
                        )}
                        <div className="flex items-center">
                          <Users className="h-4 w-4 mr-1" />
                          {job.interests} interested
                        </div>
                      </div>
                    </div>
                    <Badge variant={job.status === 'open' ? 'default' : 'secondary'}>
                      {job.status === 'open' ? 'Open' : 'Closed'}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {job.skills.map((skill) => (
                      <Badge key={skill} variant="secondary">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                  
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center text-lg font-semibold">
                      <DollarSign className="h-5 w-5 mr-1 text-green-600" />
                      {job.budgetType === 'fixed' ? 'Fixed:' : 'Hourly:'} 
                      ${job.budgetAmount?.toLocaleString()}
                    </div>
                    
                    {job.assuranceHint && (
                      <AssuranceBadge method={job.assuranceHint} />
                    )}
                  </div>

                  <div className="prose max-w-none">
                    {job.description.split('\n\n').map((paragraph, index) => (
                      <p key={index} className="mb-4">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Client Information */}
              <Card>
                <CardHeader>
                  <CardTitle>About the Client</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-start space-x-4">
                    <div className="bg-blue-100 text-blue-600 p-3 rounded-full">
                      <Users className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{job.client.name}</h3>
                      <p className="text-gray-600">@{job.client.handle}</p>
                      <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-1" />
                          {job.client.location}
                        </div>
                        <div className="flex items-center">
                          <Star className="h-4 w-4 mr-1 fill-yellow-400 text-yellow-400" />
                          {job.client.ratingAverage} ({job.client.ratingCount} reviews)
                        </div>
                        <div>
                          Member since {new Date(job.client.joinedDate).toLocaleDateString()}
                        </div>
                      </div>
                      <p className="mt-3 text-gray-700">{job.client.bio}</p>
                      
                      <div className="mt-4">
                        <h4 className="font-medium mb-2">Payment Preferences</h4>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-600">Prefers:</span>
                          <AssuranceBadge method={job.client.preferredAssurance} compact />
                          {job.client.alsoAccepts.length > 0 && (
                            <>
                              <span className="text-sm text-gray-600">Also accepts:</span>
                              {job.client.alsoAccepts.map((method) => (
                                <AssuranceBadge key={method} method={method} compact />
                              ))}
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Apply Card */}
              <Card>
                <CardHeader>
                  <CardTitle>Show Interest</CardTitle>
                  <CardDescription>
                    Express interest in this job{job.positionsTotal > 1 ? ` (${job.positionsTotal - (job.positionsFilled || 0)} positions available)` : ''}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {(job.positionsFilled || 0) >= job.positionsTotal ? (
                    <Button className="w-full" size="lg" disabled>
                      All Positions Filled
                    </Button>
                  ) : (
                    <Button className="w-full" size="lg" asChild>
                      <Link href={`/jobs/${job.id}/interest`}>
                        <MessageSquare className="mr-2 h-4 w-4" />
                        Show Interest
                      </Link>
                    </Button>
                  )}
                  <Button variant="outline" className="w-full" asChild>
                    <Link href={`/jobs/${job.id}/message`}>
                      Message Client
                    </Link>
                  </Button>
                  <p className="text-xs text-gray-500 text-center">
                    Click buttons to access proposal and messaging forms
                  </p>
                </CardContent>
              </Card>

              {/* Project Stats */}
              <Card>
                <CardHeader>
                  <CardTitle>Project Stats</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {job.positionsTotal && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Positions</span>
                      <span className="font-medium">{job.positionsFilled || 0}/{job.positionsTotal}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-gray-600">Interested</span>
                    <span className="font-medium">{job.interests}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Budget</span>
                    <span className="font-medium">${job.budgetAmount?.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Type</span>
                    <span className="font-medium capitalize">{job.budgetType} Price</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Posted</span>
                    <span className="font-medium">{job.createdAt.toLocaleDateString()}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Similar Jobs */}
              <Card>
                <CardHeader>
                  <CardTitle>Similar Jobs</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {Object.values(demoJobs)
                    .filter(j => j.id !== job.id)
                    .slice(0, 2)
                    .map((similarJob) => (
                      <Link key={similarJob.id} href={`/jobs/${similarJob.id}`}>
                        <div className="p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                          <h4 className="font-medium text-sm mb-1">{similarJob.title}</h4>
                          <div className="flex items-center justify-between text-xs text-gray-600">
                            <span>${similarJob.budgetAmount?.toLocaleString()}</span>
                            <span>{similarJob.interests} interested</span>
                          </div>
                        </div>
                      </Link>
                    ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}