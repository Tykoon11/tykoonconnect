'use client'

import { useState, useMemo, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { AssuranceBadge } from '@/components/assurance-badge'
import { LoadingCard } from '@/components/ui/loading-spinner'
import { 
  MapPin, 
  Clock, 
  DollarSign, 
  Users, 
  Search, 
  X, 
  Filter,
  SlidersHorizontal,
  BookmarkPlus,
  Heart,
  Eye,
  TrendingUp,
  Star,
  ChevronDown,
  Calendar
} from 'lucide-react'
import { JOB_CATEGORIES, BUDGET_RANGES, EXPERIENCE_LEVELS } from '@/lib/job-categories'
import Link from 'next/link'

interface JobSearchProps {
  jobs: any[]
  isLoading?: boolean
  onJobView?: (jobId: string) => void
  onJobSave?: (jobId: string) => void
}

interface SavedJob {
  id: string
  savedAt: Date
}

export function AdvancedJobSearch({ jobs, isLoading = false, onJobView, onJobSave }: JobSearchProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedSkills, setSelectedSkills] = useState<string[]>([])
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [budgetFilter, setBudgetFilter] = useState('all')
  const [projectTypeFilter, setProjectTypeFilter] = useState('all')
  const [experienceFilter, setExperienceFilter] = useState('all')
  const [locationFilter, setLocationFilter] = useState('')
  const [sortBy, setSortBy] = useState('newest')
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list')
  const [showFilters, setShowFilters] = useState(false)
  const [savedJobs, setSavedJobs] = useState<SavedJob[]>([])
  const [skillSearchTerm, setSkillSearchTerm] = useState('')
  const [showSkillDropdown, setShowSkillDropdown] = useState(false)
  
  const skillDropdownRef = useRef<HTMLDivElement>(null)

  // Mock skill suggestions (in real app, this would come from an API)
  const skillSuggestions = useMemo(() => {
    if (!skillSearchTerm) return []
    const allSkills = [
      'React', 'Node.js', 'Python', 'JavaScript', 'TypeScript', 'Vue.js', 'Angular',
      'UI/UX', 'Figma', 'Photoshop', 'Illustrator', 'WordPress', 'Shopify',
      'Data Analysis', 'Machine Learning', 'SEO', 'Content Writing', 'Copywriting'
    ]
    return allSkills
      .filter(skill => 
        skill.toLowerCase().includes(skillSearchTerm.toLowerCase()) &&
        !selectedSkills.includes(skill)
      )
      .slice(0, 6)
  }, [skillSearchTerm, selectedSkills])

  // Click outside to close dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (skillDropdownRef.current && !skillDropdownRef.current.contains(event.target as Node)) {
        setShowSkillDropdown(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const clearFilters = () => {
    setSearchTerm('')
    setSelectedSkills([])
    setCategoryFilter('all')
    setBudgetFilter('all')
    setProjectTypeFilter('all')
    setExperienceFilter('all')
    setLocationFilter('')
    setSortBy('newest')
  }

  const addSkill = (skill: string) => {
    if (!selectedSkills.includes(skill)) {
      setSelectedSkills(prev => [...prev, skill])
    }
    setSkillSearchTerm('')
    setShowSkillDropdown(false)
  }

  const removeSkill = (skillToRemove: string) => {
    setSelectedSkills(prev => prev.filter(skill => skill !== skillToRemove))
  }

  const toggleSaveJob = (jobId: string) => {
    setSavedJobs(prev => {
      const isAlreadySaved = prev.some(saved => saved.id === jobId)
      if (isAlreadySaved) {
        return prev.filter(saved => saved.id !== jobId)
      } else {
        return [...prev, { id: jobId, savedAt: new Date() }]
      }
    })
    onJobSave?.(jobId)
  }

  const isJobSaved = (jobId: string) => savedJobs.some(saved => saved.id === jobId)

  const hasActiveFilters = searchTerm || selectedSkills.length > 0 || 
    (categoryFilter && categoryFilter !== 'all') || 
    (budgetFilter && budgetFilter !== 'all') || 
    (projectTypeFilter && projectTypeFilter !== 'all') || 
    (experienceFilter && experienceFilter !== 'all') ||
    locationFilter || sortBy !== 'newest'

  const filteredJobs = useMemo(() => {
    let filtered = jobs.filter(job => {
      const searchMatch = !searchTerm || 
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.skills?.some((skill: string) => skill.toLowerCase().includes(searchTerm.toLowerCase()))

      const skillsMatch = selectedSkills.length === 0 || 
        selectedSkills.every(selectedSkill =>
          job.skills?.some((jobSkill: string) =>
            jobSkill.toLowerCase().includes(selectedSkill.toLowerCase()) ||
            selectedSkill.toLowerCase().includes(jobSkill.toLowerCase())
          )
        )

      const locationMatch = !locationFilter || 
        job.client?.location?.toLowerCase().includes(locationFilter.toLowerCase())

      return searchMatch && skillsMatch && locationMatch
    })

    // Sort results
    switch (sortBy) {
      case 'budget-high':
        return filtered.sort((a, b) => (b.budgetAmount || 0) - (a.budgetAmount || 0))
      case 'budget-low':
        return filtered.sort((a, b) => (a.budgetAmount || 0) - (b.budgetAmount || 0))
      case 'proposals':
        return filtered.sort((a, b) => (b._count?.proposals || 0) - (a._count?.proposals || 0))
      case 'newest':
      default:
        return filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    }
  }, [jobs, searchTerm, selectedSkills, locationFilter, sortBy])

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <LoadingCard key={i} />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Search Header */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl p-6 border border-blue-100 dark:border-blue-800">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          Find Your Perfect Project
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Browse {jobs.length} available jobs and find work that matches your skills
        </p>
        
        {/* Main Search Bar */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <Input
            placeholder="Search for projects, skills, or keywords..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-12 pr-4 h-12 text-lg bg-white dark:bg-gray-800 border-0 shadow-lg"
          />
        </div>
      </div>

      {/* Filters & Controls */}
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
        <div className="flex flex-wrap items-center gap-4">
          {/* Quick Filter Toggles */}
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2"
          >
            <SlidersHorizontal className="h-4 w-4" />
            Filters
            {hasActiveFilters && (
              <Badge variant="secondary" className="ml-1">
                {[
                  searchTerm ? 1 : 0,
                  selectedSkills.length,
                  categoryFilter !== 'all' ? 1 : 0,
                  budgetFilter !== 'all' ? 1 : 0,
                  projectTypeFilter !== 'all' ? 1 : 0,
                  experienceFilter !== 'all' ? 1 : 0,
                  locationFilter ? 1 : 0
                ].reduce((a, b) => a + b, 0)}
              </Badge>
            )}
          </Button>

          {hasActiveFilters && (
            <Button variant="ghost" onClick={clearFilters} className="text-red-600">
              <X className="h-4 w-4 mr-1" />
              Clear Filters
            </Button>
          )}
        </div>

        <div className="flex items-center gap-4">
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="budget-high">Budget: High to Low</SelectItem>
              <SelectItem value="budget-low">Budget: Low to High</SelectItem>
              <SelectItem value="proposals">Most Proposals</SelectItem>
            </SelectContent>
          </Select>

          <div className="text-sm text-gray-600 dark:text-gray-400">
            {filteredJobs.length} result{filteredJobs.length !== 1 ? 's' : ''}
          </div>
        </div>
      </div>

      {/* Advanced Filters Panel */}
      {showFilters && (
        <Card className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Skills Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Skills</label>
              <div ref={skillDropdownRef} className="relative">
                <Input
                  placeholder="Add skills..."
                  value={skillSearchTerm}
                  onChange={(e) => {
                    setSkillSearchTerm(e.target.value)
                    setShowSkillDropdown(true)
                  }}
                  onFocus={() => setShowSkillDropdown(true)}
                />
                
                {showSkillDropdown && skillSuggestions.length > 0 && (
                  <div className="absolute top-full left-0 right-0 bg-white dark:bg-gray-800 border rounded-md mt-1 max-h-40 overflow-y-auto z-20 shadow-lg">
                    {skillSuggestions.map((skill) => (
                      <button
                        key={skill}
                        onClick={() => addSkill(skill)}
                        className="w-full text-left px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-sm border-b last:border-b-0"
                      >
                        {skill}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              
              {selectedSkills.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {selectedSkills.map((skill) => (
                    <Badge key={skill} variant="secondary" className="flex items-center gap-1">
                      {skill}
                      <button onClick={() => removeSkill(skill)}>
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {/* Category Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Category</label>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {JOB_CATEGORIES.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Budget Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Budget Range</label>
              <Select value={budgetFilter} onValueChange={setBudgetFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Any Budget" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Any Budget</SelectItem>
                  {BUDGET_RANGES.map((range) => (
                    <SelectItem key={range.id} value={range.id}>
                      {range.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Location Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Location</label>
              <Input
                placeholder="Enter location..."
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
              />
            </div>
          </div>
        </Card>
      )}

      {/* Results */}
      <div className="space-y-4">
        {filteredJobs.length === 0 ? (
          <Card className="p-12 text-center">
            <Search className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
              No jobs found
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Try adjusting your search criteria or filters
            </p>
          </Card>
        ) : (
          filteredJobs.map((job) => (
            <Card key={job.id} className="hover:shadow-lg transition-all duration-200 group relative overflow-hidden">
              {/* Trending indicator */}
              {job._count?.proposals > 10 && (
                <div className="absolute top-4 right-4 bg-orange-100 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" />
                  Hot
                </div>
              )}
              
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <Link href={`/jobs/${job.id}`}>
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {job.title}
                      </h3>
                    </Link>
                    
                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-600 dark:text-gray-400">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {new Date(job.createdAt).toLocaleDateString()}
                      </div>
                      {job.positionsTotal && (
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          {job.positionsFilled || 0}/{job.positionsTotal} filled
                          {job.positionsTotal > 1 && (
                            <Badge variant={job.positionsFilled >= job.positionsTotal ? "secondary" : "default"} className="ml-1 text-xs">
                              {job.positionsTotal > 1 ? 'Multi-hire' : ''}
                            </Badge>
                          )}
                        </div>
                      )}
                      <div className="flex items-center gap-1">
                        <Heart className="h-4 w-4" />
                        {job._count?.proposals || 0} interested
                      </div>
                      {job.client?.location && (
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {job.client.location}
                        </div>
                      )}
                      {job.client?.ratingAverage && (
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          {job.client.ratingAverage} ({job.client.ratingCount})
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 ml-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleSaveJob(job.id)}
                      className={`transition-colors ${isJobSaved(job.id) ? 'text-red-600 hover:text-red-700' : 'text-gray-400 hover:text-red-600'}`}
                    >
                      <Heart className={`h-4 w-4 ${isJobSaved(job.id) ? 'fill-current' : ''}`} />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => onJobView?.(job.id)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-2 leading-relaxed">
                  {job.description}
                </p>

                {/* Skills */}
                {job.skills && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {job.skills.slice(0, 6).map((skill: string) => (
                      <Badge key={skill} variant="secondary" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                    {job.skills.length > 6 && (
                      <Badge variant="outline" className="text-xs">
                        +{job.skills.length - 6} more
                      </Badge>
                    )}
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center text-lg font-semibold text-green-600 dark:text-green-400">
                      <DollarSign className="h-5 w-5 mr-1" />
                      {job.budgetType === 'fixed' ? 'Fixed:' : 'Hourly:'} 
                      {job.budgetAmount ? ` $${job.budgetAmount.toLocaleString()}` : ' Budget TBD'}
                    </div>
                    
                    {job.assuranceHint && (
                      <AssuranceBadge method={job.assuranceHint} compact />
                    )}
                  </div>

                  <Button asChild className="group-hover:shadow-md transition-shadow">
                    <Link href={`/jobs/${job.id}`}>
                      View Details
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}