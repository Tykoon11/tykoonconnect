'use client'

import { use, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { AssuranceBadge } from '@/components/assurance-badge'
import { 
  ArrowLeft, 
  Send, 
  Paperclip,
  Star,
  MapPin,
  CheckCircle,
  MessageSquare,
  AlertCircle
} from 'lucide-react'
import Link from 'next/link'
import { notFound } from 'next/navigation'

// Demo job data
const demoJobs = {
  '1': {
    id: '1',
    title: 'E-commerce Website Development',
    description: 'Looking for a full-stack developer to build a modern e-commerce website using React and Node.js.',
    skills: ['React', 'Node.js', 'PostgreSQL', 'Stripe Integration'],
    budgetType: 'fixed',
    budgetAmount: 5000,
    client: {
      name: 'Alice Johnson',
      handle: 'alicej',
      location: 'San Francisco, CA',
      ratingAverage: 4.8,
      ratingCount: 12,
      preferredAssurance: 'MILESTONE_INVOICE' as const,
      bio: 'Startup founder building the next generation of e-commerce tools.'
    }
  },
  '2': {
    id: '2',
    title: 'Brand Identity Design Package',
    description: 'Need a complete brand identity package including logo design, color palette, typography, and brand guidelines.',
    skills: ['Logo Design', 'Brand Identity', 'Adobe Illustrator', 'Figma'],
    budgetType: 'fixed',
    budgetAmount: 2500,
    client: {
      name: 'Bob Wilson',
      handle: 'bobw',
      location: 'Austin, TX',
      ratingAverage: 4.9,
      ratingCount: 24,
      preferredAssurance: 'EXTERNAL_ESCROW' as const,
      bio: 'Marketing agency owner with 8 years of experience.'
    }
  }
}

export default function MessageClientPage({ params }: { params: Promise<{ id: string }> }) {
  const [message, setMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const resolvedParams = use(params)
  const job = demoJobs[resolvedParams.id as keyof typeof demoJobs]

  if (!job) {
    notFound()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!message.trim()) return

    setIsSubmitting(true)
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false)
      setIsSubmitted(true)
    }, 1500)
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="text-center py-8">
            <CheckCircle className="h-16 w-16 mx-auto text-green-600 mb-4" />
            <h2 className="text-2xl font-bold mb-2">Message Sent!</h2>
            <p className="text-gray-600 mb-6">
              Your message has been sent to {job.client.name}. They will be notified and can respond directly.
            </p>
            <div className="space-y-2">
              <Button asChild className="w-full">
                <Link href="/messages">View All Messages</Link>
              </Button>
              <Button variant="outline" asChild className="w-full">
                <Link href={`/jobs/${job.id}`}>Back to Job</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <div className="mb-6">
            <Button variant="outline" asChild>
              <Link href={`/jobs/${job.id}`}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Job Details
              </Link>
            </Button>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Message Form */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Message Client</CardTitle>
                  <CardDescription>
                    Start a conversation about "{job.title}"
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Message */}
                    <div>
                      <Textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Hi! I'm interested in your project and would like to discuss the requirements in more detail. I have experience with similar projects and would love to learn more about your specific needs..."
                        className="min-h-[200px]"
                        required
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        {message.length}/1000 characters
                      </p>
                    </div>

                    {/* Attachments (Future feature) */}
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Paperclip className="h-4 w-4" />
                      <span>File attachments will be available in the full messaging system</span>
                    </div>

                    {/* Submit Button */}
                    <div className="flex gap-3">
                      <Button 
                        type="submit" 
                        className="flex-1" 
                        disabled={isSubmitting || !message.trim()}
                      >
                        {isSubmitting ? (
                          <>
                            <MessageSquare className="mr-2 h-4 w-4 animate-pulse" />
                            Sending...
                          </>
                        ) : (
                          <>
                            <Send className="mr-2 h-4 w-4" />
                            Send Message
                          </>
                        )}
                      </Button>
                      <Button 
                        type="button" 
                        variant="outline"
                        asChild
                      >
                        <Link href={`/jobs/${job.id}/proposal`}>
                          Send Proposal Instead
                        </Link>
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>

              {/* Info Card */}
              <Card className="mt-6">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div className="text-sm">
                      <p className="font-medium text-gray-900 mb-1">Getting Started</p>
                      <p className="text-gray-600 leading-relaxed">
                        This message will start a conversation thread with the client. 
                        Use this opportunity to ask clarifying questions about the project 
                        requirements before submitting a formal proposal.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Job & Client Info Sidebar */}
            <div className="space-y-6">
              {/* Job Overview */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">{job.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    {job.skills.map((skill) => (
                      <Badge key={skill} variant="secondary" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Budget:</span>
                      <span className="font-medium">${job.budgetAmount?.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Type:</span>
                      <span className="font-medium capitalize">{job.budgetType}</span>
                    </div>
                  </div>

                  <p className="text-sm text-gray-700 leading-relaxed line-clamp-3">
                    {job.description}
                  </p>
                </CardContent>
              </Card>

              {/* Client Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">About the Client</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-start space-x-3">
                    <div className="bg-blue-100 text-blue-600 p-2 rounded-full">
                      <MessageSquare className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold">{job.client.name}</h4>
                      <p className="text-gray-600 text-sm">@{job.client.handle}</p>
                      
                      <div className="flex items-center gap-4 mt-2 text-sm">
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-1 text-gray-400" />
                          <span>{job.client.location}</span>
                        </div>
                        <div className="flex items-center">
                          <Star className="h-4 w-4 mr-1 fill-yellow-400 text-yellow-400" />
                          <span>{job.client.ratingAverage} ({job.client.ratingCount})</span>
                        </div>
                      </div>

                      <p className="text-sm text-gray-700 mt-3 leading-relaxed">
                        {job.client.bio}
                      </p>

                      {job.client.preferredAssurance && (
                        <div className="mt-3">
                          <p className="text-xs text-gray-600 mb-1">Preferred Payment:</p>
                          <AssuranceBadge method={job.client.preferredAssurance} compact />
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button variant="outline" className="w-full" asChild>
                    <Link href={`/jobs/${job.id}/proposal`}>
                      <MessageSquare className="mr-2 h-4 w-4" />
                      Submit Proposal
                    </Link>
                  </Button>
                  <Button variant="outline" className="w-full" asChild>
                    <Link href={`/jobs/${job.id}`}>
                      View Full Job Details
                    </Link>
                  </Button>
                  <Button variant="outline" className="w-full" asChild>
                    <Link href="/jobs">
                      Browse More Jobs
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}