'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { 
  User, 
  MapPin, 
  Globe, 
  Star, 
  MessageSquare, 
  Calendar,
  Award,
  Briefcase,
  Shield,
  ExternalLink,
  Mail,
  Users,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertTriangle
} from 'lucide-react'
import Link from 'next/link'
import { useToast } from '@/components/ui/toast'
import { DEMO_MODE } from '@/lib/prisma'
import { useAuth } from '@/lib/auth/context'

interface UserProfile {
  id: string
  handle: string
  name: string
  email: string
  bio: string
  location: string
  website: string
  avatarUrl?: string
  skills: string[]
  languages: string[]
  roleClient: boolean
  roleFreelancer: boolean
  preferredAssurance: string
  alsoAccepts: string[]
  ratingAverage: number
  ratingCount: number
  createdAt: string
  
  // Stats
  completedJobs: number
  activeJobs: number
  totalEarned?: number
  responseTime: string
  
  // Recent work
  recentJobs: Array<{
    id: string
    title: string
    description: string
    status: string
    completedAt?: string
    rating?: number
    feedback?: string
  }>
  
  // Reviews
  reviews: Array<{
    id: string
    rating: number
    comment: string
    reviewerName: string
    reviewerHandle: string
    jobTitle: string
    createdAt: string
  }>
  
  // Privacy settings
  profileVisibility: 'public' | 'private' | 'verified-only'
  showLocation: boolean
  showEmail: boolean
  allowDirectContact: boolean
}

