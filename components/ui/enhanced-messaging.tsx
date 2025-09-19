'use client'

import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { useToast } from '@/components/ui/toast'
import {
  Archive,
  Trash2,
  MoreHorizontal,
  Star,
  Reply,
  Forward,
  Download,
  Paperclip,
  Send,
  X,
  FileText,
  Image as ImageIcon,
  File,
  Eye,
  Flag,
  Clock,
  CheckCircle,
  AlertCircle,
  Plus
} from 'lucide-react'

interface Attachment {
  id: string
  name: string
  size: number
  type: string
  url?: string
  preview?: string
}

interface EnhancedMessage {
  id: string
  sender: {
    name: string
    handle: string
    avatar?: string
  }
  recipient: {
    name: string
    handle: string
    avatar?: string
  }
  subject: string
  content: string
  timestamp: string
  read: boolean
  starred: boolean
  archived: boolean
  deleted: boolean
  priority: 'low' | 'normal' | 'high' | 'urgent'
  attachments: Attachment[]
  jobTitle?: string
  status: 'sent' | 'delivered' | 'read' | 'replied'
}

interface MessageActionsProps {
  message: EnhancedMessage
  onAction: (action: string, messageId: string, data?: any) => void
  className?: string
}

export function MessageActions({ message, onAction, className }: MessageActionsProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  
  const handleDelete = () => {
    onAction('delete', message.id)
    setShowDeleteDialog(false)
  }

  return (
    <>
      <div className={`flex items-center space-x-1 ${className}`}>
        {/* Star Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onAction('star', message.id)}
          className={message.starred ? 'text-yellow-500' : 'text-gray-400'}
        >
          <Star className={`h-4 w-4 ${message.starred ? 'fill-current' : ''}`} />
        </Button>

        {/* Archive Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onAction('archive', message.id)}
          className="text-gray-500 hover:text-gray-700"
        >
          <Archive className="h-4 w-4" />
        </Button>

        {/* Delete Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowDeleteDialog(true)}
          className="text-gray-500 hover:text-red-600"
        >
          <Trash2 className="h-4 w-4" />
        </Button>

        {/* More Actions Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="text-gray-500">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuItem onClick={() => onAction('reply', message.id)}>
              <Reply className="h-4 w-4 mr-2" />
              Reply
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onAction('forward', message.id)}>
              <Forward className="h-4 w-4 mr-2" />
              Forward
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => onAction('mark-unread', message.id)}>
              <Eye className="h-4 w-4 mr-2" />
              Mark as Unread
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onAction('flag', message.id)}>
              <Flag className="h-4 w-4 mr-2" />
              Report Message
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => onAction('priority', message.id, 'high')}>
              <AlertCircle className="h-4 w-4 mr-2" />
              Mark High Priority
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Message</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this message? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete Message
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

interface AttachmentViewerProps {
  attachments: Attachment[]
  onDownload: (attachment: Attachment) => void
  onPreview?: (attachment: Attachment) => void
}

export function AttachmentViewer({ attachments, onDownload, onPreview }: AttachmentViewerProps) {
  if (!attachments || attachments.length === 0) return null

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return <ImageIcon className="h-6 w-6 text-blue-500" />
    if (type.includes('pdf') || type.includes('document')) return <FileText className="h-6 w-6 text-red-500" />
    return <File className="h-6 w-6 text-gray-500" />
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <div className="border-t pt-4 mt-4">
      <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
        <Paperclip className="h-4 w-4 mr-2" />
        Attachments ({attachments.length})
      </h4>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {attachments.map((attachment) => (
          <Card key={attachment.id} className="p-3">
            <div className="flex items-center space-x-3">
              {getFileIcon(attachment.type)}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {attachment.name}
                </p>
                <p className="text-xs text-gray-500">
                  {formatFileSize(attachment.size)}
                </p>
              </div>
              <div className="flex items-center space-x-1">
                {onPreview && attachment.type.startsWith('image/') && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onPreview(attachment)}
                    className="text-gray-500"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDownload(attachment)}
                  className="text-gray-500"
                >
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}

interface FileUploaderProps {
  onFilesSelected: (files: File[]) => void
  maxFiles?: number
  maxSizePerFile?: number
  acceptedTypes?: string[]
  className?: string
}

export function FileUploader({ 
  onFilesSelected, 
  maxFiles = 5, 
  maxSizePerFile = 10 * 1024 * 1024, // 10MB
  acceptedTypes = ['.pdf', '.doc', '.docx', '.jpg', '.jpeg', '.png', '.gif', '.txt'],
  className 
}: FileUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [dragActive, setDragActive] = useState(false)
  const { addToast } = useToast()

  const validateFiles = (files: FileList | File[]): File[] => {
    const validFiles: File[] = []
    const fileArray = Array.from(files)

    for (const file of fileArray) {
      // Check file size
      if (file.size > maxSizePerFile) {
        addToast({
          type: 'error',
          title: 'File Too Large',
          description: `${file.name} exceeds the ${maxSizePerFile / (1024 * 1024)}MB limit`,
          duration: 4000
        })
        continue
      }

      // Check file type
      const extension = '.' + file.name.split('.').pop()?.toLowerCase()
      if (acceptedTypes.length && !acceptedTypes.includes(extension)) {
        addToast({
          type: 'error',
          title: 'Invalid File Type',
          description: `${file.name} is not a supported file type`,
          duration: 4000
        })
        continue
      }

      validFiles.push(file)
    }

    return validFiles.slice(0, maxFiles)
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const validFiles = validateFiles(e.dataTransfer.files)
      if (validFiles.length > 0) {
        onFilesSelected(validFiles)
      }
    }
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const validFiles = validateFiles(e.target.files)
      if (validFiles.length > 0) {
        onFilesSelected(validFiles)
      }
    }
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div className={className}>
      <div
        className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          dragActive 
            ? 'border-blue-400 bg-blue-50' 
            : 'border-gray-300 hover:border-gray-400'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={acceptedTypes.join(',')}
          onChange={handleFileInput}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        <div className="space-y-2">
          <Paperclip className="h-8 w-8 text-gray-400 mx-auto" />
          <div>
            <p className="text-sm text-gray-600">
              <span className="font-medium text-blue-600 hover:text-blue-500 cursor-pointer">
                Click to upload
              </span>{' '}
              or drag and drop
            </p>
            <p className="text-xs text-gray-500">
              {acceptedTypes.join(', ')} up to {maxSizePerFile / (1024 * 1024)}MB each
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

interface MessageStatusIndicatorProps {
  status: EnhancedMessage['status']
  timestamp: string
}

export function MessageStatusIndicator({ status, timestamp }: MessageStatusIndicatorProps) {
  const getStatusIcon = () => {
    switch (status) {
      case 'sent':
        return <Clock className="h-3 w-3 text-gray-400" />
      case 'delivered':
        return <CheckCircle className="h-3 w-3 text-blue-500" />
      case 'read':
        return <CheckCircle className="h-3 w-3 text-green-500" />
      case 'replied':
        return <Reply className="h-3 w-3 text-blue-600" />
      default:
        return <Clock className="h-3 w-3 text-gray-400" />
    }
  }

  const getStatusText = () => {
    switch (status) {
      case 'sent':
        return 'Sent'
      case 'delivered':
        return 'Delivered'
      case 'read':
        return 'Read'
      case 'replied':
        return 'Replied'
      default:
        return 'Sent'
    }
  }

  return (
    <div className="flex items-center space-x-1 text-xs text-gray-500">
      {getStatusIcon()}
      <span>{getStatusText()}</span>
      <span>•</span>
      <span>{new Date(timestamp).toLocaleString()}</span>
    </div>
  )
}

export function PriorityBadge({ priority }: { priority: EnhancedMessage['priority'] }) {
  if (priority === 'normal') return null

  const getConfig = () => {
    switch (priority) {
      case 'high':
        return { color: 'bg-orange-100 text-orange-800', label: 'High Priority' }
      case 'urgent':
        return { color: 'bg-red-100 text-red-800', label: 'Urgent' }
      case 'low':
        return { color: 'bg-gray-100 text-gray-800', label: 'Low Priority' }
      default:
        return null
    }
  }

  const config = getConfig()
  if (!config) return null

  return (
    <Badge variant="secondary" className={`${config.color} text-xs`}>
      {config.label}
    </Badge>
  )
}