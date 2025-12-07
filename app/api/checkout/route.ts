import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { productId, planName, billingCycle, price, projectSlug, projectTitle } = body

    if (!productId) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      )
    }

    const apiKey = process.env.CREEM_API_KEY
    if (!apiKey) {
      return NextResponse.json(
        { error: 'Payment API key not configured' },
        { status: 500 }
      )
    }

    // Get current user if logged in
    let userEmail: string | undefined
    let userId: string | undefined
    try {
      const supabase = await createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        userEmail = user.email
        userId = user.id
      }
    } catch (e) {
      // User not logged in, continue without user info
    }

    // Determine API base URL based on API key type
    const isTestMode = apiKey.includes('_test_')
    const baseUrl = isTestMode ? 'https://test-api.creem.io' : 'https://api.creem.io'

    console.log('Creating checkout session:', { productId, planName, billingCycle, price })
    console.log('Using API URL:', baseUrl, '(Test mode:', isTestMode, ')')

    // Determine success and cancel URLs based on checkout type
    const isSubscription = !!planName // If planName exists, it's a subscription checkout
    const successUrl = isSubscription
      ? `${process.env.NEXT_PUBLIC_APP_URL}/success?plan=${planName}&billing=${billingCycle}`
      : `${process.env.NEXT_PUBLIC_APP_URL}/success?project=${projectSlug}`
    const cancelUrl = isSubscription
      ? `${process.env.NEXT_PUBLIC_APP_URL}/pricing`
      : `${process.env.NEXT_PUBLIC_APP_URL}/projects/${projectSlug}`

    // Build checkout request body
    const checkoutBody: Record<string, any> = {
      product_id: productId,
      success_url: successUrl,
      request_id: `checkout_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    }

    // Add metadata
    checkoutBody.metadata = isSubscription
      ? {
          planName,
          billingCycle,
          price: price?.toString(),
          userId,
        }
      : {
          projectSlug,
          projectTitle,
          price: price?.toString(),
          userId,
        }

    // Add customer email if available
    if (userEmail) {
      checkoutBody.customer_email = userEmail
    }

    // Create checkout session with Creem
    const response = await fetch(`${baseUrl}/v1/checkouts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
      },
      body: JSON.stringify(checkoutBody),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      console.error('Creem API error:', response.status, errorData)

      let errorMessage = 'Failed to create checkout session'
      if (response.status === 403) {
        errorMessage = 'Invalid API Key or Product ID. Please check your configuration.'
      } else if (response.status === 404) {
        errorMessage = 'Product not found. Please verify the Product ID in Creem dashboard.'
      } else if (response.status === 400) {
        errorMessage = errorData.message || 'Invalid request parameters.'
      }

      return NextResponse.json(
        {
          error: errorMessage,
          details: errorData,
          status: response.status
        },
        { status: response.status }
      )
    }

    const data = await response.json()

    if (!data.checkout_url) {
      console.error('Missing checkout_url in response:', data)
      return NextResponse.json(
        { error: 'Invalid response from payment provider' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      url: data.checkout_url,
      checkoutId: data.id,
    })
  } catch (error) {
    console.error('Checkout error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