export default function PublicProfilePage() {
  const params = useParams()
  const { user: currentUser } = useAuth()
  const { addToast } = useToast()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isOwnProfile, setIsOwnProfile] = useState(false)

  const handle = params.handle as string

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        if (DEMO_MODE) {
          // Demo data
          const demoProfile: UserProfile = {
            id: 'demo-user-123',
            handle: handle,
            name: handle === 'democlient' ? 'Demo Client' : 'Alex Johnson',
            email: `${handle}@example.com`,
            bio: handle === 'democlient' 
              ? 'Startup founder looking for top-tier developers to build the next generation of web applications.'
              : 'Full-stack developer with 8+ years of experience building scalable web applications. Passionate about clean code, user experience, and emerging technologies.',
            location: 'San Francisco, CA',
            website: 'https://alexjohnson.dev',
            skills: handle === 'democlient' 
              ? ['Product Management', 'UI/UX Design', 'Business Strategy'] 
              : ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'AWS', 'Python', 'GraphQL', 'Docker'],
            languages: ['English', 'Spanish'],
            roleClient: handle === 'democlient',
            roleFreelancer: handle !== 'democlient',
            preferredAssurance: 'MILESTONE_INVOICE',
            alsoAccepts: ['EXTERNAL_ESCROW'],
            ratingAverage: 4.9,
            ratingCount: 47,
            createdAt: '2023-01-15',
            
            completedJobs: handle === 'democlient' ? 12 : 34,
            activeJobs: handle === 'democlient' ? 3 : 2,
            totalEarned: handle === 'democlient' ? undefined : 125000,
            responseTime: '< 2 hours',
            
            recentJobs: [
              {
                id: 'job-1',
                title: 'E-commerce Platform Development',
                description: 'Built a complete e-commerce solution with React and Node.js',
                status: 'completed',
                completedAt: '2024-01-15',
                rating: 5,
                feedback: 'Exceptional work! Delivered ahead of schedule with great attention to detail.'
              },
              {
                id: 'job-2',
                title: 'Mobile App API Integration',
                description: 'Integrated payment processing and user authentication APIs',
                status: 'completed',
                completedAt: '2023-12-10',
                rating: 5,
                feedback: 'Perfect execution and great communication throughout the project.'
              }
            ],
            
            reviews: [
              {
                id: 'review-1',
                rating: 5,
                comment: 'Outstanding developer! Alex delivered a complex web application that exceeded our expectations. Great communication, clean code, and delivered on time.',
                reviewerName: 'Sarah Chen',
                reviewerHandle: 'sarahc',
                jobTitle: 'SaaS Dashboard Development',
                createdAt: '2024-01-20'
              },
              {
                id: 'review-2',
                rating: 5,
                comment: 'Highly skilled and professional. The API integration was flawless and the documentation was excellent. Will definitely work with Alex again!',
                reviewerName: 'Michael Rodriguez',
                reviewerHandle: 'mrodriguez',
                jobTitle: 'API Development & Integration',
                createdAt: '2023-12-15'
              }
            ],
            
            profileVisibility: 'public',
            showLocation: true,
            showEmail: false,
            allowDirectContact: true
          }
          
          setProfile(demoProfile)
          setIsOwnProfile(currentUser?.user_metadata?.handle === handle)
        } else {
          // Real API call
          const response = await fetch(`/api/profiles/${handle}`)
          if (!response.ok) {
            if (response.status === 404) {
              throw new Error('Profile not found')
            }
            throw new Error('Failed to load profile')
          }
          
          const data = await response.json()
          setProfile(data)
          setIsOwnProfile(currentUser?.user_metadata?.handle === handle)
        }
      } catch (error) {
        console.error('Error fetching profile:', error)
        addToast({
          type: 'error',
          title: 'Error',
          description: 'Failed to load profile. Please try again.',
          duration: 5000
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchProfile()
  }, [handle, currentUser, addToast])

  const handleContactUser = () => {
    if (DEMO_MODE) {
      addToast({
        type: 'info',
        title: 'Demo Mode',
        description: 'Messaging is not available in demo mode.',
        duration: 3000
      })
    } else {
      // Navigate to messages with pre-filled recipient
      window.location.href = `/messages?recipient=${profile?.handle}`
    }
  }

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase()
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long'
    })
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ))
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-slate-400">Loading profile...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900 flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle className="text-center">Profile Not Found</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <User className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-slate-400 mb-4">
              The user @{handle} could not be found.
            </p>
            <Button asChild>
              <Link href="/">Return Home</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Profile Header */}
        <Card className="mb-8 border-0 shadow-xl bg-gradient-to-br from-white to-blue-50 dark:from-slate-800 dark:to-slate-900">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row gap-6">
              {/* Avatar */}
              <div className="flex-shrink-0">
                <Avatar className="h-32 w-32 border-4 border-white shadow-xl">
                  <AvatarImage src={profile.avatarUrl} alt={profile.name} />
                  <AvatarFallback className="text-2xl font-bold bg-gradient-to-br from-blue-600 to-purple-600 text-white">
                    {getInitials(profile.name)}
                  </AvatarFallback>
                </Avatar>
              </div>

              {/* Profile Info */}
              <div className="flex-1">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-slate-100 mb-2">
                      {profile.name}
                    </h1>
                    <p className="text-xl text-blue-600 dark:text-blue-400 mb-2">
                      @{profile.handle}
                    </p>
                    
                    <div className="flex items-center gap-4 mb-4">
                      {profile.showLocation && profile.location && (
                        <div className="flex items-center text-gray-600 dark:text-slate-400">
                          <MapPin className="h-4 w-4 mr-1" />
                          {profile.location}
                        </div>
                      )}
                      
                      {profile.website && (
                        <a
                          href={profile.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center text-blue-600 hover:text-blue-700 transition-colors"
                        >
                          <Globe className="h-4 w-4 mr-1" />
                          Website
                          <ExternalLink className="h-3 w-3 ml-1" />
                        </a>
                      )}
                      
                      <div className="flex items-center text-gray-600 dark:text-slate-400">
                        <Calendar className="h-4 w-4 mr-1" />
                        Joined {formatDate(profile.createdAt)}
                      </div>
                    </div>

                    <p className="text-gray-700 dark:text-slate-300 mb-4 leading-relaxed">
                      {profile.bio}
                    </p>

                    {/* Badges */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {profile.roleClient && (
                        <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white">
                          <Users className="h-3 w-3 mr-1" />
                          Client
                        </Badge>
                      )}
                      {profile.roleFreelancer && (
                        <Badge className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                          <Briefcase className="h-3 w-3 mr-1" />
                          Freelancer
                        </Badge>
                      )}
                      <Badge variant="outline" className="border-yellow-400 text-yellow-700 dark:text-yellow-400">
                        <Shield className="h-3 w-3 mr-1" />
                        {profile.preferredAssurance.replace('_', ' ').toLowerCase()}
                      </Badge>
                    </div>

                    {/* Rating */}
                    <div className="flex items-center gap-2">
                      <div className="flex">{renderStars(profile.ratingAverage)}</div>
                      <span className="font-semibold text-gray-900 dark:text-slate-100">
                        {profile.ratingAverage}
                      </span>
                      <span className="text-gray-600 dark:text-slate-400">
                        ({profile.ratingCount} reviews)
                      </span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col gap-2">
                    {!isOwnProfile && profile.allowDirectContact && (
                      <Button 
                        onClick={handleContactUser}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Send Message
                      </Button>
                    )}
                    
                    {isOwnProfile && (
                      <Button asChild variant="outline">
                        <Link href="/settings">
                          <User className="h-4 w-4 mr-2" />
                          Edit Profile
                        </Link>
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="text-center">
            <CardContent className="p-6">
              <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900 dark:text-slate-100">
                {profile.completedJobs}
              </div>
              <div className="text-sm text-gray-600 dark:text-slate-400">
                Completed Jobs
              </div>
            </CardContent>
          </Card>
          
          <Card className="text-center">
            <CardContent className="p-6">
              <TrendingUp className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900 dark:text-slate-100">
                {profile.activeJobs}
              </div>
              <div className="text-sm text-gray-600 dark:text-slate-400">
                Active Jobs
              </div>
            </CardContent>
          </Card>
          
          {profile.totalEarned && (
            <Card className="text-center">
              <CardContent className="p-6">
                <Award className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900 dark:text-slate-100">
                  ${profile.totalEarned.toLocaleString()}
                </div>
                <div className="text-sm text-gray-600 dark:text-slate-400">
                  Total Earned
                </div>
              </CardContent>
            </Card>
          )}
          
          <Card className="text-center">
            <CardContent className="p-6">
              <Clock className="h-8 w-8 text-orange-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900 dark:text-slate-100">
                {profile.responseTime}
              </div>
              <div className="text-sm text-gray-600 dark:text-slate-400">
                Response Time
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Profile Content Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="skills">Skills</TabsTrigger>
            <TabsTrigger value="work">Recent Work</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>About</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 dark:text-slate-300 leading-relaxed">
                  {profile.bio}
                </p>
                
                <div className="mt-6">
                  <h4 className="font-semibold mb-3">Languages</h4>
                  <div className="flex flex-wrap gap-2">
                    {profile.languages.map((language) => (
                      <Badge key={language} variant="outline">
                        {language}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="skills">
            <Card>
              <CardHeader>
                <CardTitle>Skills & Expertise</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-3">
                  {profile.skills.map((skill) => (
                    <Badge 
                      key={skill} 
                      className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 text-sm"
                    >
                      {skill}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="work" className="space-y-6">
            {profile.recentJobs.map((job) => (
              <Card key={job.id}>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-slate-100 mb-2">
                        {job.title}
                      </h3>
                      <p className="text-gray-600 dark:text-slate-400 mb-4">
                        {job.description}
                      </p>
                    </div>
                    <Badge className="bg-green-100 text-green-800">
                      {job.status}
                    </Badge>
                  </div>
                  
                  {job.rating && (
                    <div className="flex items-center gap-4 mb-4">
                      <div className="flex">{renderStars(job.rating)}</div>
                      <span className="text-sm text-gray-600 dark:text-slate-400">
                        Completed {formatDate(job.completedAt!)}
                      </span>
                    </div>
                  )}
                  
                  {job.feedback && (
                    <div className="bg-gray-50 dark:bg-slate-700 rounded-lg p-4">
                      <p className="italic text-gray-700 dark:text-slate-300">
                        "{job.feedback}"
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="reviews" className="space-y-6">
            {profile.reviews.map((review) => (
              <Card key={review.id}>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                        {getInitials(review.reviewerName)}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-slate-100">
                            {review.reviewerName}
                          </h4>
                          <p className="text-sm text-gray-600 dark:text-slate-400">
                            @{review.reviewerHandle} • {review.jobTitle}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="flex">{renderStars(review.rating)}</div>
                          <div className="text-sm text-gray-600 dark:text-slate-400">
                            {formatDate(review.createdAt)}
                          </div>
                        </div>
                      </div>
                      
                      <p className="text-gray-700 dark:text-slate-300 leading-relaxed">
                        {review.comment}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}