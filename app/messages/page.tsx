'use client'

import { useState, useEffect } from 'react'
import { Navigation } from '@/components/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useAuth } from '@/lib/auth/context'
import { useToast } from '@/components/ui/toast'
import { 
  MessageActions, 
  AttachmentViewer, 
  FileUploader, 
  MessageStatusIndicator, 
  PriorityBadge,
  type EnhancedMessage,
  type Attachment
} from '@/components/ui/enhanced-messaging'
import { 
  MessageSquare, 
  Send, 
  Search, 
  Filter, 
  MoreHorizontal,
  Clock,
  CheckCheck,
  Star,
  Archive,
  Trash2,
  User,
  Paperclip,
  RefreshCw,
  Plus
} from 'lucide-react'
import Link from 'next/link'

interface Message extends EnhancedMessage {}

// Demo messages data
const demoMessages: Message[] = [
  {
    id: '1',
    sender: { name: 'Sarah Johnson', handle: 'sarahj_dev' },
    recipient: { name: 'You', handle: 'demo_user' },
    subject: 'Re: React Developer Position',
    content: 'Hi! I\'m interested in your React developer position. I have 5 years of experience with React and Next.js. Could we schedule a quick call to discuss the project requirements?',
    timestamp: '2024-01-15T10:30:00Z',
    read: false,
    starred: true,
    archived: false,
    deleted: false,
    priority: 'high',
    status: 'delivered',
    attachments: [
      {
        id: '1',
        name: 'resume_sarah_johnson.pdf',
        size: 2500000,
        type: 'application/pdf'
      },
      {
        id: '2', 
        name: 'portfolio_samples.zip',
        size: 15600000,
        type: 'application/zip'
      }
    ],
    jobTitle: 'Senior React Developer'
  },
  {
    id: '2',
    sender: { name: 'Mike Chen', handle: 'mike_designer' },
    recipient: { name: 'You', handle: 'demo_user' },
    subject: 'Logo Design Proposal',
    content: 'Thank you for considering my proposal for your logo design project. I\'ve attached some initial concepts based on your requirements. Looking forward to your feedback!',
    timestamp: '2024-01-14T14:20:00Z',
    read: true,
    starred: false,
    archived: false,
    deleted: false,
    priority: 'normal',
    status: 'read',
    attachments: [
      {
        id: '3',
        name: 'logo_concepts_v1.jpg',
        size: 3200000,
        type: 'image/jpeg'
      }
    ],
    jobTitle: 'Modern Logo Design'
  },
  {
    id: '3',
    sender: { name: 'Alex Rodriguez', handle: 'alexr_writer' },
    recipient: { name: 'You', handle: 'demo_user' },
    subject: 'Content Writing Project Update',
    content: 'Hi there! I wanted to give you an update on the blog posts. I\'ve completed the first 3 articles and they\'re ready for your review. The remaining 2 will be delivered by Friday.',
    timestamp: '2024-01-13T09:15:00Z',
    read: true,
    starred: false,
    archived: false,
    deleted: false,
    priority: 'normal',
    status: 'replied',
    attachments: [
      {
        id: '4',
        name: 'blog_articles_draft.docx',
        size: 890000,
        type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      }
    ],
    jobTitle: 'SEO Blog Content Writer'
  },
  {
    id: '4',
    sender: { name: 'Jessica Park', handle: 'jess_marketing' },
    recipient: { name: 'You', handle: 'demo_user' },
    subject: 'Marketing Strategy Consultation',
    content: 'I\'d love to help with your digital marketing strategy. I\'ve worked with similar startups and achieved great results. Can we set up a 30-minute discovery call this week?',
    timestamp: '2024-01-12T16:45:00Z',
    read: false,
    starred: false,
    archived: false,
    deleted: false,
    priority: 'urgent',
    status: 'sent',
    attachments: [],
    jobTitle: 'Digital Marketing Strategy'
  }
]

