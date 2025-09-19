'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { 
  Bell, 
  BellOff,
  Check, 
  CheckCheck,
  Trash2,
  MessageSquare,
  Briefcase,
  DollarSign,
  Users,
  Award,
  AlertTriangle,
  Info,
  Heart,
  Zap,
  Eye,
  EyeOff,
  Filter,
  Search,
  Settings
} from 'lucide-react'
import Link from 'next/link'
import { useToast } from '@/components/ui/toast'
import { DEMO_MODE } from '@/lib/prisma'
import { useAuth } from '@/lib/auth/context'
import { Input } from '@/components/ui/input'

interface Notification {
  id: string
  type: 'message' | 'job' | 'proposal' | 'payment' | 'system' | 'review'
  title: string
  description: string
  isRead: boolean
  isImportant: boolean
  actionUrl?: string
  avatarUrl?: string
  senderName?: string
  createdAt: string
  metadata?: {
    jobId?: string
    proposalId?: string
    amount?: number
    currency?: string
  }
}

export default function NotificationsPage() {
  const { user, isAuthenticated } = useAuth()
  const { addToast } = useToast()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'unread' | 'important'>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [showSettings, setShowSettings] = useState(false)
  
  // Notification settings
  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    jobUpdates: true,
    messageNotifications: true,
    paymentAlerts: true,
    marketingUpdates: false
  })

  useEffect(() => {
    const fetchNotifications = async () => {
      if (DEMO_MODE) {
        // Demo notifications
        const demoNotifications: Notification[] = [
          {
            id: '1',
            type: 'message',
            title: 'New Message from Sarah Chen',
            description: 'Hi! I\'m interested in your React development services. Could we schedule a call?',
            isRead: false,
            isImportant: false,
            actionUrl: '/messages/sarah-chen',
            avatarUrl: '',
            senderName: 'Sarah Chen',
            createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
            metadata: {}
          },
          {
            id: '2',
            type: 'proposal',
            title: 'Proposal Accepted',
            description: 'Your proposal for "E-commerce Website Development" has been accepted by TechStart Inc.',
            isRead: false,
            isImportant: true,
            actionUrl: '/proposals/ecom-website',
            createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
            metadata: { jobId: 'job-123' }
          },
          {
            id: '3',
            type: 'payment',
            title: 'Payment Received',
            description: 'You received $2,500.00 for completing milestone 1 of the Mobile App project.',
            isRead: true,
            isImportant: true,
            actionUrl: '/dashboard/payments',
            createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
            metadata: { amount: 250000, currency: 'USD' }
          },
          {
            id: '4',
            type: 'review',
            title: 'New Review Received',
            description: 'Michael Rodriguez left you a 5-star review for the API Integration project.',
            isRead: true,
            isImportant: false,
            actionUrl: '/profile/reviews',
            senderName: 'Michael Rodriguez',
            createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), // 2 days ago
            metadata: {}
          },
          {
            id: '5',
            type: 'job',
            title: 'New Job Match',
            description: 'A new job posting matches your skills: "Full Stack Developer for SaaS Platform"',
            isRead: true,
            isImportant: false,
            actionUrl: '/jobs/saas-platform-dev',
            createdAt: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(), // 3 days ago
            metadata: { jobId: 'job-456' }
          },
          {
            id: '6',
            type: 'system',
            title: 'Profile Verification Complete',
            description: 'Your profile has been verified! You now have access to premium features.',
            isRead: true,
            isImportant: false,
            createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(), // 1 week ago
            metadata: {}
          }
        ]
        setNotifications(demoNotifications)
      } else {
        // Real API call
        try {
          const response = await fetch('/api/notifications')
          if (!response.ok) throw new Error('Failed to fetch notifications')
          const data = await response.json()
          setNotifications(data.notifications)
        } catch (error) {
          addToast({
            type: 'error',
            title: 'Error',
            description: 'Failed to load notifications.',
            duration: 5000
          })
        }
      }
      setIsLoading(false)
    }

    if (isAuthenticated) {
      fetchNotifications()
    } else {
      setIsLoading(false)
    }
  }, [isAuthenticated, addToast])

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'message':
        return MessageSquare
      case 'job':
        return Briefcase
      case 'proposal':
        return Briefcase
      case 'payment':
        return DollarSign
      case 'review':
        return Award
      case 'system':
        return Info
      default:
        return Bell
    }
  }

  const getNotificationColor = (type: string, isImportant: boolean) => {
    if (isImportant) return 'text-red-600 bg-red-100 dark:bg-red-900/20'
    
    switch (type) {
      case 'message':
        return 'text-blue-600 bg-blue-100 dark:bg-blue-900/20'
      case 'job':
        return 'text-purple-600 bg-purple-100 dark:bg-purple-900/20'
      case 'proposal':
        return 'text-green-600 bg-green-100 dark:bg-green-900/20'
      case 'payment':
        return 'text-emerald-600 bg-emerald-100 dark:bg-emerald-900/20'
      case 'review':
        return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20'
      case 'system':
        return 'text-gray-600 bg-gray-100 dark:bg-gray-900/20'
      default:
        return 'text-gray-600 bg-gray-100 dark:bg-gray-900/20'
    }
  }

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInMs = now.getTime() - date.getTime()
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60))
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60))
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24))

    if (diffInMinutes < 60) {
      return `${diffInMinutes}m ago`
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`
    } else if (diffInDays < 7) {
      return `${diffInDays}d ago`
    } else {
      return date.toLocaleDateString()
    }
  }

  const markAsRead = async (notificationId: string) => {
    if (DEMO_MODE) {
      setNotifications(notifications.map(n => 
        n.id === notificationId ? { ...n, isRead: true } : n
      ))
      addToast({
        type: 'success',
        title: 'Marked as Read',
        description: 'Notification marked as read.',
        duration: 2000
      })
    } else {
      try {
        const response = await fetch(`/api/notifications/${notificationId}/read`, {
          method: 'PATCH'
        })
        if (!response.ok) throw new Error('Failed to mark as read')
        
        setNotifications(notifications.map(n => 
          n.id === notificationId ? { ...n, isRead: true } : n
        ))
      } catch (error) {
        addToast({
          type: 'error',
          title: 'Error',
          description: 'Failed to mark notification as read.',
          duration: 3000
        })
      }
    }
  }

  const markAllAsRead = async () => {
    if (DEMO_MODE) {
      setNotifications(notifications.map(n => ({ ...n, isRead: true })))
      addToast({
        type: 'success',
        title: 'All Marked as Read',
        description: 'All notifications marked as read.',
        duration: 2000
      })
    } else {
      try {
        const response = await fetch('/api/notifications/read-all', {
          method: 'PATCH'
        })
        if (!response.ok) throw new Error('Failed to mark all as read')
        
        setNotifications(notifications.map(n => ({ ...n, isRead: true })))
      } catch (error) {
        addToast({
          type: 'error',
          title: 'Error',
          description: 'Failed to mark all notifications as read.',
          duration: 3000
        })
      }
    }
  }

  const deleteNotification = async (notificationId: string) => {
    if (DEMO_MODE) {
      setNotifications(notifications.filter(n => n.id !== notificationId))
      addToast({
        type: 'success',
        title: 'Notification Deleted',
        description: 'Notification removed.',
        duration: 2000
      })
    } else {
      try {
        const response = await fetch(`/api/notifications/${notificationId}`, {
          method: 'DELETE'
        })
        if (!response.ok) throw new Error('Failed to delete notification')
        
        setNotifications(notifications.filter(n => n.id !== notificationId))
      } catch (error) {
        addToast({
          type: 'error',
          title: 'Error',
          description: 'Failed to delete notification.',
          duration: 3000
        })
      }
    }
  }

  const filteredNotifications = notifications
    .filter(notification => {
      if (filter === 'unread') return !notification.isRead
      if (filter === 'important') return notification.isImportant
      return true
    })
    .filter(notification => {
      if (!searchQuery) return true
      const query = searchQuery.toLowerCase()
      return (
        notification.title.toLowerCase().includes(query) ||
        notification.description.toLowerCase().includes(query) ||
        notification.senderName?.toLowerCase().includes(query)
      )
    })

  const unreadCount = notifications.filter(n => !n.isRead).length

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900 flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader className="text-center">
            <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <CardTitle>Sign In Required</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-gray-600 dark:text-slate-400 mb-4">
              Please sign in to view your notifications.
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
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-slate-100 flex items-center gap-3">
              <Bell className="h-8 w-8 text-blue-600" />
              Notifications
              {unreadCount > 0 && (
                <Badge className="bg-red-500 text-white animate-pulse">
                  {unreadCount} new
                </Badge>
              )}
            </h1>
            <p className="text-gray-600 dark:text-slate-400 mt-2">
              Stay updated with your latest activity and messages.
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() => setShowSettings(!showSettings)}
              className="gap-2"
            >
              <Settings className="h-4 w-4" />
              Settings
            </Button>
            {unreadCount > 0 && (
              <Button onClick={markAllAsRead} className="gap-2">
                <CheckCheck className="h-4 w-4" />
                Mark All Read
              </Button>
            )}
          </div>
        </div>

        {/* Notification Settings */}
        {showSettings && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Notification Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center justify-between">
                  <Label>Email Notifications</Label>
                  <Switch
                    checked={settings.emailNotifications}
                    onCheckedChange={(checked) => 
                      setSettings({...settings, emailNotifications: checked})
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label>Push Notifications</Label>
                  <Switch
                    checked={settings.pushNotifications}
                    onCheckedChange={(checked) => 
                      setSettings({...settings, pushNotifications: checked})
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label>Job Updates</Label>
                  <Switch
                    checked={settings.jobUpdates}
                    onCheckedChange={(checked) => 
                      setSettings({...settings, jobUpdates: checked})
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label>Message Notifications</Label>
                  <Switch
                    checked={settings.messageNotifications}
                    onCheckedChange={(checked) => 
                      setSettings({...settings, messageNotifications: checked})
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label>Payment Alerts</Label>
                  <Switch
                    checked={settings.paymentAlerts}
                    onCheckedChange={(checked) => 
                      setSettings({...settings, paymentAlerts: checked})
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label>Marketing Updates</Label>
                  <Switch
                    checked={settings.marketingUpdates}
                    onCheckedChange={(checked) => 
                      setSettings({...settings, marketingUpdates: checked})
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Filters and Search */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search notifications..."
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
                  All ({notifications.length})
                </Button>
                <Button
                  variant={filter === 'unread' ? 'default' : 'outline'}
                  onClick={() => setFilter('unread')}
                  size="sm"
                >
                  Unread ({unreadCount})
                </Button>
                <Button
                  variant={filter === 'important' ? 'default' : 'outline'}
                  onClick={() => setFilter('important')}
                  size="sm"
                >
                  Important ({notifications.filter(n => n.isImportant).length})
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notifications List */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-slate-400">Loading notifications...</p>
          </div>
        ) : filteredNotifications.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Bell className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-100 mb-2">
                No Notifications
              </h3>
              <p className="text-gray-600 dark:text-slate-400">
                {searchQuery 
                  ? 'No notifications match your search.' 
                  : 'You\'re all caught up! No notifications to show.'}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredNotifications.map((notification) => {
              const Icon = getNotificationIcon(notification.type)
              const colorClass = getNotificationColor(notification.type, notification.isImportant)
              
              return (
                <Card 
                  key={notification.id} 
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    !notification.isRead ? 'border-blue-200 bg-blue-50/30 dark:bg-blue-900/10' : ''
                  }`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      {/* Icon */}
                      <div className={`p-2 rounded-full ${colorClass} flex-shrink-0`}>
                        <Icon className="h-5 w-5" />
                      </div>

                      {/* Avatar (if available) */}
                      {notification.senderName && (
                        <Avatar className="h-10 w-10 flex-shrink-0">
                          <AvatarImage src={notification.avatarUrl} alt={notification.senderName} />
                          <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                            {notification.senderName.split(' ').map(n => n[0]).join('').toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                      )}

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900 dark:text-slate-100 mb-1 flex items-center gap-2">
                              {notification.title}
                              {notification.isImportant && (
                                <Badge className="bg-red-500 text-white text-xs">
                                  Important
                                </Badge>
                              )}
                              {!notification.isRead && (
                                <div className="w-2 h-2 bg-blue-500 rounded-full" />
                              )}
                            </h4>
                            <p className="text-gray-600 dark:text-slate-400 text-sm mb-2 leading-relaxed">
                              {notification.description}
                            </p>
                            <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-slate-500">
                              <span>{formatTimeAgo(notification.createdAt)}</span>
                              <Badge variant="outline" className="text-xs">
                                {notification.type}
                              </Badge>
                            </div>
                          </div>
                          
                          {/* Actions */}
                          <div className="flex items-center gap-1 flex-shrink-0">
                            {!notification.isRead && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => markAsRead(notification.id)}
                                title="Mark as read"
                              >
                                <Check className="h-4 w-4" />
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => deleteNotification(notification.id)}
                              title="Delete"
                            >
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          </div>
                        </div>

                        {/* Action Button */}
                        {notification.actionUrl && (
                          <div className="mt-3">
                            <Button 
                              asChild 
                              variant="outline" 
                              size="sm"
                              className="text-blue-600 border-blue-200 hover:bg-blue-50"
                            >
                              <Link href={notification.actionUrl}>
                                View Details
                              </Link>
                            </Button>
                          </div>
                        )}
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