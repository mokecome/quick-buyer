import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

interface CartItem {
  id: string
  slug: string
  title: string
  price: number
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { items } = body as { items: CartItem[] }

    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: 'Cart is empty' },
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

    // Calculate total
    const totalAmount = items.reduce((sum, item) => sum + item.price, 0)

    // For cart checkout, we use a generic product or create line items
    // Since Creem may not support multiple products in one checkout,
    // we'll use metadata to track the items
    const productId = process.env.NEXT_PUBLIC_CREEM_CART_PRODUCT_ID || process.env.NEXT_PUBLIC_CREEM_PRO_MONTHLY_ID

    if (!productId) {
      return NextResponse.json(
        { error: 'Cart product ID not configured' },
        { status: 500 }
      )
    }

    const checkoutBody: Record<string, any> = {
      product_id: productId,
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/success?type=cart`,
      request_id: `cart_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      metadata: {
        type: 'cart',
        items: JSON.stringify(items.map(i => ({ id: i.id, slug: i.slug, price: i.price }))),
        totalAmount: totalAmount.toString(),
        userId,
      },
    }

    // Add customer email if available
    if (userEmail) {
      checkoutBody.customer_email = userEmail
    }

    console.log('Creating cart checkout session:', { itemCount: items.length, totalAmount })

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

      return NextResponse.json(
        {
          error: 'Failed to create checkout session',
          details: errorData,
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
    console.error('Cart checkout error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
