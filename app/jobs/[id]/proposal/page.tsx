'use client'

import { use, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { AssuranceBadge } from '@/components/assurance-badge'
import { EnhancedInput, EnhancedTextarea, FileUpload } from '@/components/ui/enhanced-form'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { useToast } from '@/components/ui/toast'
import { 
  ArrowLeft, 
  DollarSign, 
  Calendar, 
  FileText, 
  Upload,
  AlertCircle,
  CheckCircle,
  MessageSquare,
  Star,
  MapPin
} from 'lucide-react'
import Link from 'next/link'
import { notFound } from 'next/navigation'

// Demo job data
const demoJobs = {
  '1': {
    id: '1',
    title: 'E-commerce Website Development',
    description: 'Looking for a full-stack developer to build a modern e-commerce website using React and Node.js.',
    skills: ['React', 'Node.js', 'PostgreSQL', 'Stripe Integration', 'TypeScript', 'Tailwind CSS'],
    budgetType: 'fixed',
    budgetAmount: 5000,
    assuranceHint: 'MILESTONE_INVOICE' as const,
    client: {
      name: 'Alice Johnson',
      handle: 'alicej',
      location: 'San Francisco, CA',
      ratingAverage: 4.8,
      ratingCount: 12,
      preferredAssurance: 'MILESTONE_INVOICE' as const,
      alsoAccepts: ['EXTERNAL_ESCROW' as const]
    }
  },
  '2': {
    id: '2',
    title: 'Brand Identity Design Package',
    description: 'Need a complete brand identity package including logo design, color palette, typography, and brand guidelines for a tech startup.',
    skills: ['Logo Design', 'Brand Identity', 'Adobe Illustrator', 'Figma', 'Typography'],
    budgetType: 'fixed',
    budgetAmount: 2500,
    assuranceHint: 'EXTERNAL_ESCROW' as const,
    client: {
      name: 'Bob Wilson',
      handle: 'bobw',
      location: 'Austin, TX',
      ratingAverage: 4.9,
      ratingCount: 24,
      preferredAssurance: 'EXTERNAL_ESCROW' as const,
      alsoAccepts: ['CARD_HOLD' as const, 'MILESTONE_INVOICE' as const]
    }
  }
}

export default function ProposalPage({ params }: { params: Promise<{ id: string }> }) {
  const [cover, setCover] = useState('')
  const [proposedPrice, setProposedPrice] = useState('')
  const [timeline, setTimeline] = useState('')
  const [timelineUnit, setTimelineUnit] = useState('days')
  const [attachments, setAttachments] = useState<File[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const { addToast } = useToast()

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    
    if (!cover.trim()) {
      newErrors.cover = 'Cover letter is required'
    } else if (cover.trim().length < 50) {
      newErrors.cover = 'Cover letter should be at least 50 characters'
    } else if (cover.trim().length > 2000) {
      newErrors.cover = 'Cover letter should not exceed 2000 characters'
    }
    
    if (!proposedPrice.trim()) {
      newErrors.proposedPrice = 'Proposed price is required'
    } else if (isNaN(Number(proposedPrice)) || Number(proposedPrice) <= 0) {
      newErrors.proposedPrice = 'Please enter a valid price'
    }
    
    if (!timeline.trim()) {
      newErrors.timeline = 'Timeline is required'
    } else if (isNaN(Number(timeline)) || Number(timeline) <= 0) {
      newErrors.timeline = 'Please enter a valid timeline'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const resolvedParams = use(params)
  const job = demoJobs[resolvedParams.id as keyof typeof demoJobs]

  if (!job) {
    notFound()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      addToast({
        type: 'error',
        title: 'Validation Error',
        description: 'Please fix the errors in the form'
      })
      return
    }
    
    setIsSubmitting(true)
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      addToast({
        type: 'success',
        title: 'Proposal Sent!',
        description: `Your proposal has been sent to ${job.client.name}`
      })
      
      setIsSubmitted(true)
    } catch (error) {
      addToast({
        type: 'error',
        title: 'Failed to Send',
        description: 'Please try again later'
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    setAttachments(prev => [...prev, ...files])
  }

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index))
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="text-center py-8">
            <CheckCircle className="h-16 w-16 mx-auto text-green-600 mb-4" />
            <h2 className="text-2xl font-bold mb-2">Proposal Sent!</h2>
            <p className="text-gray-600 mb-6">
              Your proposal has been sent to {job.client.name}. They will be notified and can respond directly.
            </p>
            <div className="space-y-2">
              <Button asChild className="w-full">
                <Link href="/jobs">Browse More Jobs</Link>
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
            {/* Proposal Form */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Send Proposal</CardTitle>
                  <CardDescription>
                    Submit your proposal for "{job.title}"
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Cover Letter */}
                    <EnhancedTextarea
                      label="Cover Letter"
                      value={cover}
                      onChange={(e) => setCover(e.target.value)}
                      placeholder="Describe your experience, approach, and why you're the best fit for this project..."
                      className="min-h-[200px]"
                      maxLength={2000}
                      showCharCount={true}
                      required
                      error={errors.cover}
                      helperText="Tell the client why you're perfect for this job. Include relevant experience and your approach."
                    />

                    {/* Pricing */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <EnhancedInput
                          label="Your Proposed Price"
                          type="number"
                          value={proposedPrice}
                          onChange={(e) => setProposedPrice(e.target.value)}
                          placeholder="2500"
                          required
                          error={errors.proposedPrice}
                          helperText={job.budgetAmount ? `Client budget: $${job.budgetAmount.toLocaleString()}` : undefined}
                        />
                      </div>

                      <div>
                        <Label htmlFor="timeline" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Delivery Timeline *
                        </Label>
                        <div className="flex gap-2 mt-2">
                          <EnhancedInput
                            id="timeline"
                            type="number"
                            value={timeline}
                            onChange={(e) => setTimeline(e.target.value)}
                            placeholder="30"
                            className="flex-1"
                            required
                            error={errors.timeline}
                          />
                          <Select value={timelineUnit} onValueChange={setTimelineUnit}>
                            <SelectTrigger className="w-24">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="days">Days</SelectItem>
                              <SelectItem value="weeks">Weeks</SelectItem>
                              <SelectItem value="months">Months</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>

                    {/* Enhanced File Upload */}
                    <FileUpload
                      label="Portfolio Attachments"
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                      multiple={true}
                      maxSize={10}
                      onFilesChange={setAttachments}
                      helperText="Upload relevant work samples or portfolio pieces"
                    />

                    {/* Submit Button */}
                    <div className="pt-4">
                      <Button 
                        type="submit" 
                        className="w-full" 
                        size="lg"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <>
                            <LoadingSpinner size="sm" className="mr-2" />
                            Sending Proposal...
                          </>
                        ) : (
                          <>
                            <FileText className="mr-2 h-4 w-4" />
                            Send Proposal
                          </>
                        )}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Job Summary Sidebar */}
            <div className="space-y-6">
              {/* Job Overview */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">{job.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    {job.skills.slice(0, 4).map((skill) => (
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

                  {job.assuranceHint && (
                    <div>
                      <span className="text-gray-600 text-sm">Preferred Payment:</span>
                      <div className="mt-1">
                        <AssuranceBadge method={job.assuranceHint} compact />
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Client Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">About the Client</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <h4 className="font-semibold">{job.client.name}</h4>
                      <p className="text-gray-600 text-sm">@{job.client.handle}</p>
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-1 text-gray-400" />
                        <span>{job.client.location}</span>
                      </div>
                    </div>

                    <div className="flex items-center">
                      <Star className="h-4 w-4 mr-1 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm">
                        {job.client.ratingAverage} ({job.client.ratingCount} reviews)
                      </span>
                    </div>

                    <div className="pt-2">
                      <p className="text-sm text-gray-600 mb-2">Payment Preferences:</p>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs">Prefers:</span>
                          <AssuranceBadge method={job.client.preferredAssurance} compact />
                        </div>
                        {job.client.alsoAccepts.length > 0 && (
                          <div className="flex items-center gap-2">
                            <span className="text-xs">Also accepts:</span>
                            {job.client.alsoAccepts.map((method) => (
                              <AssuranceBadge key={method} method={method} compact />
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Tips */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <AlertCircle className="mr-2 h-5 w-5 text-blue-600" />
                    Proposal Tips
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• Be specific about your approach</li>
                    <li>• Include relevant work samples</li>
                    <li>• Ask clarifying questions</li>
                    <li>• Explain your pricing breakdown</li>
                    <li>• Show enthusiasm for the project</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}