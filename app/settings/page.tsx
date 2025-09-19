'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useAuth } from '@/lib/auth/context'
import { useToast } from '@/components/ui/toast'
import { 
  User, 
  Mail, 
  Bell, 
  Shield, 
  CreditCard, 
  Globe, 
  Eye, 
  EyeOff,
  Save,
  Trash2,
  Download,
  Upload,
  Lock,
  Zap,
  Settings as SettingsIcon,
  CheckCircle,
  AlertCircle
} from 'lucide-react'
import { DEMO_MODE } from '@/lib/prisma'
import Link from 'next/link'

interface UserSettings {
  // Profile
  name: string
  handle: string
  email: string
  bio: string
  location: string
  website: string
  skills: string[]
  languages: string[]
  
  // Preferences  
  roleClient: boolean
  roleFreelancer: boolean
  preferredAssurance: 'MILESTONE_INVOICE' | 'EXTERNAL_ESCROW' | 'CARD_HOLD'
  alsoAccepts: string[]
  
  // Notifications
  emailNotifications: boolean
  pushNotifications: boolean
  marketingEmails: boolean
  weeklyDigest: boolean
  
  // Privacy
  profileVisibility: 'public' | 'private' | 'verified-only'
  showLocation: boolean
  showEmail: boolean
  allowDirectContact: boolean
}

