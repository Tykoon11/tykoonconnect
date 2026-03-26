import { NextRequest, NextResponse } from 'next/server'
import { getStripe } from '@/lib/stripe'
import { z } from 'zod'

const checkoutSchema = z.object({
  amount: z.number().min(100).max(1000000),
  currency: z.string().default('usd'),
  isRecurring: z.boolean().default(false),
  donorName: z.string().optional(),
  message: z.string().optional(),
  showOnWall: z.boolean().default(true),
})

export async function POST(request: NextRequest) {
  try {
    const stripe = getStripe()

    if (!stripe) {
      return NextResponse.json(
        {
          error: 'Donations are temporarily unavailable. Stripe is not configured.',
          code: 'STRIPE_NOT_CONFIGURED',
        },
        { status: 503 }
      )
    }

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
            ...(isRecurring && { recurring: { interval: 'month' } }),
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
    return NextResponse.json({ error: 'Failed to create checkout session' }, { status: 500 })
  }
}
