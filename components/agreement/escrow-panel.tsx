'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ExternalLink, RefreshCw, AlertCircle, CheckCircle } from 'lucide-react'

interface EscrowData {
  provider: string
  url: string
  txId: string
  status: 'DRAFT' | 'FUNDED' | 'RELEASED' | 'CANCELLED'
  amount?: number
  webhookSecret?: string
}

interface EscrowPanelProps {
  data: EscrowData
  onChange: (data: EscrowData) => void
  readonly?: boolean
  projectAmount?: number
}

const ESCROW_PROVIDERS = [
  { id: 'escrow.com', name: 'Escrow.com', url: 'https://escrow.com' },
  { id: 'payoneer-escrow', name: 'Payoneer Escrow', url: 'https://payoneer.com' },
  { id: 'other', name: 'Other Provider', url: '' }
]

const STATUS_CONFIG = {
  DRAFT: { label: 'Draft', color: 'bg-gray-100 text-gray-800', icon: AlertCircle },
  FUNDED: { label: 'Funded', color: 'bg-green-100 text-green-800', icon: CheckCircle },
  RELEASED: { label: 'Released', color: 'bg-blue-100 text-blue-800', icon: CheckCircle },
  CANCELLED: { label: 'Cancelled', color: 'bg-red-100 text-red-800', icon: AlertCircle }
}

export function EscrowPanel({ data, onChange, readonly = false, projectAmount }: EscrowPanelProps) {
  const [isRefreshing, setIsRefreshing] = useState(false)

  const handleRefreshStatus = async () => {
    if (!data.webhookSecret || readonly) return
    
    setIsRefreshing(true)
    try {
      const response = await fetch('/api/escrow/status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          provider: data.provider,
          txId: data.txId,
          webhookSecret: data.webhookSecret
        })
      })
      
      if (response.ok) {
        const { status, amount } = await response.json()
        onChange({ ...data, status, amount })
      }
    } catch (error) {
      console.error('Error refreshing escrow status:', error)
    } finally {
      setIsRefreshing(false)
    }
  }

  const statusConfig = STATUS_CONFIG[data.status]
  const StatusIcon = statusConfig.icon

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <ExternalLink className="h-5 w-5 text-blue-600" />
            External Escrow Service
          </CardTitle>
          <Badge className={statusConfig.color}>
            <StatusIcon className="h-3 w-3 mr-1" />
            {statusConfig.label}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="font-medium text-blue-900 mb-2">How External Escrow Works</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• You arrange escrow through a third-party service</li>
            <li>• We only track the reference details for transparency</li>
            <li>• tykoonConnect never holds or processes funds</li>
            <li>• Update status manually or via webhook integration</li>
          </ul>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="provider">Escrow Provider</Label>
            <Select
              value={data.provider}
              onValueChange={(value) => onChange({ ...data, provider: value })}
              disabled={readonly}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select provider" />
              </SelectTrigger>
              <SelectContent>
                {ESCROW_PROVIDERS.map((provider) => (
                  <SelectItem key={provider.id} value={provider.id}>
                    {provider.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="txId">Transaction ID</Label>
            <Input
              id="txId"
              value={data.txId}
              onChange={(e) => onChange({ ...data, txId: e.target.value })}
              placeholder="ESC-123456789"
              readOnly={readonly}
            />
          </div>
        </div>

        <div>
          <Label htmlFor="url">Escrow Service URL</Label>
          <div className="flex gap-2">
            <Input
              id="url"
              value={data.url}
              onChange={(e) => onChange({ ...data, url: e.target.value })}
              placeholder="https://escrow.com/transaction/123456789"
              readOnly={readonly}
            />
            {data.url && (
              <Button variant="outline" size="icon" asChild>
                <a href={data.url} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4" />
                </a>
              </Button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="status">Current Status</Label>
            <Select
              value={data.status}
              onValueChange={(value) => onChange({ ...data, status: value as EscrowData['status'] })}
              disabled={readonly}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="DRAFT">Draft - Not yet funded</SelectItem>
                <SelectItem value="FUNDED">Funded - Ready to begin</SelectItem>
                <SelectItem value="RELEASED">Released - Payment completed</SelectItem>
                <SelectItem value="CANCELLED">Cancelled - Transaction void</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="amount">Escrow Amount ($)</Label>
            <Input
              id="amount"
              type="number"
              value={data.amount || ''}
              onChange={(e) => onChange({ ...data, amount: parseFloat(e.target.value) || undefined })}
              placeholder={projectAmount?.toString() || '0'}
              readOnly={readonly}
            />
          </div>
        </div>

        {!readonly && (
          <div className="space-y-3">
            <div>
              <Label htmlFor="webhookSecret">Webhook Secret (Optional)</Label>
              <Input
                id="webhookSecret"
                type="password"
                value={data.webhookSecret || ''}
                onChange={(e) => onChange({ ...data, webhookSecret: e.target.value })}
                placeholder="For automatic status updates"
              />
              <p className="text-xs text-gray-500 mt-1">
                Configure your escrow service to send status updates to: 
                <code className="bg-gray-100 px-1 rounded">/api/webhooks/escrow</code>
              </p>
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={handleRefreshStatus}
                disabled={!data.webhookSecret || isRefreshing}
                size="sm"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                {isRefreshing ? 'Refreshing...' : 'Refresh Status'}
              </Button>
            </div>
          </div>
        )}

        {projectAmount && data.amount && data.amount !== projectAmount && (
          <div className="bg-yellow-50 border border-yellow-200 rounded p-3">
            <div className="flex items-start gap-2">
              <AlertCircle className="h-4 w-4 text-yellow-600 mt-0.5" />
              <div className="text-sm text-yellow-800">
                <strong>Amount Mismatch:</strong> Escrow amount (${data.amount.toLocaleString()}) 
                differs from project amount (${projectAmount.toLocaleString()})
              </div>
            </div>
          </div>
        )}

        {data.status === 'FUNDED' && (
          <div className="bg-green-50 border border-green-200 rounded p-3">
            <div className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
              <div className="text-sm text-green-800">
                <strong>Escrow Secured:</strong> Funds are held by {data.provider} and work can begin safely.
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}