'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Trash2, Plus, FileText, Check, Upload } from 'lucide-react'

interface Milestone {
  id: string
  title: string
  amount: number
  description: string
  invoiceUrl?: string
  receiptId?: string
  paidStatus: boolean
  acceptedAt?: string
}

interface MilestonesEditorProps {
  milestones: Milestone[]
  onChange: (milestones: Milestone[]) => void
  totalBudget: number
  readonly?: boolean
  canUploadReceipts?: boolean
}

export function MilestonesEditor({ 
  milestones, 
  onChange, 
  totalBudget, 
  readonly = false,
  canUploadReceipts = false
}: MilestonesEditorProps) {
  const [uploadingId, setUploadingId] = useState<string | null>(null)

  const addMilestone = () => {
    const newMilestone: Milestone = {
      id: `milestone_${Date.now()}`,
      title: '',
      amount: 0,
      description: '',
      paidStatus: false,
    }
    onChange([...milestones, newMilestone])
  }

  const updateMilestone = (id: string, updates: Partial<Milestone>) => {
    const updated = milestones.map(m => 
      m.id === id ? { ...m, ...updates } : m
    )
    onChange(updated)
  }

  const deleteMilestone = (id: string) => {
    onChange(milestones.filter(m => m.id !== id))
  }

  const handleReceiptUpload = async (milestoneId: string, file: File) => {
    setUploadingId(milestoneId)
    
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('type', 'payment_receipt')
      
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })
      
      if (response.ok) {
        const { url, id } = await response.json()
        updateMilestone(milestoneId, {
          receiptId: id,
          invoiceUrl: url,
          paidStatus: true
        })
      } else {
        throw new Error('Upload failed')
      }
    } catch (error) {
      console.error('Error uploading receipt:', error)
      alert('Failed to upload receipt. Please try again.')
    } finally {
      setUploadingId(null)
    }
  }

  const totalAllocated = milestones.reduce((sum, m) => sum + m.amount, 0)
  const isValidAllocation = totalAllocated === totalBudget

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Project Milestones</h3>
        {!readonly && (
          <Button onClick={addMilestone} size="sm" variant="outline">
            <Plus className="h-4 w-4 mr-2" />
            Add Milestone
          </Button>
        )}
      </div>

      <div className="space-y-4">
        {milestones.map((milestone, index) => (
          <Card key={milestone.id}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">
                  Milestone {index + 1}
                  {milestone.paidStatus && (
                    <Badge variant="default" className="ml-2 bg-green-600">
                      <Check className="h-3 w-3 mr-1" />
                      Paid
                    </Badge>
                  )}
                </CardTitle>
                {!readonly && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteMilestone(milestone.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor={`title-${milestone.id}`}>Title</Label>
                  <Input
                    id={`title-${milestone.id}`}
                    value={milestone.title}
                    onChange={(e) => updateMilestone(milestone.id, { title: e.target.value })}
                    placeholder="e.g., Initial wireframes and mockups"
                    readOnly={readonly}
                  />
                </div>
                <div>
                  <Label htmlFor={`amount-${milestone.id}`}>Amount ($)</Label>
                  <Input
                    id={`amount-${milestone.id}`}
                    type="number"
                    value={milestone.amount}
                    onChange={(e) => updateMilestone(milestone.id, { amount: parseFloat(e.target.value) || 0 })}
                    placeholder="0"
                    min="0"
                    readOnly={readonly}
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor={`description-${milestone.id}`}>Description</Label>
                <Textarea
                  id={`description-${milestone.id}`}
                  value={milestone.description}
                  onChange={(e) => updateMilestone(milestone.id, { description: e.target.value })}
                  placeholder="Describe the deliverables and acceptance criteria..."
                  readOnly={readonly}
                />
              </div>

              {canUploadReceipts && !milestone.paidStatus && (
                <div className="pt-2 border-t">
                  <Label>Payment Receipt</Label>
                  <div className="mt-2">
                    <input
                      type="file"
                      accept="image/*,.pdf"
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) {
                          handleReceiptUpload(milestone.id, file)
                        }
                      }}
                      className="hidden"
                      id={`receipt-${milestone.id}`}
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => document.getElementById(`receipt-${milestone.id}`)?.click()}
                      disabled={uploadingId === milestone.id}
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      {uploadingId === milestone.id ? 'Uploading...' : 'Upload Receipt'}
                    </Button>
                    <p className="text-xs text-gray-500 mt-1">
                      Upload payment receipt or invoice to mark as paid
                    </p>
                  </div>
                </div>
              )}

              {milestone.invoiceUrl && (
                <div className="pt-2 border-t">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-green-600" />
                    <a 
                      href={milestone.invoiceUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:underline"
                    >
                      View Receipt
                    </a>
                    {milestone.acceptedAt && (
                      <Badge variant="outline" className="text-xs">
                        Accepted {new Date(milestone.acceptedAt).toLocaleDateString()}
                      </Badge>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {!readonly && (
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">Total Budget:</span>
            <span className="font-bold">${totalBudget.toLocaleString()}</span>
          </div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">Allocated:</span>
            <span className={totalAllocated > totalBudget ? 'text-red-600' : ''}>
              ${totalAllocated.toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Remaining:</span>
            <span className={totalBudget - totalAllocated < 0 ? 'text-red-600' : 'text-green-600'}>
              ${(totalBudget - totalAllocated).toLocaleString()}
            </span>
          </div>
          
          {!isValidAllocation && (
            <div className="mt-3 p-2 bg-yellow-50 border border-yellow-200 rounded text-sm text-yellow-800">
              <strong>Note:</strong> Total allocated amount must equal the project budget.
            </div>
          )}
        </div>
      )}

      {milestones.length === 0 && !readonly && (
        <div className="text-center py-8 text-gray-500">
          <FileText className="h-12 w-12 mx-auto mb-4 opacity-40" />
          <p>No milestones yet. Add your first milestone to get started.</p>
          <p className="text-sm">Recommended: 2-5 small milestones with clear deliverables</p>
        </div>
      )}
    </div>
  )
}