import Stripe from 'stripe'
import { auth, currentUser } from '@clerk/nextjs/server'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

export async function POST(req) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return Response.json({ error: 'Please sign in first.' }, { status: 401 })
    }

    const user = await currentUser()
    const { plan } = await req.json()

    const priceId = plan === 'yearly'
      ? process.env.STRIPE_PRICE_YEARLY
      : process.env.STRIPE_PRICE_MONTHLY

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      customer_email: user.emailAddresses[0]?.emailAddress,
      client_reference_id: userId,
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/?canceled=true`,
    })

    return Response.json({ url: session.url })
  } catch (e) {
    return Response.json({ error: e.message }, { status: 500 })
  }
}