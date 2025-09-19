'use client'

import { useState, useMemo, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { AssuranceBadge } from '@/components/assurance-badge'
import { MapPin, Clock, DollarSign, Users, Search, X, Filter } from 'lucide-react'
import { JOB_CATEGORIES, BUDGET_RANGES, PROJECT_DURATIONS, EXPERIENCE_LEVELS, getAllSkills, searchSkills } from '@/lib/job-categories'
import { AdvancedJobSearch } from '@/components/advanced-job-search'
import Link from 'next/link'

// Demo jobs data for preview (replace with database when configured)
const demoJobs = [
  {
    id: '1',
    title: 'E-commerce Website Development',
    description: 'Looking for a full-stack developer to build a modern e-commerce website using React and Node.js. The site needs to handle payments, inventory management, and user accounts.',
    skills: ['React', 'Node.js', 'PostgreSQL', 'Stripe Integration'],
    budgetType: 'fixed',
    budgetAmount: 5000,
    positionsTotal: 2,
    positionsFilled: 0,
    assuranceHint: 'MILESTONE_INVOICE' as const,
    createdAt: new Date('2024-09-10'),
    client: {
      name: 'Alice Johnson',
      handle: 'alicej',
      location: 'San Francisco, CA',
      ratingAverage: 4.8,
      ratingCount: 12,
      preferredAssurance: 'MILESTONE_INVOICE' as const,
      alsoAccepts: ['EXTERNAL_ESCROW' as const]
    },
    _count: { proposals: 8 }
  },
  {
    id: '2',
    title: 'Brand Identity Design Package',
    description: 'Need a complete brand identity package including logo design, color palette, typography, and brand guidelines for a tech startup.',
    skills: ['Logo Design', 'Brand Identity', 'Adobe Illustrator', 'Figma'],
    budgetType: 'fixed',
    budgetAmount: 2500,
    positionsTotal: 1,
    positionsFilled: 0,
    assuranceHint: 'EXTERNAL_ESCROW' as const,
    createdAt: new Date('2024-09-11'),
    client: {
      name: 'Bob Wilson',
      handle: 'bobw',
      location: 'Austin, TX',
      ratingAverage: 4.9,
      ratingCount: 24,
      preferredAssurance: 'EXTERNAL_ESCROW' as const,
      alsoAccepts: ['CARD_HOLD' as const, 'MILESTONE_INVOICE' as const]
    },
    _count: { proposals: 3 }
  },
  {
    id: '3',
    title: 'Mobile App UI/UX Design',
    description: 'Design user interface and experience for a fitness tracking mobile app. Need wireframes, high-fidelity mockups, and interactive prototypes.',
    skills: ['Mobile Design', 'UI/UX', 'Figma', 'Prototyping'],
    budgetType: 'fixed',
    budgetAmount: 3500,
    positionsTotal: 1,
    positionsFilled: 0,
    assuranceHint: 'CARD_HOLD' as const,
    createdAt: new Date('2024-09-09'),
    client: {
      name: 'Carol Davis',
      handle: 'carold',
      location: 'New York, NY',
      ratingAverage: 4.7,
      ratingCount: 15,
      preferredAssurance: 'CARD_HOLD' as const,
      alsoAccepts: ['MILESTONE_INVOICE' as const]
    },
    _count: { proposals: 12 }
  },
  {
    id: '4',
    title: 'WordPress Website Development',
    description: 'Build a professional website for a law firm using WordPress. Need custom theme, contact forms, and SEO optimization.',
    skills: ['WordPress', 'PHP', 'CSS', 'SEO'],
    budgetType: 'fixed',
    budgetAmount: 1200,
    positionsTotal: 1,
    positionsFilled: 0,
    assuranceHint: 'MILESTONE_INVOICE' as const,
    createdAt: new Date('2024-09-08'),
    client: {
      name: 'David Smith',
      handle: 'davids',
      location: 'Chicago, IL',
      ratingAverage: 4.6,
      ratingCount: 8,
      preferredAssurance: 'MILESTONE_INVOICE' as const,
      alsoAccepts: ['EXTERNAL_ESCROW' as const]
    },
    _count: { proposals: 5 }
  },
  {
    id: '5',
    title: 'Data Analysis & Visualization',
    description: 'Analyze sales data and create interactive dashboards using Python and Tableau. Need to identify trends and provide insights.',
    skills: ['Python', 'Tableau', 'Data Analysis', 'SQL'],
    budgetType: 'hourly',
    budgetAmount: 75,
    positionsTotal: 3,
    positionsFilled: 1,
    assuranceHint: 'EXTERNAL_ESCROW' as const,
    createdAt: new Date('2024-09-07'),
    client: {
      name: 'Emma Wilson',
      handle: 'emmaw',
      location: 'Seattle, WA',
      ratingAverage: 4.9,
      ratingCount: 32,
      preferredAssurance: 'EXTERNAL_ESCROW' as const,
      alsoAccepts: ['CARD_HOLD' as const]
    },
    _count: { proposals: 15 }
  },
  {
    id: '6',
    title: 'Content Writing for Tech Blog',
    description: 'Write 10 high-quality articles about web development topics. Each article should be 1500-2000 words with SEO optimization.',
    skills: ['Content Writing', 'SEO', 'Web Development', 'Technical Writing'],
    budgetType: 'fixed',
    budgetAmount: 800,
    positionsTotal: 1,
    positionsFilled: 1,
    assuranceHint: 'CARD_HOLD' as const,
    createdAt: new Date('2024-09-06'),
    client: {
      name: 'Frank Miller',
      handle: 'frankm',
      location: 'Denver, CO',
      ratingAverage: 4.4,
      ratingCount: 6,
      preferredAssurance: 'CARD_HOLD' as const,
      alsoAccepts: ['MILESTONE_INVOICE' as const]
    },
    _count: { proposals: 7 }
  },
  {
    id: '7',
    title: 'React Native Mobile App',
    description: 'Develop a cross-platform mobile app for food delivery. Need full functionality including user authentication, payments, and real-time tracking.',
    skills: ['React Native', 'JavaScript', 'Firebase', 'Payment Integration'],
    budgetType: 'fixed',
    budgetAmount: 8000,
    positionsTotal: 1,
    positionsFilled: 0,
    assuranceHint: 'EXTERNAL_ESCROW' as const,
    createdAt: new Date('2024-09-05'),
    client: {
      name: 'Grace Chen',
      handle: 'gracec',
      location: 'Los Angeles, CA',
      ratingAverage: 4.8,
      ratingCount: 18,
      preferredAssurance: 'EXTERNAL_ESCROW' as const,
      alsoAccepts: ['MILESTONE_INVOICE' as const]
    },
    _count: { proposals: 22 }
  }
]

export default function JobsPage() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => setIsLoading(false), 1000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      <div className="container mx-auto px-4 py-8">
        <AdvancedJobSearch 
          jobs={demoJobs} 
          isLoading={isLoading}
          onJobView={(jobId) => console.log('View job:', jobId)}
          onJobSave={(jobId) => console.log('Save job:', jobId)}
        />
      </div>
    </div>
  )
}