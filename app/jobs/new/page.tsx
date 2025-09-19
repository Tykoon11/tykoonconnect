'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { AssurancePicker } from '@/components/assurance-badge'
import { X, Plus, Users, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { AssuranceMethod } from '@prisma/client'

export default function NewJobPage() {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [skills, setSkills] = useState<string[]>([])
  const [newSkill, setNewSkill] = useState('')
  const [budgetType, setBudgetType] = useState<'fixed' | 'hourly'>('fixed')
  const [budgetAmount, setBudgetAmount] = useState('')
  const [positionsTotal, setPositionsTotal] = useState(1)
  const [assuranceHint, setAssuranceHint] = useState<AssuranceMethod>('MILESTONE_INVOICE')

  const addSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()])
      setNewSkill('')
    }
  }

  const removeSkill = (skillToRemove: string) => {
    setSkills(skills.filter(skill => skill !== skillToRemove))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, this would submit to the API
    alert('Demo: Job would be posted successfully! (Database not connected)')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          {/* Back Button */}
          <div className="mb-6">
            <Button variant="outline" asChild>
              <Link href="/jobs">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Jobs
              </Link>
            </Button>
          </div>

          {/* Main Form */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Post a New Job</CardTitle>
              <CardDescription>
                Describe your project and find the perfect freelancer. No platform fees ever!
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Job Title */}
                <div>
                  <Label htmlFor="title">Job Title *</Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Build a modern e-commerce website"
                    required
                  />
                </div>

                {/* Job Description */}
                <div>
                  <Label htmlFor="description">Project Description *</Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe your project in detail. What do you need? What are your requirements? What's the timeline?"
                    rows={6}
                    required
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    {description.length}/5000 characters
                  </p>
                </div>

                {/* Skills Required */}
                <div>
                  <Label>Skills Required *</Label>
                  <div className="flex gap-2 mt-2 mb-3">
                    <Input
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                      placeholder="Add a skill (e.g. React, Design, Writing)"
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                    />
                    <Button type="button" onClick={addSkill} variant="outline">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {skills.map((skill) => (
                      <Badge key={skill} variant="secondary" className="flex items-center gap-1">
                        {skill}
                        <button
                          type="button"
                          onClick={() => removeSkill(skill)}
                          className="hover:text-red-500"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                  {skills.length === 0 && (
                    <p className="text-sm text-gray-500">Add at least one skill</p>
                  )}
                </div>

                {/* Positions Available */}
                <div>
                  <Label htmlFor="positions" className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Positions Available *
                  </Label>
                  <Input
                    id="positions"
                    type="number"
                    value={positionsTotal}
                    onChange={(e) => setPositionsTotal(Math.max(1, parseInt(e.target.value) || 1))}
                    placeholder="1"
                    min="1"
                    max="50"
                    className="max-w-32"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    How many freelancers do you want to hire for this job? (1-50)
                  </p>
                </div>

                {/* Budget */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Budget Type *</Label>
                    <Select value={budgetType} onValueChange={(value: 'fixed' | 'hourly') => setBudgetType(value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="fixed">Fixed Price Project</SelectItem>
                        <SelectItem value="hourly">Hourly Rate</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="budget">
                      {budgetType === 'fixed' ? `Total Budget ($)${positionsTotal > 1 ? ` (per freelancer)` : ''}` : 'Hourly Rate ($)'}
                    </Label>
                    <Input
                      id="budget"
                      type="number"
                      value={budgetAmount}
                      onChange={(e) => setBudgetAmount(e.target.value)}
                      placeholder={budgetType === 'fixed' ? '5000' : '75'}
                      min="1"
                    />
                  </div>
                </div>

                {/* Preferred Assurance Method */}
                <div>
                  <Label className="text-base font-medium">Preferred Payment Assurance</Label>
                  <p className="text-sm text-gray-600 mb-4">
                    Choose your preferred method for securing payments. Freelancers can see this preference.
                  </p>
                  <AssurancePicker
                    value={assuranceHint}
                    onChange={setAssuranceHint}
                    showDescriptions={true}
                  />
                </div>

                {/* Submit Button */}
                <div className="flex justify-end space-x-4 pt-6 border-t">
                  <Button type="button" variant="outline" asChild>
                    <Link href="/jobs">Cancel</Link>
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={!title || !description || skills.length === 0}
                    className="min-w-32"
                  >
                    Post Job
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Info Card */}
          <Card className="mt-6">
            <CardContent className="pt-6">
              <h3 className="font-medium mb-2">Why tykoonConnect?</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• <strong>100% Free:</strong> No platform fees, no commissions, ever</li>
                <li>• <strong>Flexible Payments:</strong> Choose from 3 assurance methods</li>
                <li>• <strong>Quality Talent:</strong> Connect with skilled freelancers worldwide</li>
                <li>• <strong>Direct Communication:</strong> Message freelancers directly</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}