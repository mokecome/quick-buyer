import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const signature = request.headers.get('x-creem-signature')

    // Verify webhook signature if secret is configured
    const webhookSecret = process.env.CREEM_WEBHOOK_SECRET
    if (webhookSecret && signature) {
      // TODO: Implement signature verification
      // For now, we'll just log that we received the webhook
      console.log('Received webhook with signature:', signature)
    }

    const event = JSON.parse(body)
    console.log('Webhook event:', event.type, event)

    // Handle different event types
    switch (event.type) {
      case 'checkout.completed':
        await handleCheckoutCompleted(event.data)
        break
      case 'subscription.created':
        await handleSubscriptionCreated(event.data)
        break
      case 'subscription.cancelled':
        await handleSubscriptionCancelled(event.data)
        break
      case 'payment.failed':
        await handlePaymentFailed(event.data)
        break
      default:
        console.log('Unhandled event type:', event.type)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    )
  }
}

async function handleCheckoutCompleted(data: any) {
  console.log('Checkout completed:', data)

  const { metadata, customer_email, checkout_id, amount, currency } = data

  if (!metadata?.projectSlug) {
    console.log('No project slug in metadata, skipping')
    return
  }

  try {
    const supabase = createClient()

    // Get the project
    const { data: project, error: projectError } = await supabase
      .from('projects')
      .select('id')
      .eq('slug', metadata.projectSlug)
      .single()

    if (projectError || !project) {
      console.error('Project not found:', metadata.projectSlug)
      return
    }

    // Get user by email (if exists)
    const { data: user } = await supabase
      .from('auth.users')
      .select('id')
      .eq('email', customer_email)
      .single()

    // Create purchase record
    const { error: purchaseError } = await supabase
      .from('purchases')
      .insert({
        project_id: project.id,
        user_id: user?.id || null,
        creem_session_id: checkout_id,
        amount: amount / 100, // Convert from cents
        currency: currency,
        status: 'completed',
      })

    if (purchaseError) {
      console.error('Error creating purchase:', purchaseError)
    } else {
      console.log('Purchase created successfully')
    }
  } catch (error) {
    console.error('Error handling checkout completed:', error)
  }
}

async function handleSubscriptionCreated(data: any) {
  console.log('Subscription created:', data)
  // Handle subscription creation
}

async function handleSubscriptionCancelled(data: any) {
  console.log('Subscription cancelled:', data)
  // Handle subscription cancellation
}

async function handlePaymentFailed(data: any) {
  console.log('Payment failed:', data)
  // Handle payment failure
}
