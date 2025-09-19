'use client'

export interface MessageThread {
  id: string
  participants: {
    id: string
    name: string
    handle: string
    avatar?: string
    isOnline: boolean
    lastSeen?: string
  }[]
  lastMessage: {
    id: string
    content: string
    senderId: string
    timestamp: string
    read: boolean
  }
  unreadCount: number
  jobId?: string
  jobTitle?: string
  createdAt: string
  updatedAt: string
}

export interface Message {
  id: string
  threadId: string
  senderId: string
  recipientId: string
  content: string
  attachments?: {
    id: string
    name: string
    type: string
    size: number
    url: string
  }[]
  readAt?: string
  timestamp: string
  editedAt?: string
  replyTo?: string
  metadata?: {
    jobId?: string
    proposalId?: string
    contractId?: string
    type: 'text' | 'system' | 'file' | 'proposal' | 'contract'
  }
}

export interface TypingIndicator {
  userId: string
  threadId: string
  timestamp: string
}

class MessagingService {
  private ws: WebSocket | null = null
  private messageCallbacks: ((message: Message) => void)[] = []
  private threadCallbacks: ((threads: MessageThread[]) => void)[] = []
  private typingCallbacks: ((typing: TypingIndicator[]) => void)[] = []
  private onlineCallbacks: ((users: { userId: string; isOnline: boolean }[]) => void)[] = []
  
  constructor() {
    this.connectWebSocket()
  }

  // WebSocket connection for real-time messaging
  private connectWebSocket() {
    try {
      // In production, this would be your WebSocket server
      const wsUrl = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:3001/ws'
      this.ws = new WebSocket(wsUrl)
      
      this.ws.onopen = () => {
        console.log('Connected to messaging WebSocket')
      }
      
      this.ws.onmessage = (event) => {
        const data = JSON.parse(event.data)
        this.handleWebSocketMessage(data)
      }
      
      this.ws.onclose = () => {
        console.log('WebSocket connection closed, attempting to reconnect...')
        setTimeout(() => this.connectWebSocket(), 5000)
      }
      
      this.ws.onerror = (error) => {
        console.error('WebSocket error:', error)
      }
    } catch (error) {
      console.log('WebSocket not available, using polling fallback')
      // Fallback to polling for demo
      this.startPolling()
    }
  }

  private startPolling() {
    // Poll for new messages every 10 seconds as fallback
    setInterval(() => {
      this.checkForNewMessages()
    }, 10000)
  }

  private async checkForNewMessages() {
    try {
      const response = await fetch('/api/messages/poll')
      if (response.ok) {
        const data = await response.json()
        if (data.newMessages) {
          data.newMessages.forEach((message: Message) => {
            this.messageCallbacks.forEach(callback => callback(message))
          })
        }
      }
    } catch (error) {
      console.error('Error polling for messages:', error)
    }
  }

  private handleWebSocketMessage(data: any) {
    switch (data.type) {
      case 'new_message':
        this.messageCallbacks.forEach(callback => callback(data.message))
        break
      case 'thread_update':
        this.threadCallbacks.forEach(callback => callback(data.threads))
        break
      case 'typing_indicator':
        this.typingCallbacks.forEach(callback => callback(data.typing))
        break
      case 'user_online':
        this.onlineCallbacks.forEach(callback => callback(data.users))
        break
    }
  }

  // Get message threads for a user
  async getThreads(userId: string): Promise<MessageThread[]> {
    try {
      const response = await fetch(`/api/messages/threads/${userId}`)
      if (!response.ok) throw new Error('Failed to fetch threads')
      return await response.json()
    } catch (error) {
      console.error('Error fetching threads:', error)
      return this.getDemoThreads(userId)
    }
  }

  // Get messages for a specific thread
  async getMessages(threadId: string, limit = 50, offset = 0): Promise<Message[]> {
    try {
      const response = await fetch(`/api/messages/${threadId}?limit=${limit}&offset=${offset}`)
      if (!response.ok) throw new Error('Failed to fetch messages')
      return await response.json()
    } catch (error) {
      console.error('Error fetching messages:', error)
      return this.getDemoMessages(threadId)
    }
  }

  // Send a new message
  async sendMessage(data: {
    threadId?: string
    recipientId: string
    content: string
    attachments?: File[]
    jobId?: string
    replyTo?: string
  }): Promise<Message> {
    try {
      const formData = new FormData()
      formData.append('recipientId', data.recipientId)
      formData.append('content', data.content)
      if (data.threadId) formData.append('threadId', data.threadId)
      if (data.jobId) formData.append('jobId', data.jobId)
      if (data.replyTo) formData.append('replyTo', data.replyTo)
      
      // Add attachments
      data.attachments?.forEach((file, index) => {
        formData.append(`attachment_${index}`, file)
      })

      const response = await fetch('/api/messages/send', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) throw new Error('Failed to send message')
      
      const message = await response.json()
      
      // Send via WebSocket if available
      if (this.ws && this.ws.readyState === WebSocket.OPEN) {
        this.ws.send(JSON.stringify({
          type: 'send_message',
          message
        }))
      }

      return message
    } catch (error) {
      console.error('Error sending message:', error)
      throw error
    }
  }

