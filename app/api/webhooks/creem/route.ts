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
      case 'subscription.renewed':
        await handleSubscriptionRenewed(event.data)
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

  try {
    const supabase = await createClient()

    // Check if this is a cart purchase
    if (metadata?.type === 'cart' && metadata?.items) {
      await handleCartPurchase(supabase, data)
      return
    }

    // Check if this is a subscription purchase
    if (metadata?.planName) {
      await handleSubscriptionPurchase(supabase, data)
      return
    }

    // Single project purchase
    if (metadata?.projectSlug) {
      await handleProjectPurchase(supabase, data)
      return
    }

    console.log('Unknown checkout type, metadata:', metadata)
  } catch (error) {
    console.error('Error handling checkout completed:', error)
  }
}

async function handleCartPurchase(supabase: any, data: any) {
  const { metadata, customer_email, checkout_id, amount, currency } = data

  try {
    const items = JSON.parse(metadata.items)
    const userId = metadata.userId

    // Get user if we have userId or email
    let user = null
    if (userId) {
      const { data: userData } = await supabase
        .from('auth.users')
        .select('id')
        .eq('id', userId)
        .single()
      user = userData
    } else if (customer_email) {
      const { data: userData } = await supabase
        .from('auth.users')
        .select('id')
        .eq('email', customer_email)
        .single()
      user = userData
    }

    // Create purchase records for each item
    for (const item of items) {
      // Get project by slug
      const { data: project } = await supabase
        .from('projects')
        .select('id')
        .eq('slug', item.slug)
        .single()

      if (project) {
        await supabase.from('purchases').insert({
          project_id: project.id,
          user_id: user?.id || null,
          creem_session_id: checkout_id,
          amount: item.price,
          currency: currency || 'USD',
          status: 'completed',
        })
      }
    }

    console.log('Cart purchases created successfully')
  } catch (error) {
    console.error('Error handling cart purchase:', error)
  }
}

async function handleProjectPurchase(supabase: any, data: any) {
  const { metadata, customer_email, checkout_id, amount, currency } = data

  try {
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

    // Get user by email or userId
    let user = null
    if (metadata.userId) {
      const { data: userData } = await supabase
        .from('auth.users')
        .select('id')
        .eq('id', metadata.userId)
        .single()
      user = userData
    } else if (customer_email) {
      const { data: userData } = await supabase
        .from('auth.users')
        .select('id')
        .eq('email', customer_email)
        .single()
      user = userData
    }

    // Create purchase record
    const { error: purchaseError } = await supabase
      .from('purchases')
      .insert({
        project_id: project.id,
        user_id: user?.id || null,
        creem_session_id: checkout_id,
        amount: amount / 100,
        currency: currency,
        status: 'completed',
      })

    if (purchaseError) {
      console.error('Error creating purchase:', purchaseError)
    } else {
      console.log('Purchase created successfully')
    }
  } catch (error) {
    console.error('Error handling project purchase:', error)
  }
}

async function handleSubscriptionPurchase(supabase: any, data: any) {
  const { metadata, customer_email, subscription_id, customer_id } = data

  try {
    // Get user by email or userId
    let userId = metadata.userId
    if (!userId && customer_email) {
      const { data: userData } = await supabase
        .from('auth.users')
        .select('id')
        .eq('email', customer_email)
        .single()
      userId = userData?.id
    }

    if (!userId) {
      console.error('User not found for subscription:', customer_email)
      return
    }

    // Calculate period end based on billing cycle
    const now = new Date()
    const periodEnd = new Date(now)
    if (metadata.billingCycle === 'yearly') {
      periodEnd.setFullYear(periodEnd.getFullYear() + 1)
    } else {
      periodEnd.setMonth(periodEnd.getMonth() + 1)
    }

    // Create or update subscription
    const { error } = await supabase
      .from('subscriptions')
      .upsert({
        user_id: userId,
        plan_name: metadata.planName,
        billing_cycle: metadata.billingCycle,
        status: 'active',
        creem_subscription_id: subscription_id,
        creem_customer_id: customer_id,
        current_period_start: now.toISOString(),
        current_period_end: periodEnd.toISOString(),
      }, {
        onConflict: 'user_id'
      })

    if (error) {
      console.error('Error creating subscription:', error)
    } else {
      console.log('Subscription created successfully')
    }
  } catch (error) {
    console.error('Error handling subscription purchase:', error)
  }
}

async function handleSubscriptionCreated(data: any) {
  console.log('Subscription created:', data)

  const { metadata, customer_email, subscription_id, customer_id } = data

  try {
    const supabase = await createClient()

    // Get user
    let userId = metadata?.userId
    if (!userId && customer_email) {
      const { data: userData } = await supabase
        .from('auth.users')
        .select('id')
        .eq('email', customer_email)
        .single()
      userId = userData?.id
    }

    if (!userId) {
      console.error('User not found for subscription')
      return
    }

    // Calculate period end
    const now = new Date()
    const periodEnd = new Date(now)
    if (metadata?.billingCycle === 'yearly') {
      periodEnd.setFullYear(periodEnd.getFullYear() + 1)
    } else {
      periodEnd.setMonth(periodEnd.getMonth() + 1)
    }

    await supabase
      .from('subscriptions')
      .upsert({
        user_id: userId,
        plan_name: metadata?.planName || 'pro',
        billing_cycle: metadata?.billingCycle || 'monthly',
        status: 'active',
        creem_subscription_id: subscription_id,
        creem_customer_id: customer_id,
        current_period_start: now.toISOString(),
        current_period_end: periodEnd.toISOString(),
      }, {
        onConflict: 'user_id'
      })

    console.log('Subscription record created/updated')
  } catch (error) {
    console.error('Error handling subscription created:', error)
  }
}

async function handleSubscriptionCancelled(data: any) {
  console.log('Subscription cancelled:', data)

  const { subscription_id } = data

  try {
    const supabase = await createClient()

    await supabase
      .from('subscriptions')
      .update({
        status: 'cancelled',
        updated_at: new Date().toISOString(),
      })
      .eq('creem_subscription_id', subscription_id)

    console.log('Subscription cancelled successfully')
  } catch (error) {
    console.error('Error handling subscription cancellation:', error)
  }
}

async function handleSubscriptionRenewed(data: any) {
  console.log('Subscription renewed:', data)

  const { subscription_id, metadata } = data

  try {
    const supabase = await createClient()

    // Calculate new period end
    const now = new Date()
    const periodEnd = new Date(now)
    if (metadata?.billingCycle === 'yearly') {
      periodEnd.setFullYear(periodEnd.getFullYear() + 1)
    } else {
      periodEnd.setMonth(periodEnd.getMonth() + 1)
    }

    await supabase
      .from('subscriptions')
      .update({
        status: 'active',
        current_period_start: now.toISOString(),
        current_period_end: periodEnd.toISOString(),
        updated_at: now.toISOString(),
      })
      .eq('creem_subscription_id', subscription_id)

    console.log('Subscription renewed successfully')
  } catch (error) {
    console.error('Error handling subscription renewal:', error)
  }
}

async function handlePaymentFailed(data: any) {
  console.log('Payment failed:', data)

  const { subscription_id } = data

  if (subscription_id) {
    try {
      const supabase = await createClient()

      await supabase
        .from('subscriptions')
        .update({
          status: 'past_due',
          updated_at: new Date().toISOString(),
        })
        .eq('creem_subscription_id', subscription_id)

      console.log('Subscription marked as past_due')
    } catch (error) {
      console.error('Error handling payment failure:', error)
    }
  }
}
