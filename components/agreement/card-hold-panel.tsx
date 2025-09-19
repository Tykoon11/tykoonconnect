'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CreditCard, Clock, AlertCircle, CheckCircle, XCircle } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

interface CardHoldData {
  holdAmount: number
  paymentIntentId?: string
  holdExpiresAt?: string
  capturedAt?: string
  voidedAt?: string
  clientSecret?: string
}

interface CardHoldPanelProps {
  data: CardHoldData
  onChange: (data: CardHoldData) => void
  readonly?: boolean
  projectAmount?: number
  canManageHolds?: boolean
}

export function CardHoldPanel({ 
  data, 
  onChange, 
  readonly = false, 
  projectAmount,
  canManageHolds = false
}: CardHoldPanelProps) {
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState('')

  const isActive = data.paymentIntentId && !data.capturedAt && !data.voidedAt
  const isExpired = data.holdExpiresAt && new Date(data.holdExpiresAt) < new Date()
  const isCaptured = !!data.capturedAt
  const isVoided = !!data.voidedAt

  const getStatus = () => {
    if (isVoided) return { label: 'Voided', color: 'bg-red-100 text-red-800', icon: XCircle }
    if (isCaptured) return { label: 'Captured', color: 'bg-green-100 text-green-800', icon: CheckCircle }
    if (isExpired) return { label: 'Expired', color: 'bg-yellow-100 text-yellow-800', icon: AlertCircle }
    if (isActive) return { label: 'Active', color: 'bg-blue-100 text-blue-800', icon: Clock }
    return { label: 'Not Set', color: 'bg-gray-100 text-gray-800', icon: AlertCircle }
  }

  const handleCreateHold = async () => {
    setIsProcessing(true)
    setError('')

    try {
      const response = await fetch('/api/payments/stripe/create-hold', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: data.holdAmount * 100, // Convert to cents
          currency: 'usd',
        }),
      })

      if (response.ok) {
        const result = await response.json()
        onChange({
          ...data,
          paymentIntentId: result.paymentIntentId,
          clientSecret: result.clientSecret,
          holdExpiresAt: result.expiresAt,
        })
      } else {
        const errorData = await response.json()
        setError(errorData.error || 'Failed to create hold')
      }
    } catch (error) {
      setError('Failed to create payment hold')
      console.error('Error creating hold:', error)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleCaptureHold = async () => {
    if (!data.paymentIntentId) return

    setIsProcessing(true)
    setError('')

    try {
      const response = await fetch('/api/payments/stripe/capture-hold', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          paymentIntentId: data.paymentIntentId,
          amount: data.holdAmount * 100,
        }),
      })

      if (response.ok) {
        const result = await response.json()
        onChange({
          ...data,
          capturedAt: new Date().toISOString(),
        })
      } else {
        const errorData = await response.json()
        setError(errorData.error || 'Failed to capture payment')
      }
    } catch (error) {
      setError('Failed to capture payment hold')
      console.error('Error capturing hold:', error)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleVoidHold = async () => {
    if (!data.paymentIntentId) return

    setIsProcessing(true)
    setError('')

    try {
      const response = await fetch('/api/payments/stripe/void-hold', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          paymentIntentId: data.paymentIntentId,
        }),
      })

      if (response.ok) {
        onChange({
          ...data,
          voidedAt: new Date().toISOString(),
        })
      } else {
        const errorData = await response.json()
        setError(errorData.error || 'Failed to void payment')
      }
    } catch (error) {
      setError('Failed to void payment hold')
      console.error('Error voiding hold:', error)
    } finally {
      setIsProcessing(false)
    }
  }

  const status = getStatus()
  const StatusIcon = status.icon

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-purple-600" />
            Card Authorization Hold
          </CardTitle>
          <Badge className={status.color}>
            <StatusIcon className="h-3 w-3 mr-1" />
            {status.label}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-purple-50 p-4 rounded-lg">
          <h4 className="font-medium text-purple-900 mb-2">How Card Holds Work</h4>
          <ul className="text-sm text-purple-800 space-y-1">
            <li>• Card is authorized for the full amount but not charged</li>
            <li>• Hold remains active for 7 days maximum</li>
            <li>• Captured when work is accepted, voided if cancelled</li>
            <li>• Client can see pending authorization in their account</li>
          </ul>
        </div>

        <div>
          <Label htmlFor="holdAmount">Hold Amount ($)</Label>
          <Input
            id="holdAmount"
            type="number"
            value={data.holdAmount}
            onChange={(e) => onChange({ ...data, holdAmount: parseFloat(e.target.value) || 0 })}
            placeholder={projectAmount?.toString() || '0'}
            readOnly={readonly || isActive}
            min="1"
            max="10000"
          />
          {projectAmount && data.holdAmount !== projectAmount && (
            <p className="text-sm text-yellow-600 mt-1">
              Hold amount differs from project amount (${projectAmount.toLocaleString()})
            </p>
          )}
        </div>

        {data.paymentIntentId && (
          <div className="space-y-2">
            <div className="text-sm">
              <strong>Payment Intent ID:</strong> {data.paymentIntentId}
            </div>
            
            {data.holdExpiresAt && (
              <div className="text-sm">
                <strong>Expires:</strong> {' '}
                {isExpired 
                  ? <span className="text-red-600">Expired {formatDistanceToNow(new Date(data.holdExpiresAt), { addSuffix: true })}</span>
                  : <span>{formatDistanceToNow(new Date(data.holdExpiresAt), { addSuffix: true })}</span>
                }
              </div>
            )}

            {data.capturedAt && (
              <div className="text-sm text-green-600">
                <strong>Captured:</strong> {new Date(data.capturedAt).toLocaleDateString()} at {new Date(data.capturedAt).toLocaleTimeString()}
              </div>
            )}

            {data.voidedAt && (
              <div className="text-sm text-red-600">
                <strong>Voided:</strong> {new Date(data.voidedAt).toLocaleDateString()} at {new Date(data.voidedAt).toLocaleTimeString()}
              </div>
            )}
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded p-3">
            <div className="flex items-start gap-2">
              <AlertCircle className="h-4 w-4 text-red-600 mt-0.5" />
              <div className="text-sm text-red-800">{error}</div>
            </div>
          </div>
        )}

        {canManageHolds && !readonly && (
          <div className="flex gap-2 pt-2 border-t">
            {!data.paymentIntentId && (
              <Button
                onClick={handleCreateHold}
                disabled={isProcessing || data.holdAmount < 1}
              >
                {isProcessing ? 'Creating...' : 'Create Authorization Hold'}
              </Button>
            )}

            {isActive && !isExpired && (
              <>
                <Button
                  onClick={handleCaptureHold}
                  disabled={isProcessing}
                  variant="default"
                >
                  {isProcessing ? 'Capturing...' : 'Capture Payment'}
                </Button>
                <Button
                  onClick={handleVoidHold}
                  disabled={isProcessing}
                  variant="outline"
                >
                  {isProcessing ? 'Voiding...' : 'Void Hold'}
                </Button>
              </>
            )}

            {isExpired && !isCaptured && !isVoided && (
              <Button
                onClick={handleCreateHold}
                disabled={isProcessing}
                variant="outline"
              >
                {isProcessing ? 'Creating...' : 'Create New Hold'}
              </Button>
            )}
          </div>
        )}

        {isActive && data.holdExpiresAt && (
          <div className="bg-blue-50 border border-blue-200 rounded p-3">
            <div className="flex items-start gap-2">
              <Clock className="h-4 w-4 text-blue-600 mt-0.5" />
              <div className="text-sm text-blue-800">
                <strong>Authorization Active:</strong> Card is authorized for ${data.holdAmount.toLocaleString()}. 
                Work can begin safely. Hold expires {formatDistanceToNow(new Date(data.holdExpiresAt), { addSuffix: true })}.
              </div>
            </div>
          </div>
        )}

        {isExpired && (
          <div className="bg-yellow-50 border border-yellow-200 rounded p-3">
            <div className="flex items-start gap-2">
              <AlertCircle className="h-4 w-4 text-yellow-600 mt-0.5" />
              <div className="text-sm text-yellow-800">
                <strong>Hold Expired:</strong> The authorization has expired and needs to be renewed before work can continue.
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}