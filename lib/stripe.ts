import Stripe from 'stripe'

let stripeInstance: Stripe | null = null

export function getStripe() {
  const secretKey = process.env.STRIPE_SECRET_KEY

  if (!secretKey || secretKey.includes('placeholder')) {
    return null
  }

  if (!stripeInstance) {
    stripeInstance = new Stripe(secretKey, {
      apiVersion: '2024-06-20',
    })
  }

  return stripeInstance
}
