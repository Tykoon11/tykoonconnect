'use client'

import { useState, useEffect } from 'react'
import { useToast } from '@/components/ui/toast'

interface Agreement {
  id: string
  jobTitle: string
  freelancerName: string
  freelancerHandle: string
  freelancerAvatarUrl?: string
  clientName: string
  completedAt: string
  priceTotal: number
}

interface ReviewData {
  rating: number
  comment: string
  agreementId: string
  revieweeId: string
}

interface UseMandatoryReviewReturn {
  pendingReviews: Agreement[]
  isLoading: boolean
  submitReview: (review: ReviewData) => Promise<void>
  refreshPendingReviews: () => Promise<void>
  showReviewModal: boolean
  currentReviewAgreement: Agreement | null
  openReviewModal: (agreement: Agreement) => void
  closeReviewModal: () => void
}

export function useMandatoryReview(): UseMandatoryReviewReturn {
  const [pendingReviews, setPendingReviews] = useState<Agreement[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showReviewModal, setShowReviewModal] = useState(false)
  const [currentReviewAgreement, setCurrentReviewAgreement] = useState<Agreement | null>(null)
  const { addToast } = useToast()

  const fetchPendingReviews = async () => {
    try {
      setIsLoading(true)
      
      // In demo mode or when API is not ready, return mock data
      const mockAgreements: Agreement[] = [
        {
          id: 'agreement_1',
          jobTitle: 'Modern E-commerce Website Development',
          freelancerName: 'Alex Rodriguez',
          freelancerHandle: 'alex_dev',
          freelancerAvatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
          clientName: 'Sarah Johnson',
          completedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
          priceTotal: 250000 // $2,500
        },
        {
          id: 'agreement_2',
          jobTitle: 'Mobile App UI/UX Design',
          freelancerName: 'Emma Chen',
          freelancerHandle: 'emma_design',
          freelancerAvatarUrl: 'https://images.unsplash.com/photo-1494790108755-2616b96d2019?w=150&h=150&fit=crop&crop=face',
          clientName: 'Sarah Johnson',
          completedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
          priceTotal: 180000 // $1,800
        }
      ]

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800))
      
      setPendingReviews(mockAgreements)
      
      // Auto-trigger review modal for the most recent completion if there are pending reviews
      if (mockAgreements.length > 0 && !showReviewModal) {
        const mostRecent = mockAgreements.sort((a, b) => 
          new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime()
        )[0]
        
        // Only auto-show for very recent completions (within 24 hours)
        const hoursAgo = (Date.now() - new Date(mostRecent.completedAt).getTime()) / (1000 * 60 * 60)
        if (hoursAgo < 24) {
          setTimeout(() => {
            openReviewModal(mostRecent)
          }, 1000)
        }
      }
      
    } catch (error) {
      console.error('Error fetching pending reviews:', error)
      addToast({
        type: 'error',
        title: 'Error Loading Reviews',
        description: 'Unable to load pending reviews. Please try again.',
        duration: 5000
      })
    } finally {
      setIsLoading(false)
    }
  }

  const submitReview = async (reviewData: ReviewData) => {
    try {
      const response = await fetch(`/api/agreements/${reviewData.agreementId}/review`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reviewData),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to submit review')
      }

      const result = await response.json()
      
      // Remove the reviewed agreement from pending reviews
      setPendingReviews(prev => prev.filter(agreement => agreement.id !== reviewData.agreementId))
      
      addToast({
        type: 'success',
        title: 'Review Submitted Successfully',
        description: 'Thank you for your feedback! Your review helps maintain platform quality.',
        duration: 5000
      })

      return result.review
      
    } catch (error) {
      console.error('Error submitting review:', error)
      addToast({
        type: 'error',
        title: 'Review Submission Failed',
        description: error instanceof Error ? error.message : 'Please try again later.',
        duration: 5000
      })
      throw error
    }
  }

  const openReviewModal = (agreement: Agreement) => {
    setCurrentReviewAgreement(agreement)
    setShowReviewModal(true)
  }

  const closeReviewModal = () => {
    setShowReviewModal(false)
    setCurrentReviewAgreement(null)
  }

  const refreshPendingReviews = async () => {
    await fetchPendingReviews()
  }

  useEffect(() => {
    fetchPendingReviews()
  }, [])

  return {
    pendingReviews,
    isLoading,
    submitReview,
    refreshPendingReviews,
    showReviewModal,
    currentReviewAgreement,
    openReviewModal,
    closeReviewModal
  }
}