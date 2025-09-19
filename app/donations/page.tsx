'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { PayPalButtons, usePayPalScriptReducer } from '@paypal/react-paypal-js'
import { Heart, CreditCard, Zap, Users, Star } from 'lucide-react'
import Link from 'next/link'

// PayPal component that handles provider checking
function PayPalButtonWrapper({ amount, onSuccess }: { amount: number, onSuccess: () => void }) {
  const [isProviderAvailable, setIsProviderAvailable] = useState(false)

  useEffect(() => {
    try {
      const paypalClientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID
      const hasValidPayPal = paypalClientId && paypalClientId !== 'placeholder_paypal_client'
      setIsProviderAvailable(hasValidPayPal)
    } catch {
      setIsProviderAvailable(false)
    }
  }, [])

  if (!isProviderAvailable) {
    return (
      <div className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
        <p className="text-gray-500 text-sm">
          PayPal not available in demo mode
        </p>
        <Button 
          className="mt-3" 
          onClick={() => alert('Demo: PayPal donation would be processed!')}
        >
          Simulate PayPal Donation
        </Button>
      </div>
    )
  }

  return <PayPalButtonsWrapper amount={amount} onSuccess={onSuccess} />
}

function PayPalButtonsWrapper({ amount, onSuccess }: { amount: number, onSuccess: () => void }) {
  const [{ isPending }] = usePayPalScriptReducer()

  if (isPending) {
    return <div className="animate-pulse bg-gray-200 h-12 rounded-lg" />
  }

  return (
    <PayPalButtons
      style={{ layout: 'horizontal', height: 44 }}
      createOrder={(data, actions) => {
        return actions.order.create({
          purchase_units: [
            {
              amount: {
                value: amount.toString(),
              },
            },
          ],
        })
      }}
      onApprove={async (data, actions) => {
        try {
          await actions.order.capture()
          onSuccess()
        } catch (error) {
          console.error('PayPal capture error:', error)
        }
      }}
      onError={(err) => {
        console.error('PayPal error:', err)
      }}
    />
  )
}