export default function SettingsPage() {
  const { user, isAuthenticated } = useAuth()
  const { addToast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [activeTab, setActiveTab] = useState('profile')
  
  const [settings, setSettings] = useState<UserSettings>({
    name: user?.user_metadata?.name || 'Demo User',
    handle: user?.user_metadata?.handle || 'demouser',
    email: user?.email || 'demo@example.com',
    bio: 'Full-stack developer passionate about creating amazing user experiences.',
    location: 'San Francisco, CA',
    website: 'https://example.com',
    skills: ['React', 'TypeScript', 'Node.js', 'PostgreSQL'],
    languages: ['English', 'Spanish'],
    
    roleClient: user?.user_metadata?.role_client ?? true,
    roleFreelancer: user?.user_metadata?.role_freelancer ?? false,
    preferredAssurance: 'MILESTONE_INVOICE',
    alsoAccepts: ['EXTERNAL_ESCROW'],
    
    emailNotifications: true,
    pushNotifications: true,
    marketingEmails: false,
    weeklyDigest: true,
    
    profileVisibility: 'public',
    showLocation: true,
    showEmail: false,
    allowDirectContact: true
  })

  const [newSkill, setNewSkill] = useState('')

  useEffect(() => {
    // Load user settings in real app
    if (DEMO_MODE) {
      addToast({
        type: 'info',
        title: 'Demo Mode',
        description: 'Settings changes will be simulated in demo mode.',
        duration: 3000
      })
    }
  }, [])

  const handleSaveSettings = async () => {
    setIsLoading(true)
    
    try {
      if (DEMO_MODE) {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000))
        addToast({
          type: 'success',
          title: 'Settings Saved',
          description: 'Your settings have been saved successfully.',
          duration: 3000
        })
      } else {
        // Real API call would go here
        const response = await fetch('/api/user/settings', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(settings)
        })
        
        if (!response.ok) throw new Error('Failed to save settings')
        
        addToast({
          type: 'success',
          title: 'Settings Saved',
          description: 'Your settings have been updated successfully.',
          duration: 3000
        })
      }
    } catch (error) {
      addToast({
        type: 'error',
        title: 'Error',
        description: 'Failed to save settings. Please try again.',
        duration: 5000
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteAccount = async () => {
    if (!showDeleteConfirm) {
      setShowDeleteConfirm(true)
      return
    }

    setIsLoading(true)
    
    try {
      if (DEMO_MODE) {
        await new Promise(resolve => setTimeout(resolve, 1000))
        addToast({
          type: 'info',
          title: 'Demo Mode',
          description: 'Account deletion is disabled in demo mode.',
          duration: 3000
        })
      } else {
        // Real delete API call
        const response = await fetch('/api/user/delete', { method: 'DELETE' })
        if (!response.ok) throw new Error('Failed to delete account')
        
        addToast({
          type: 'success',
          title: 'Account Deleted',
          description: 'Your account has been permanently deleted.',
          duration: 3000
        })
      }
    } catch (error) {
      addToast({
        type: 'error',
        title: 'Error',
        description: 'Failed to delete account. Please contact support.',
        duration: 5000
      })
    } finally {
      setIsLoading(false)
      setShowDeleteConfirm(false)
    }
  }

  const addSkill = () => {
    if (newSkill && !settings.skills.includes(newSkill)) {
      setSettings({
        ...settings,
        skills: [...settings.skills, newSkill]
      })
      setNewSkill('')
    }
  }

  const removeSkill = (skill: string) => {
    setSettings({
      ...settings,
      skills: settings.skills.filter(s => s !== skill)
    })
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900 flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader className="text-center">
            <Lock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <CardTitle>Authentication Required</CardTitle>
            <CardDescription>
              Please sign in to access your account settings.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
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
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-slate-100 flex items-center gap-3">
              <SettingsIcon className="h-8 w-8 text-blue-600" />
              Account Settings
            </h1>
            <p className="text-gray-600 dark:text-slate-400 mt-2">
              Manage your account preferences and security settings.
            </p>
          </div>
          <Button 
            onClick={handleSaveSettings}
            disabled={isLoading}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Save className="h-4 w-4 mr-2" />
            {isLoading ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="privacy">Privacy</TabsTrigger>
            <TabsTrigger value="account">Account</TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Profile Information
                </CardTitle>
                <CardDescription>
                  Update your public profile information and skills.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={settings.name}
                      onChange={(e) => setSettings({...settings, name: e.target.value})}
                      placeholder="Your full name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="handle">Username</Label>
                    <Input
                      id="handle"
                      value={settings.handle}
                      onChange={(e) => setSettings({...settings, handle: e.target.value})}
                      placeholder="@username"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={settings.email}
                      onChange={(e) => setSettings({...settings, email: e.target.value})}
                      placeholder="you@example.com"
                    />
                  </div>
                  <div>
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={settings.location}
                      onChange={(e) => setSettings({...settings, location: e.target.value})}
                      placeholder="City, Country"
                    />
                  </div>
                  <div>
                    <Label htmlFor="website">Website</Label>
                    <Input
                      id="website"
                      type="url"
                      value={settings.website}
                      onChange={(e) => setSettings({...settings, website: e.target.value})}
                      placeholder="https://yourwebsite.com"
                    />
                  </div>
                  <div>
                    <Label htmlFor="assurance">Preferred Assurance</Label>
                    <Select 
                      value={settings.preferredAssurance} 
                      onValueChange={(value: any) => setSettings({...settings, preferredAssurance: value})}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="MILESTONE_INVOICE">Milestone Invoice</SelectItem>
                        <SelectItem value="EXTERNAL_ESCROW">External Escrow</SelectItem>
                        <SelectItem value="CARD_HOLD">Card Hold</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    value={settings.bio}
                    onChange={(e) => setSettings({...settings, bio: e.target.value})}
                    placeholder="Tell us about yourself..."
                    rows={4}
                  />
                </div>

                {/* Role Selection */}
                <div className="space-y-4">
                  <Label>Account Type</Label>
                  <div className="flex items-center space-x-6">
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={settings.roleClient}
                        onCheckedChange={(checked) => setSettings({...settings, roleClient: checked})}
                      />
                      <Label>Client (Hire talent)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={settings.roleFreelancer}
                        onCheckedChange={(checked) => setSettings({...settings, roleFreelancer: checked})}
                      />
                      <Label>Freelancer (Find work)</Label>
                    </div>
                  </div>
                </div>

                {/* Skills Management */}
                <div className="space-y-4">
                  <Label>Skills</Label>
                  <div className="flex gap-2">
                    <Input
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                      placeholder="Add a skill"
                      onKeyPress={(e) => e.key === 'Enter' && addSkill()}
                    />
                    <Button onClick={addSkill} variant="outline">Add</Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {settings.skills.map((skill) => (
                      <Badge
                        key={skill}
                        variant="secondary"
                        className="cursor-pointer hover:bg-red-100 hover:text-red-800"
                        onClick={() => removeSkill(skill)}
                      >
                        {skill} ×
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Notification Preferences
                </CardTitle>
                <CardDescription>
                  Choose how you want to be notified about activity.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Email Notifications</Label>
                      <p className="text-sm text-gray-500">Receive notifications via email</p>
                    </div>
                    <Switch
                      checked={settings.emailNotifications}
                      onCheckedChange={(checked) => setSettings({...settings, emailNotifications: checked})}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Push Notifications</Label>
                      <p className="text-sm text-gray-500">Browser and mobile push notifications</p>
                    </div>
                    <Switch
                      checked={settings.pushNotifications}
                      onCheckedChange={(checked) => setSettings({...settings, pushNotifications: checked})}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Marketing Emails</Label>
                      <p className="text-sm text-gray-500">Tips, product updates, and promotions</p>
                    </div>
                    <Switch
                      checked={settings.marketingEmails}
                      onCheckedChange={(checked) => setSettings({...settings, marketingEmails: checked})}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Weekly Digest</Label>
                      <p className="text-sm text-gray-500">Summary of weekly activity</p>
                    </div>
                    <Switch
                      checked={settings.weeklyDigest}
                      onCheckedChange={(checked) => setSettings({...settings, weeklyDigest: checked})}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Privacy Tab */}
          <TabsContent value="privacy" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Privacy Settings
                </CardTitle>
                <CardDescription>
                  Control who can see your information and contact you.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label>Profile Visibility</Label>
                  <Select 
                    value={settings.profileVisibility} 
                    onValueChange={(value: any) => setSettings({...settings, profileVisibility: value})}
                  >
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="public">Public - Anyone can view</SelectItem>
                      <SelectItem value="verified-only">Verified users only</SelectItem>
                      <SelectItem value="private">Private - Only you</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Show Location</Label>
                      <p className="text-sm text-gray-500">Display your location on your profile</p>
                    </div>
                    <Switch
                      checked={settings.showLocation}
                      onCheckedChange={(checked) => setSettings({...settings, showLocation: checked})}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Show Email</Label>
                      <p className="text-sm text-gray-500">Make your email visible to other users</p>
                    </div>
                    <Switch
                      checked={settings.showEmail}
                      onCheckedChange={(checked) => setSettings({...settings, showEmail: checked})}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Allow Direct Contact</Label>
                      <p className="text-sm text-gray-500">Let users message you directly</p>
                    </div>
                    <Switch
                      checked={settings.allowDirectContact}
                      onCheckedChange={(checked) => setSettings({...settings, allowDirectContact: checked})}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Account Tab */}
          <TabsContent value="account" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="h-5 w-5" />
                  Account Management
                </CardTitle>
                <CardDescription>
                  Manage your account security and data.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button variant="outline" className="h-auto p-4">
                    <div className="flex flex-col items-center text-center">
                      <Download className="h-8 w-8 mb-2 text-blue-600" />
                      <div className="font-semibold">Export Data</div>
                      <div className="text-sm text-gray-500">Download your account data</div>
                    </div>
                  </Button>
                  
                  <Button variant="outline" className="h-auto p-4">
                    <div className="flex flex-col items-center text-center">
                      <Lock className="h-8 w-8 mb-2 text-green-600" />
                      <div className="font-semibold">Change Password</div>
                      <div className="text-sm text-gray-500">Update your password</div>
                    </div>
                  </Button>
                </div>

                <div className="border-t pt-6">
                  <div className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 rounded-lg p-4">
                    <div className="flex items-start">
                      <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
                      <div className="ml-3 flex-1">
                        <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
                          Danger Zone
                        </h3>
                        <div className="mt-2 text-sm text-red-700 dark:text-red-300">
                          <p>
                            Once you delete your account, there is no going back. Please be certain.
                          </p>
                        </div>
                        <div className="mt-4">
                          <Button
                            variant="destructive"
                            onClick={handleDeleteAccount}
                            disabled={isLoading}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            {showDeleteConfirm ? 'Confirm Delete Account' : 'Delete Account'}
                          </Button>
                          {showDeleteConfirm && (
                            <Button
                              variant="outline"
                              onClick={() => setShowDeleteConfirm(false)}
                              className="ml-2"
                            >
                              Cancel
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}