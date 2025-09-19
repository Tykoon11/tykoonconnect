'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Star, AlertTriangle, CheckCircle, User } from 'lucide-react'
import { useToast } from '@/components/ui/toast'
import { DEMO_MODE } from '@/lib/prisma'

interface ReviewModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (review: ReviewData) => Promise<void>
  agreement: {
    id: string
    jobTitle: string
    freelancerName: string
    freelancerHandle: string
    freelancerAvatarUrl?: string
    clientName: string
    completedAt: string
    priceTotal: number
  }
  userRole: 'client' | 'freelancer'
}

interface ReviewData {
  rating: number
  comment: string
  agreementId: string
  revieweeId: string
}

export function ReviewModal({ isOpen, onClose, onSubmit, agreement, userRole }: ReviewModalProps) {
  const [rating, setRating] = useState(0)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [comment, setComment] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showWarning, setShowWarning] = useState(false)
  const { addToast } = useToast()

  const targetUser = userRole === 'client' 
    ? { name: agreement.freelancerName, handle: agreement.freelancerHandle, avatar: agreement.freelancerAvatarUrl }
    : { name: agreement.clientName, handle: 'client', avatar: undefined }

  const handleRatingClick = (selectedRating: number) => {
    setRating(selectedRating)
    setShowWarning(false)
  }

  const handleSubmit = async () => {
    if (rating === 0) {
      setShowWarning(true)
      addToast({
        type: 'error',
        title: 'Rating Required',
        description: 'Please select a star rating before submitting.',
        duration: 3000
      })
      return
    }

    if (comment.trim().length < 10) {
      addToast({
        type: 'error',
        title: 'Comment Too Short',
        description: 'Please write at least 10 characters in your review.',
        duration: 3000
      })
      return
    }

    setIsSubmitting(true)
    
    try {
      const reviewData: ReviewData = {
        rating,
        comment: comment.trim(),
        agreementId: agreement.id,
        revieweeId: userRole === 'client' ? agreement.freelancerHandle : 'client-id'
      }

      await onSubmit(reviewData)
      
      addToast({
        type: 'success',
        title: 'Review Submitted',
        description: 'Thank you for your feedback! Your review has been submitted.',
        duration: 5000
      })
      
      // Reset form
      setRating(0)
      setComment('')
      onClose()
      
    } catch (error) {
      addToast({
        type: 'error',
        title: 'Submission Failed',
        description: 'Failed to submit review. Please try again.',
        duration: 5000
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount / 100)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase()
  }

  const renderStars = () => {
    return Array.from({ length: 5 }, (_, i) => {
      const starValue = i + 1
      const isActive = starValue <= (hoveredRating || rating)
      
      return (
        <button
          key={i}
          type="button"
          className={`text-2xl transition-all duration-200 ${
            isActive 
              ? 'text-yellow-400 scale-110 drop-shadow-sm' 
              : 'text-gray-300 hover:text-yellow-200'
          }`}
          onClick={() => handleRatingClick(starValue)}
          onMouseEnter={() => setHoveredRating(starValue)}
          onMouseLeave={() => setHoveredRating(0)}
        >
          <Star className={`h-8 w-8 ${isActive ? 'fill-current' : ''}`} />
        </button>
      )
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="max-w-2xl" hideCloseButton>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-xl">
            <CheckCircle className="h-6 w-6 text-green-600" />
            Project Completed - Review Required
          </DialogTitle>
        </DialogHeader>

        {/* Project Summary */}
        <div className="bg-gray-50 dark:bg-slate-800 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-lg text-gray-900 dark:text-slate-100 mb-2">
            {agreement.jobTitle}
          </h3>
          <div className="flex items-center justify-between text-sm text-gray-600 dark:text-slate-400">
            <span>Completed: {formatDate(agreement.completedAt)}</span>
            <Badge className="bg-green-100 text-green-700">
              {formatAmount(agreement.priceTotal)}
            </Badge>
          </div>
        </div>

        {/* User Being Reviewed */}
        <div className="flex items-center gap-4 mb-6">
          <Avatar className="h-16 w-16">
            <AvatarImage src={targetUser.avatar} alt={targetUser.name} />
            <AvatarFallback className="text-lg bg-gradient-to-r from-blue-500 to-purple-500 text-white">
              {getInitials(targetUser.name)}
            </AvatarFallback>
          </Avatar>
          <div>
            <h4 className="text-lg font-semibold text-gray-900 dark:text-slate-100">
              Rate your experience with {targetUser.name}
            </h4>
            <p className="text-gray-600 dark:text-slate-400">
              @{targetUser.handle} • {userRole === 'client' ? 'Freelancer' : 'Client'}
            </p>
          </div>
        </div>

        {/* Warning Message */}
        <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800 rounded-lg p-4 mb-6">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm">
              <p className="font-medium text-amber-800 dark:text-amber-200 mb-1">
                Review Required to Complete Project
              </p>
              <p className="text-amber-700 dark:text-amber-300">
                This review is mandatory to close the project and helps maintain platform quality. 
                Your honest feedback helps other users make informed decisions.
              </p>
            </div>
          </div>
        </div>

        {/* Rating */}
        <div className="mb-6">
          <Label className="text-base font-semibold mb-4 block">
            How would you rate this collaboration? *
          </Label>
          <div className="flex justify-center gap-2 mb-4">
            {renderStars()}
          </div>
          <div className="text-center text-sm text-gray-600 dark:text-slate-400">
            {rating > 0 && (
              <span className="font-medium">
                {rating === 5 && 'Excellent!'}
                {rating === 4 && 'Very Good'}
                {rating === 3 && 'Good'}
                {rating === 2 && 'Fair'}
                {rating === 1 && 'Poor'}
              </span>
            )}
          </div>
          {showWarning && (
            <p className="text-red-600 text-sm text-center mt-2">
              Please select a rating to continue
            </p>
          )}
        </div>

        {/* Comment */}
        <div className="mb-6">
          <Label htmlFor="comment" className="text-base font-semibold mb-2 block">
            Share your feedback *
          </Label>
          <Textarea
            id="comment"
            placeholder={`Describe your experience working with ${targetUser.name}. What went well? What could be improved? Your detailed feedback helps the community.`}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={5}
            className="resize-none"
          />
          <div className="flex justify-between items-center mt-2">
            <p className="text-sm text-gray-600 dark:text-slate-400">
              Minimum 10 characters required
            </p>
            <span className={`text-sm ${comment.length >= 10 ? 'text-green-600' : 'text-gray-400'}`}>
              {comment.length}/500
            </span>
          </div>
        </div>

        {/* Guidelines */}
        <div className="bg-blue-50 dark:bg-blue-900/10 rounded-lg p-4 mb-6">
          <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
            Review Guidelines
          </h4>
          <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
            <li>• Be honest and constructive in your feedback</li>
            <li>• Focus on the work quality and communication</li>
            <li>• Keep it professional and respectful</li>
            <li>• Help other users make informed decisions</li>
          </ul>
        </div>

        <DialogFooter className="flex items-center justify-between">
          <div className="text-sm text-gray-600 dark:text-slate-400">
            * Required fields
          </div>
          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                addToast({
                  type: 'error',
                  title: 'Review Required',
                  description: 'You must submit a review to complete this project.',
                  duration: 5000
                })
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting || rating === 0 || comment.trim().length < 10}
              className="px-8"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Review'}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}