'use client'

import { useState, useEffect } from 'react'
import { Navigation } from '@/components/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/lib/auth/context'
import { 
  User, 
  Edit3, 
  Save, 
  Camera, 
  MapPin, 
  Link as LinkIcon, 
  Mail, 
  Phone,
  Calendar,
  Briefcase,
  Star,
  Award,
  DollarSign,
  Clock,
  CheckCircle,
  X,
  Plus,
  Trash2,
  Linkedin,
  Download
} from 'lucide-react'
import Link from 'next/link'

interface Skill {
  name: string
  level: 'beginner' | 'intermediate' | 'expert'
}

interface Experience {
  id: string
  title: string
  company: string
  duration: string
  description: string
}

interface ProfileData {
  name: string
  handle: string
  title: string
  bio: string
  location: string
  website: string
  email: string
  phone: string
  joinDate: string
  hourlyRate: string
  availability: string
  skills: Skill[]
  experience: Experience[]
  completedProjects: number
  totalEarned: number
  rating: number
  responseTime: string
}

export default function ProfilePage() {
  const { isAuthenticated, user } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [profileData, setProfileData] = useState<ProfileData>({
    name: user?.user_metadata?.name || 'Demo User',
    handle: user?.user_metadata?.handle || 'demouser',
    title: 'Full Stack Developer',
    bio: 'Passionate developer with 5+ years of experience in React, Node.js, and cloud technologies. I love building scalable applications that solve real-world problems.',
    location: 'San Francisco, CA',
    website: 'https://github.com/demouser',
    email: user?.email || 'demo@example.com',
    phone: '+1 (555) 123-4567',
    joinDate: 'January 2024',
    hourlyRate: '$75',
    availability: 'Available (40 hours/week)',
    skills: [
      { name: 'React', level: 'expert' },
      { name: 'Node.js', level: 'expert' },
      { name: 'TypeScript', level: 'expert' },
      { name: 'Python', level: 'intermediate' },
      { name: 'AWS', level: 'intermediate' },
      { name: 'Docker', level: 'beginner' }
    ],
    experience: [
      {
        id: '1',
        title: 'Senior Frontend Developer',
        company: 'Tech Startup Inc.',
        duration: '2022 - Present',
        description: 'Led frontend development for a SaaS platform using React and TypeScript'
      },
      {
        id: '2',
        title: 'Full Stack Developer',
        company: 'Digital Agency',
        duration: '2020 - 2022',
        description: 'Built custom web applications for clients using MERN stack'
      }
    ],
    completedProjects: 47,
    totalEarned: 125000,
    rating: 4.9,
    responseTime: '< 2 hours'
  })

  const [tempData, setTempData] = useState(profileData)
  const [newSkill, setNewSkill] = useState({ name: '', level: 'beginner' as const })
  const [isImporting, setIsImporting] = useState(false)

  // Redirect to sign in if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      window.location.href = '/auth/signin'
    }
  }, [isAuthenticated])

  const handleEdit = () => {
    setTempData(profileData)
    setIsEditing(true)
  }

  const handleSave = () => {
    setProfileData(tempData)
    setIsEditing(false)
    // In a real app, this would save to the server
    console.log('Profile saved:', tempData)
  }

  const handleCancel = () => {
    setTempData(profileData)
    setIsEditing(false)
    setNewSkill({ name: '', level: 'beginner' })
  }

  const addSkill = () => {
    if (newSkill.name.trim()) {
      setTempData({
        ...tempData,
        skills: [...tempData.skills, newSkill]
      })
      setNewSkill({ name: '', level: 'beginner' })
    }
  }

  const removeSkill = (index: number) => {
    setTempData({
      ...tempData,
      skills: tempData.skills.filter((_, i) => i !== index)
    })
  }

  const getSkillColor = (level: string) => {
    switch (level) {
      case 'expert': return 'bg-green-100 text-green-800 border-green-200'
      case 'intermediate': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'beginner': return 'bg-blue-100 text-blue-800 border-blue-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const handleLinkedInImport = async () => {
    setIsImporting(true)
    
    try {
      // Check if user has LinkedIn token
      const linkedInToken = localStorage.getItem('linkedin_access_token')
      
      if (!linkedInToken) {
        // Redirect to LinkedIn OAuth
        const authUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${process.env.NEXT_PUBLIC_LINKEDIN_CLIENT_ID}&redirect_uri=${encodeURIComponent(window.location.origin + '/auth/linkedin/callback')}&scope=r_liteprofile%20r_emailaddress&state=${btoa(Math.random().toString())}`
        
        // Store current URL for redirect after auth
        sessionStorage.setItem('linkedin_redirect_url', window.location.href)
        
        window.location.href = authUrl
        return
      }

      // Import LinkedIn data using the real API
      const response = await fetch('/api/linkedin/import', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${linkedInToken}`
        }
      })

      if (!response.ok) {
        if (response.status === 401) {
          // Token expired, clear it and try again
          localStorage.removeItem('linkedin_access_token')
          throw new Error('LinkedIn session expired. Please try again.')
        }
        throw new Error('Failed to import LinkedIn data')
      }

      const linkedInData = await response.json()
      
      // Update profile with LinkedIn data
      const updatedProfile = {
        ...profileData,
        ...linkedInData,
        email: profileData.email, // Keep existing email
        phone: profileData.phone, // Keep existing phone
        website: profileData.website, // Keep existing website
        joinDate: profileData.joinDate, // Keep join date
        hourlyRate: profileData.hourlyRate, // Keep existing rate
        availability: profileData.availability // Keep existing availability
      }
      
      setProfileData(updatedProfile)
      setTempData(updatedProfile)
      
      // Save to database
      await fetch('/api/profile/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user?.id,
          profileData: updatedProfile
        })
      })
      
      // Show success message
      alert(`Successfully imported profile data from LinkedIn!\n\nImported:\n• ${linkedInData.skills?.length || 0} skills\n• ${linkedInData.experience?.length || 0} work experiences\n• Professional summary and location`)
      
    } catch (error) {
      console.error('LinkedIn import failed:', error)
      alert(`Failed to import LinkedIn data: ${error.message}`)
    } finally {
      setIsImporting(false)
    }
  }

  if (!isAuthenticated) {
    return null // Will redirect via useEffect
  }

  const currentData = isEditing ? tempData : profileData

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="bg-gradient-to-br from-blue-600 to-blue-700 text-white p-3 rounded-xl shadow-lg">
                  <User className="h-6 w-6" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-slate-100">Profile</h1>
                  <p className="text-gray-600 dark:text-slate-300">
                    Manage your professional profile
                  </p>
                </div>
              </div>
              
              {!isEditing ? (
                <div className="flex space-x-2">
                  <Button 
                    onClick={handleLinkedInImport}
                    disabled={isImporting}
                    variant="outline"
                    className="bg-[#0077B5] hover:bg-[#005582] text-white border-[#0077B5]"
                  >
                    <Linkedin className="h-4 w-4 mr-2" />
                    {isImporting ? 'Importing...' : 'Import from LinkedIn'}
                  </Button>
                  <Button onClick={handleEdit} className="bg-blue-600 hover:bg-blue-700">
                    <Edit3 className="h-4 w-4 mr-2" />
                    Edit Profile
                  </Button>
                </div>
              ) : (
                <div className="flex space-x-2">
                  <Button variant="outline" onClick={handleCancel}>
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                  </Button>
                  <Button onClick={handleSave} className="bg-green-600 hover:bg-green-700">
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </Button>
                </div>
              )}
            </div>
            
            {/* Demo Notice */}
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mt-6">
              <p className="text-blue-800 dark:text-blue-200 text-sm">
                <strong>Demo Mode:</strong> This is a preview of the profile system. Changes and LinkedIn imports are simulated and won't be permanently saved. Try the "Import from LinkedIn" button to see how profile auto-population works!
              </p>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Profile Card */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader className="text-center">
                  <div className="relative mx-auto mb-4">
                    <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/40 dark:to-purple-900/40 rounded-full flex items-center justify-center">
                      <User className="h-12 w-12 text-blue-600 dark:text-blue-400" />
                    </div>
                    {isEditing && (
                      <button className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors">
                        <Camera className="h-3 w-3" />
                      </button>
                    )}
                  </div>
                  
                  {isEditing ? (
                    <div className="space-y-3">
                      <Input
                        value={currentData.name}
                        onChange={(e) => setTempData({...tempData, name: e.target.value})}
                        className="text-center font-semibold"
                      />
                      <Input
                        value={currentData.handle}
                        onChange={(e) => setTempData({...tempData, handle: e.target.value})}
                        className="text-center text-sm"
                        placeholder="@username"
                      />
                    </div>
                  ) : (
                    <>
                      <CardTitle className="text-xl">{currentData.name}</CardTitle>
                      <CardDescription>@{currentData.handle}</CardDescription>
                    </>
                  )}
                </CardHeader>
                
                <CardContent className="space-y-4">
                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                        {currentData.completedProjects}
                      </div>
                      <div className="text-xs text-gray-600 dark:text-slate-400">Projects</div>
                    </div>
                    <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
                      <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                        {currentData.rating}
                      </div>
                      <div className="text-xs text-gray-600 dark:text-slate-400">Rating</div>
                    </div>
                  </div>
                  
                  {/* Key Info */}
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Briefcase className="h-4 w-4 text-gray-400" />
                      {isEditing ? (
                        <Input
                          value={currentData.title}
                          onChange={(e) => setTempData({...tempData, title: e.target.value})}
                          className="flex-1"
                        />
                      ) : (
                        <span className="text-sm text-gray-600 dark:text-slate-300">{currentData.title}</span>
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4 text-gray-400" />
                      {isEditing ? (
                        <Input
                          value={currentData.location}
                          onChange={(e) => setTempData({...tempData, location: e.target.value})}
                          className="flex-1"
                        />
                      ) : (
                        <span className="text-sm text-gray-600 dark:text-slate-300">{currentData.location}</span>
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-600 dark:text-slate-300">
                        Joined {currentData.joinDate}
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <DollarSign className="h-4 w-4 text-gray-400" />
                      {isEditing ? (
                        <Input
                          value={currentData.hourlyRate}
                          onChange={(e) => setTempData({...tempData, hourlyRate: e.target.value})}
                          className="flex-1"
                        />
                      ) : (
                        <span className="text-sm text-gray-600 dark:text-slate-300">
                          {currentData.hourlyRate}/hour
                        </span>
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-600 dark:text-slate-300">
                        {currentData.responseTime} response time
                      </span>
                    </div>
                  </div>
                  
                  {/* Availability Status */}
                  <div className="flex items-center space-x-2 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    {isEditing ? (
                      <Input
                        value={currentData.availability}
                        onChange={(e) => setTempData({...tempData, availability: e.target.value})}
                        className="flex-1 bg-transparent border-0 p-0"
                      />
                    ) : (
                      <span className="text-sm font-medium text-green-700 dark:text-green-300">
                        {currentData.availability}
                      </span>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* About */}
              <Card>
                <CardHeader>
                  <CardTitle>About</CardTitle>
                </CardHeader>
                <CardContent>
                  {isEditing ? (
                    <Textarea
                      value={currentData.bio}
                      onChange={(e) => setTempData({...tempData, bio: e.target.value})}
                      rows={4}
                      className="w-full"
                      placeholder="Tell us about yourself..."
                    />
                  ) : (
                    <p className="text-gray-600 dark:text-slate-300 leading-relaxed">
                      {currentData.bio}
                    </p>
                  )}
                </CardContent>
              </Card>

              {/* Contact Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <Label className="flex items-center space-x-2 mb-2">
                        <Mail className="h-4 w-4" />
                        <span>Email</span>
                      </Label>
                      {isEditing ? (
                        <Input
                          value={currentData.email}
                          onChange={(e) => setTempData({...tempData, email: e.target.value})}
                          type="email"
                        />
                      ) : (
                        <p className="text-gray-600 dark:text-slate-300">{currentData.email}</p>
                      )}
                    </div>
                    
                    <div>
                      <Label className="flex items-center space-x-2 mb-2">
                        <Phone className="h-4 w-4" />
                        <span>Phone</span>
                      </Label>
                      {isEditing ? (
                        <Input
                          value={currentData.phone}
                          onChange={(e) => setTempData({...tempData, phone: e.target.value})}
                          type="tel"
                        />
                      ) : (
                        <p className="text-gray-600 dark:text-slate-300">{currentData.phone}</p>
                      )}
                    </div>
                    
                    <div className="sm:col-span-2">
                      <Label className="flex items-center space-x-2 mb-2">
                        <LinkIcon className="h-4 w-4" />
                        <span>Website/Portfolio</span>
                      </Label>
                      {isEditing ? (
                        <Input
                          value={currentData.website}
                          onChange={(e) => setTempData({...tempData, website: e.target.value})}
                          type="url"
                        />
                      ) : (
                        <a href={currentData.website} target="_blank" rel="noopener noreferrer" 
                           className="text-blue-600 dark:text-blue-400 hover:underline">
                          {currentData.website}
                        </a>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Skills */}
              <Card>
                <CardHeader>
                  <CardTitle>Skills</CardTitle>
                  <CardDescription>Your technical expertise</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {currentData.skills.map((skill, index) => (
                      <div key={index} className="flex items-center">
                        <Badge className={`${getSkillColor(skill.level)} border`}>
                          {skill.name} ({skill.level})
                        </Badge>
                        {isEditing && (
                          <button
                            onClick={() => removeSkill(index)}
                            className="ml-1 text-red-500 hover:text-red-700"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                  
                  {isEditing && (
                    <div className="flex space-x-2">
                      <Input
                        placeholder="Skill name"
                        value={newSkill.name}
                        onChange={(e) => setNewSkill({...newSkill, name: e.target.value})}
                        className="flex-1"
                      />
                      <select
                        value={newSkill.level}
                        onChange={(e) => setNewSkill({...newSkill, level: e.target.value as any})}
                        className="px-3 py-2 border rounded-md bg-background"
                      >
                        <option value="beginner">Beginner</option>
                        <option value="intermediate">Intermediate</option>
                        <option value="expert">Expert</option>
                      </select>
                      <Button onClick={addSkill} size="sm">
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Experience */}
              <Card>
                <CardHeader>
                  <CardTitle>Work Experience</CardTitle>
                  <CardDescription>Your professional background</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {currentData.experience.map((exp, index) => (
                      <div key={exp.id} className="border-l-4 border-blue-200 pl-4 pb-4">
                        {isEditing ? (
                          <div className="space-y-2">
                            <Input
                              value={exp.title}
                              onChange={(e) => {
                                const newExp = [...tempData.experience]
                                newExp[index] = {...exp, title: e.target.value}
                                setTempData({...tempData, experience: newExp})
                              }}
                              placeholder="Job Title"
                            />
                            <Input
                              value={exp.company}
                              onChange={(e) => {
                                const newExp = [...tempData.experience]
                                newExp[index] = {...exp, company: e.target.value}
                                setTempData({...tempData, experience: newExp})
                              }}
                              placeholder="Company"
                            />
                            <Input
                              value={exp.duration}
                              onChange={(e) => {
                                const newExp = [...tempData.experience]
                                newExp[index] = {...exp, duration: e.target.value}
                                setTempData({...tempData, experience: newExp})
                              }}
                              placeholder="Duration"
                            />
                            <Textarea
                              value={exp.description}
                              onChange={(e) => {
                                const newExp = [...tempData.experience]
                                newExp[index] = {...exp, description: e.target.value}
                                setTempData({...tempData, experience: newExp})
                              }}
                              placeholder="Description"
                              rows={2}
                            />
                          </div>
                        ) : (
                          <>
                            <h4 className="font-semibold text-gray-900 dark:text-slate-100">
                              {exp.title}
                            </h4>
                            <p className="text-blue-600 dark:text-blue-400 font-medium">
                              {exp.company}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-slate-400 mb-2">
                              {exp.duration}
                            </p>
                            <p className="text-gray-600 dark:text-slate-300">
                              {exp.description}
                            </p>
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
          
          {/* Quick Actions */}
          <div className="mt-8">
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid sm:grid-cols-4 gap-4">
                  <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2" asChild>
                    <Link href="/jobs">
                      <Briefcase className="h-6 w-6" />
                      <span>Find Work</span>
                    </Link>
                  </Button>
                  <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2" asChild>
                    <Link href="/dashboard">
                      <User className="h-6 w-6" />
                      <span>Dashboard</span>
                    </Link>
                  </Button>
                  <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2" asChild>
                    <Link href="/messages">
                      <Mail className="h-6 w-6" />
                      <span>Messages</span>
                    </Link>
                  </Button>
                  <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2" asChild>
                    <Link href="/jobs/new">
                      <Plus className="h-6 w-6" />
                      <span>Post Job</span>
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