export default function DonationsPage() {
  const [amount, setAmount] = useState(25)
  const [customAmount, setCustomAmount] = useState('')
  const [donorName, setDonorName] = useState('')
  const [message, setMessage] = useState('')
  const [showOnWall, setShowOnWall] = useState(true)
  const [isRecurring, setIsRecurring] = useState(false)

  const presetAmounts = [5, 10, 25, 50, 100, 250]
  const finalAmount = customAmount ? parseFloat(customAmount) : amount

  const handleStripeCheckout = async () => {
    // Demo mode - simulate successful donation
    alert(`Demo: Stripe donation of $${finalAmount.toFixed(2)} processed successfully! Thank you ${donorName || 'Anonymous'} for your support!`)
    
    // In production, this would make the actual API call:
    /*
    try {
      const response = await fetch('/api/donations/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: finalAmount * 100, // Convert to cents
          currency: 'usd',
          isRecurring,
          donorName: donorName || 'Anonymous',
          message,
          showOnWall,
        }),
      })

      const { url } = await response.json()
      if (url) {
        window.location.href = url
      }
    } catch (error) {
      console.error('Error creating checkout session:', error)
    }
    */
  }


  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Hero */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-pink-100 rounded-full mb-6">
              <Heart className="h-8 w-8 text-pink-600" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Support tykoonConnect
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Help us keep the platform 100% free forever. Every donation goes directly 
              to hosting, development, and making freelancing better for everyone.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Donation Form */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Heart className="h-5 w-5 text-pink-600" />
                    Make a Donation
                  </CardTitle>
                  <CardDescription>
                    Choose your amount and payment method
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Amount Selection */}
                  <div>
                    <Label className="text-base font-medium">Donation Amount</Label>
                    <div className="grid grid-cols-3 gap-2 mt-2">
                      {presetAmounts.map((preset) => (
                        <button
                          key={preset}
                          type="button"
                          onClick={() => {
                            setAmount(preset)
                            setCustomAmount('')
                          }}
                          className={`p-3 text-center border rounded-lg transition-all ${
                            amount === preset && !customAmount
                              ? 'border-blue-500 bg-blue-50 text-blue-700'
                              : 'border-gray-300 hover:border-gray-400'
                          }`}
                        >
                          ${preset}
                        </button>
                      ))}
                    </div>
                    <div className="mt-3">
                      <Input
                        type="number"
                        placeholder="Custom amount"
                        value={customAmount}
                        onChange={(e) => setCustomAmount(e.target.value)}
                        min="1"
                        max="10000"
                      />
                    </div>
                  </div>

                  {/* Recurring Option */}
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="recurring"
                      checked={isRecurring}
                      onCheckedChange={setIsRecurring}
                    />
                    <Label htmlFor="recurring" className="text-sm">
                      Make this a monthly donation
                    </Label>
                    <Badge variant="secondary">Coming Soon</Badge>
                  </div>

                  {/* Donor Info */}
                  <div>
                    <Label htmlFor="donorName">Your Name (Optional)</Label>
                    <Input
                      id="donorName"
                      value={donorName}
                      onChange={(e) => setDonorName(e.target.value)}
                      placeholder="Anonymous"
                    />
                  </div>

                  <div>
                    <Label htmlFor="message">Message (Optional)</Label>
                    <Textarea
                      id="message"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="A note of encouragement..."
                      maxLength={200}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      {message.length}/200 characters
                    </p>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="showOnWall"
                      checked={showOnWall}
                      onCheckedChange={setShowOnWall}
                    />
                    <Label htmlFor="showOnWall" className="text-sm">
                      Show my donation on the Wall of Support
                    </Label>
                  </div>

                  {/* Payment Methods */}
                  <div className="space-y-4">
                    <div className="text-sm font-medium">Choose Payment Method</div>
                    
                    {/* Stripe */}
                    <Button 
                      onClick={handleStripeCheckout}
                      className="w-full"
                      size="lg"
                      disabled={!finalAmount || finalAmount < 1}
                    >
                      <CreditCard className="mr-2 h-4 w-4" />
                      Donate ${finalAmount.toFixed(2)} with Card
                    </Button>

                    {/* PayPal */}
                    <div className="w-full">
                      <PayPalButtonWrapper
                        amount={finalAmount}
                        onSuccess={() => alert('Thank you for your donation! ❤️')}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Why Donate & Impact */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5 text-yellow-600" />
                    Why Donate?
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <h4 className="font-medium">Keep it 100% Free</h4>
                      <p className="text-sm text-gray-600">
                        No platform fees, no commissions, no hidden costs. Ever.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <h4 className="font-medium">Cover Operating Costs</h4>
                      <p className="text-sm text-gray-600">
                        Server hosting, security, and maintenance expenses.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <h4 className="font-medium">Fund New Features</h4>
                      <p className="text-sm text-gray-600">
                        Better matching, enhanced security, mobile apps.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <h4 className="font-medium">Community First</h4>
                      <p className="text-sm text-gray-600">
                        No investors, no pressure to monetize users.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Star className="h-5 w-5 text-yellow-600" />
                    Recent Supporters
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Sarah M.</p>
                        <p className="text-sm text-gray-600">&ldquo;Love the zero-fee model!&rdquo;</p>
                      </div>
                      <Badge variant="outline">$50</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Anonymous</p>
                        <p className="text-sm text-gray-600">&ldquo;Keep up the great work&rdquo;</p>
                      </div>
                      <Badge variant="outline">$25</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Mike D.</p>
                        <p className="text-sm text-gray-600">&ldquo;This is the future!&rdquo;</p>
                      </div>
                      <Badge variant="outline">$100</Badge>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t">
                    <Button variant="outline" className="w-full" asChild>
                      <Link href="/wall-of-support">
                        View Wall of Support
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}