  // Mark messages as read
  async markAsRead(messageIds: string[]): Promise<void> {
    try {
      await fetch('/api/messages/mark-read', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messageIds })
      })
    } catch (error) {
      console.error('Error marking messages as read:', error)
    }
  }

  // Send typing indicator
  sendTypingIndicator(threadId: string) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({
        type: 'typing',
        threadId
      }))
    }
  }

  // Search messages
  async searchMessages(query: string, userId: string): Promise<Message[]> {
    try {
      const response = await fetch(`/api/messages/search?q=${encodeURIComponent(query)}&userId=${userId}`)
      if (!response.ok) throw new Error('Failed to search messages')
      return await response.json()
    } catch (error) {
      console.error('Error searching messages:', error)
      return []
    }
  }

  // Archive thread
  async archiveThread(threadId: string): Promise<void> {
    try {
      await fetch(`/api/messages/archive/${threadId}`, { method: 'POST' })
    } catch (error) {
      console.error('Error archiving thread:', error)
    }
  }

  // Delete thread
  async deleteThread(threadId: string): Promise<void> {
    try {
      await fetch(`/api/messages/delete/${threadId}`, { method: 'DELETE' })
    } catch (error) {
      console.error('Error deleting thread:', error)
    }
  }

  // Event listeners
  onNewMessage(callback: (message: Message) => void) {
    this.messageCallbacks.push(callback)
    return () => {
      this.messageCallbacks = this.messageCallbacks.filter(cb => cb !== callback)
    }
  }

  onThreadUpdate(callback: (threads: MessageThread[]) => void) {
    this.threadCallbacks.push(callback)
    return () => {
      this.threadCallbacks = this.threadCallbacks.filter(cb => cb !== callback)
    }
  }

  onTypingIndicator(callback: (typing: TypingIndicator[]) => void) {
    this.typingCallbacks.push(callback)
    return () => {
      this.typingCallbacks = this.typingCallbacks.filter(cb => cb !== callback)
    }
  }

  onUserOnline(callback: (users: { userId: string; isOnline: boolean }[]) => void) {
    this.onlineCallbacks.push(callback)
    return () => {
      this.onlineCallbacks = this.onlineCallbacks.filter(cb => cb !== callback)
    }
  }

  // Demo data generators
  private getDemoThreads(userId: string): MessageThread[] {
    return [
      {
        id: 'thread_1',
        participants: [
          {
            id: userId,
            name: 'You',
            handle: 'demo_user',
            isOnline: true
          },
          {
            id: 'user_2',
            name: 'Sarah Johnson',
            handle: 'sarah_dev',
            isOnline: true,
            lastSeen: new Date().toISOString()
          }
        ],
        lastMessage: {
          id: 'msg_1',
          content: 'When can we start the project?',
          senderId: 'user_2',
          timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
          read: false
        },
        unreadCount: 2,
        jobId: 'job_1',
        jobTitle: 'React Developer Position',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
        updatedAt: new Date(Date.now() - 1000 * 60 * 15).toISOString()
      },
      {
        id: 'thread_2',
        participants: [
          {
            id: userId,
            name: 'You',
            handle: 'demo_user',
            isOnline: true
          },
          {
            id: 'user_3',
            name: 'Mike Chen',
            handle: 'mike_designer',
            isOnline: false,
            lastSeen: new Date(Date.now() - 1000 * 60 * 60).toISOString()
          }
        ],
        lastMessage: {
          id: 'msg_2',
          content: 'I\'ve completed the mockups for review',
          senderId: 'user_3',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
          read: true
        },
        unreadCount: 0,
        jobId: 'job_2',
        jobTitle: 'UI/UX Design Project',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
        updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString()
      }
    ]
  }

  private getDemoMessages(threadId: string): Message[] {
    const baseTime = Date.now() - 1000 * 60 * 60 * 24 // 24 hours ago
    
    return [
      {
        id: 'msg_1',
        threadId,
        senderId: 'user_2',
        recipientId: 'demo_user',
        content: 'Hi! I saw your job posting for a React developer. I have 5 years of experience with React and Next.js.',
        timestamp: new Date(baseTime).toISOString(),
        metadata: { type: 'text' }
      },
      {
        id: 'msg_2',
        threadId,
        senderId: 'demo_user',
        recipientId: 'user_2',
        content: 'Great! Could you share some examples of your recent work?',
        timestamp: new Date(baseTime + 1000 * 60 * 30).toISOString(),
        readAt: new Date(baseTime + 1000 * 60 * 32).toISOString(),
        metadata: { type: 'text' }
      },
      {
        id: 'msg_3',
        threadId,
        senderId: 'user_2',
        recipientId: 'demo_user',
        content: 'Absolutely! Here are some projects I\'ve worked on recently.',
        attachments: [
          {
            id: 'att_1',
            name: 'portfolio.pdf',
            type: 'application/pdf',
            size: 2048576,
            url: '/demo/portfolio.pdf'
          }
        ],
        timestamp: new Date(baseTime + 1000 * 60 * 45).toISOString(),
        readAt: new Date(baseTime + 1000 * 60 * 47).toISOString(),
        metadata: { type: 'file' }
      },
      {
        id: 'msg_4',
        threadId,
        senderId: 'user_2',
        recipientId: 'demo_user',
        content: 'When can we start the project?',
        timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
        metadata: { type: 'text' }
      }
    ]
  }

  // Cleanup
  disconnect() {
    if (this.ws) {
      this.ws.close()
      this.ws = null
    }
  }
}

export const messagingService = new MessagingService()