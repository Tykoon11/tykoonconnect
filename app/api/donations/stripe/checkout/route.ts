import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { z } from 'zod'

const checkoutSchema = z.object({
  amount: z.number().min(100).max(1000000), // $1 to $10,000 in cents
  currency: z.string().default('usd'),
  isRecurring: z.boolean().default(false),
  donorName: z.string().optional(),
  message: z.string().optional(),
  showOnWall: z.boolean().default(true),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { amount, currency, isRecurring, donorName, message, showOnWall } = checkoutSchema.parse(body)

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency,
            product_data: {
              name: 'tykoonConnect Donation',
              description: 'Support the free marketplace platform',
            },
            unit_amount: amount,
            ...(isRecurring && {
              recurring: {
                interval: 'month',
              },
            }),
          },
          quantity: 1,
        },
      ],
      mode: isRecurring ? 'subscription' : 'payment',
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/donations/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/donations?canceled=true`,
      metadata: {
        donorName: donorName || 'Anonymous',
        message: message || '',
        showOnWall: showOnWall.toString(),
        isRecurring: isRecurring.toString(),
      },
    })

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error('Stripe checkout error:', error)
    
    // Check if we're in demo mode with invalid Stripe keys
    const isDemoStripe = !process.env.STRIPE_SECRET_KEY || 
      process.env.STRIPE_SECRET_KEY.includes('placeholder')
    
    if (isDemoStripe) {
      return NextResponse.json({
        url: '/donations?demo=true&message=Demo+mode+-+Stripe+not+configured',
        _demo: true
      })
    }
    
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    )
  }
}