export default function MessagesPage() {
  const { isAuthenticated, user } = useAuth()
  const { addToast } = useToast()
  const [messages, setMessages] = useState<Message[]>(demoMessages)
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [filter, setFilter] = useState<'all' | 'unread' | 'starred' | 'archived'>('all')
  const [replyMessage, setReplyMessage] = useState('')
  const [attachedFiles, setAttachedFiles] = useState<File[]>([])
  const [showAttachments, setShowAttachments] = useState(false)

  // Redirect to sign in if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      window.location.href = '/auth/signin'
    }
  }, [isAuthenticated])

  const filteredMessages = messages.filter(message => {
    // Don't show deleted messages
    if (message.deleted) return false
    
    if (filter === 'unread' && message.read) return false
    if (filter === 'starred' && !message.starred) return false
    if (filter === 'archived' && !message.archived) return false
    if (filter === 'all' && message.archived) return false
    if (searchQuery && !message.subject.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !message.sender.name.toLowerCase().includes(searchQuery.toLowerCase())) return false
    return true
  })

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffHours = Math.abs(now.getTime() - date.getTime()) / 36e5

    if (diffHours < 1) {
      return 'Just now'
    } else if (diffHours < 24) {
      return `${Math.floor(diffHours)}h ago`
    } else {
      return date.toLocaleDateString()
    }
  }

  const toggleStar = (messageId: string) => {
    setMessages(messages.map(msg => 
      msg.id === messageId ? { ...msg, starred: !msg.starred } : msg
    ))
  }

  const markAsRead = (messageId: string) => {
    setMessages(messages.map(msg => 
      msg.id === messageId ? { ...msg, read: true } : msg
    ))
  }

  const handleMessageAction = (action: string, messageId: string, data?: any) => {
    setMessages(messages => messages.map(msg => {
      if (msg.id === messageId) {
        switch (action) {
          case 'star':
            addToast({
              type: 'success',
              title: msg.starred ? 'Unstarred' : 'Starred',
              description: `Message ${msg.starred ? 'removed from' : 'added to'} starred messages`,
              duration: 2000
            })
            return { ...msg, starred: !msg.starred }
          case 'archive':
            addToast({
              type: 'success',
              title: 'Archived',
              description: 'Message moved to archive',
              duration: 2000
            })
            return { ...msg, archived: true }
          case 'delete':
            addToast({
              type: 'success',
              title: 'Deleted',
              description: 'Message moved to trash',
              duration: 2000
            })
            // Clear selected message if it's the one being deleted
            if (selectedMessage?.id === messageId) {
              setSelectedMessage(null)
            }
            return { ...msg, deleted: true }
          case 'mark-unread':
            addToast({
              type: 'success',
              title: 'Marked as Unread',
              description: 'Message marked as unread',
              duration: 2000
            })
            return { ...msg, read: false }
          case 'priority':
            const priorityLabel = data === 'high' ? 'High' : data === 'urgent' ? 'Urgent' : 'Normal'
            addToast({
              type: 'success',
              title: 'Priority Updated',
              description: `Message priority set to ${priorityLabel}`,
              duration: 2000
            })
            return { ...msg, priority: data }
          case 'reply':
            // Focus reply textarea
            return msg
          default:
            return msg
        }
      }
      return msg
    }))
  }

  const handleAttachmentDownload = (attachment: Attachment) => {
    addToast({
      type: 'info',
      title: 'Download Started',
      description: `Downloading ${attachment.name}`,
      duration: 2000
    })
    // In a real app, this would trigger file download
    console.log('Downloading:', attachment)
  }

  const handleFilesSelected = (files: File[]) => {
    setAttachedFiles(files)
    addToast({
      type: 'success',
      title: 'Files Attached',
      description: `${files.length} file${files.length > 1 ? 's' : ''} attached to message`,
      duration: 2000
    })
  }

  const handleSendReply = () => {
    if (!replyMessage.trim() || !selectedMessage) return

    // In a real app, this would send the message to the server
    console.log('Sending reply:', replyMessage, 'Attachments:', attachedFiles)
    setReplyMessage('')
    setAttachedFiles([])
    setShowAttachments(false)
    
    // Show success feedback
    addToast({
      type: 'success',
      title: 'Reply Sent',
      description: 'Your reply has been sent successfully',
      duration: 3000
    })

    // Update message status
    setMessages(messages => messages.map(msg => 
      msg.id === selectedMessage.id ? { ...msg, status: 'replied' } : msg
    ))
  }

  if (!isAuthenticated) {
    return null // Will redirect via useEffect
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center space-x-3 mb-4">
              <div className="bg-gradient-to-br from-blue-600 to-blue-700 text-white p-3 rounded-xl shadow-lg">
                <MessageSquare className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-slate-100">Messages</h1>
                <p className="text-gray-600 dark:text-slate-300">
                  Communicate with clients and freelancers
                </p>
              </div>
            </div>
            
            {/* Demo Notice */}
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
              <p className="text-blue-800 dark:text-blue-200 text-sm">
                <strong>Demo Mode:</strong> This is a preview of the messaging system. In the full version, you'll be able to send and receive real messages with other users.
              </p>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Messages List */}
            <div className="lg:col-span-1">
              <Card className="h-full">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">Conversations</CardTitle>
                    <Badge variant="secondary" className="bg-blue-50 text-blue-700">
                      {messages.filter(m => !m.read).length} new
                    </Badge>
                  </div>
                  
                  {/* Search */}
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search messages..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  
                  {/* Filter Buttons */}
                  <div className="flex flex-wrap gap-2">
                    {(['all', 'unread', 'starred', 'archived'] as const).map((filterType) => (
                      <Button
                        key={filterType}
                        variant={filter === filterType ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setFilter(filterType)}
                        className="capitalize"
                      >
                        {filterType === 'all' ? 'All' : filterType}
                        {filterType === 'unread' && (
                          <Badge variant="secondary" className="ml-1 bg-blue-100 text-blue-700">
                            {messages.filter(m => !m.read && !m.deleted && !m.archived).length}
                          </Badge>
                        )}
                      </Button>
                    ))}
                  </div>
                </CardHeader>
                
                <CardContent className="p-0">
                  <div className="space-y-1">
                    {filteredMessages.map((message) => (
                      <div
                        key={message.id}
                        className={`p-4 border-b border-gray-100 dark:border-slate-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors ${
                          selectedMessage?.id === message.id ? 'bg-blue-50 dark:bg-blue-900/20 border-r-4 border-r-blue-500' : ''
                        } ${!message.read ? 'font-semibold' : ''}`}
                        onClick={() => {
                          setSelectedMessage(message)
                          if (!message.read) markAsRead(message.id)
                        }}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2 mb-1">
                              <div className="bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/40 dark:to-purple-900/40 p-1.5 rounded-full">
                                <User className="h-3 w-3 text-blue-600 dark:text-blue-400" />
                              </div>
                              <span className="text-sm font-medium text-gray-900 dark:text-slate-100 truncate">
                                {message.sender.name}
                              </span>
                              {!message.read && (
                                <div className="h-2 w-2 bg-blue-600 rounded-full" />
                              )}
                              <PriorityBadge priority={message.priority} />
                              {message.attachments.length > 0 && (
                                <Paperclip className="h-3 w-3 text-gray-400" />
                              )}
                            </div>
                            <p className="text-sm text-gray-900 dark:text-slate-100 truncate mb-1">
                              {message.subject}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-slate-400 truncate">
                              {message.content.substring(0, 60)}...
                            </p>
                            {message.jobTitle && (
                              <Badge variant="secondary" className="mt-1 text-xs">
                                {message.jobTitle}
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center space-x-1 ml-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                toggleStar(message.id)
                              }}
                              className="p-1 hover:bg-gray-200 dark:hover:bg-slate-700 rounded"
                            >
                              <Star className={`h-3 w-3 ${message.starred ? 'fill-yellow-400 text-yellow-400' : 'text-gray-400'}`} />
                            </button>
                            <span className="text-xs text-gray-400">
                              {formatTimestamp(message.timestamp)}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Message View */}
            <div className="lg:col-span-2">
              {selectedMessage ? (
                <Card className="h-full">
                  <CardHeader className="border-b border-gray-100 dark:border-slate-700">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center space-x-2 mb-2">
                          <CardTitle className="text-xl">{selectedMessage.subject}</CardTitle>
                          <PriorityBadge priority={selectedMessage.priority} />
                        </div>
                        <CardDescription className="mt-1">
                          From: {selectedMessage.sender.name} (@{selectedMessage.sender.handle})
                        </CardDescription>
                        <MessageStatusIndicator 
                          status={selectedMessage.status} 
                          timestamp={selectedMessage.timestamp} 
                        />
                        {selectedMessage.jobTitle && (
                          <Badge variant="outline" className="mt-2">
                            Related to: {selectedMessage.jobTitle}
                          </Badge>
                        )}
                      </div>
                      <MessageActions 
                        message={selectedMessage} 
                        onAction={handleMessageAction}
                      />
                    </div>
                  </CardHeader>
                  
                  <CardContent className="flex-1 p-6">
                    <div className="mb-6">
                      <div className="prose dark:prose-invert max-w-none">
                        <p className="text-gray-700 dark:text-slate-300 leading-relaxed">
                          {selectedMessage.content}
                        </p>
                      </div>
                      
                      {/* Attachments */}
                      <AttachmentViewer 
                        attachments={selectedMessage.attachments}
                        onDownload={handleAttachmentDownload}
                        onPreview={(attachment) => console.log('Preview:', attachment)}
                      />
                    </div>
                    
                    {/* Reply Section */}
                    <div className="border-t border-gray-100 dark:border-slate-700 pt-6">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-lg font-semibold">Reply</h3>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setShowAttachments(!showAttachments)}
                          className="text-gray-500 hover:text-gray-700"
                        >
                          <Paperclip className="h-4 w-4 mr-1" />
                          Attach Files
                        </Button>
                      </div>
                      
                      <Textarea
                        placeholder="Type your reply..."
                        value={replyMessage}
                        onChange={(e) => setReplyMessage(e.target.value)}
                        className="mb-4"
                        rows={4}
                      />

                      {/* File Attachment Section */}
                      {showAttachments && (
                        <div className="mb-4">
                          <FileUploader onFilesSelected={handleFilesSelected} className="mb-3" />
                          {attachedFiles.length > 0 && (
                            <div className="space-y-2">
                              <h4 className="text-sm font-medium text-gray-700">Attached Files:</h4>
                              <div className="flex flex-wrap gap-2">
                                {attachedFiles.map((file, index) => (
                                  <div key={index} className="flex items-center space-x-2 bg-gray-100 rounded-lg px-3 py-2">
                                    <Paperclip className="h-4 w-4 text-gray-500" />
                                    <span className="text-sm text-gray-700">{file.name}</span>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => setAttachedFiles(files => files.filter((_, i) => i !== index))}
                                      className="h-4 w-4 p-0 text-gray-500 hover:text-red-600"
                                    >
                                      <X className="h-3 w-3" />
                                    </Button>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                      
                      <div className="flex justify-between items-center">
                        <p className="text-sm text-gray-500 dark:text-slate-400">
                          Demo: Replies will be simulated
                        </p>
                        <div className="flex items-center space-x-2">
                          {showAttachments && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setShowAttachments(false)
                                setAttachedFiles([])
                              }}
                            >
                              Cancel
                            </Button>
                          )}
                          <Button 
                            onClick={handleSendReply}
                            disabled={!replyMessage.trim()}
                            className="bg-blue-600 hover:bg-blue-700"
                          >
                            <Send className="h-4 w-4 mr-2" />
                            Send Reply
                            {attachedFiles.length > 0 && (
                              <Badge variant="secondary" className="ml-2 bg-white/20">
                                {attachedFiles.length}
                              </Badge>
                            )}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card className="h-full">
                  <CardContent className="flex items-center justify-center h-full text-center py-12">
                    <div>
                      <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-100 mb-2">
                        No Message Selected
                      </h3>
                      <p className="text-gray-600 dark:text-slate-300">
                        Choose a conversation from the list to read messages
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
          
          {/* Quick Actions */}
          <div className="mt-8">
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid sm:grid-cols-3 gap-4">
                  <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2" asChild>
                    <Link href="/jobs">
                      <Search className="h-6 w-6" />
                      <span>Find Work</span>
                    </Link>
                  </Button>
                  <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2" asChild>
                    <Link href="/jobs/new">
                      <MessageSquare className="h-6 w-6" />
                      <span>Post Job</span>
                    </Link>
                  </Button>
                  <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2" asChild>
                    <Link href="/dashboard">
                      <User className="h-6 w-6" />
                      <span>Dashboard</span>
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