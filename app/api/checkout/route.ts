import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { productId, projectSlug, projectTitle, price } = body

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

    console.log('Creating checkout session:', { productId, projectSlug, projectTitle })

    // Determine API base URL based on API key type
    const isTestMode = apiKey.includes('_test_')
    const baseUrl = isTestMode ? 'https://test-api.creem.io' : 'https://api.creem.io'

    console.log('Using API URL:', baseUrl, '(Test mode:', isTestMode, ')')

    // Create checkout session with Creem
    const response = await fetch(`${baseUrl}/v1/checkouts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
      },
      body: JSON.stringify({
        product_id: productId,
        units: 1,
        success_url: `${process.env.NEXT_PUBLIC_APP_URL}/success?project=${projectSlug}`,
        cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/projects/${projectSlug}`,
        metadata: {
          projectSlug,
          projectTitle,
          price: price?.toString(),
        },
      }),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      console.error('Creem API error:', errorData)

      let errorMessage = 'Failed to create checkout session'
      if (response.status === 403) {
        errorMessage = 'Invalid API Key or Product ID. Please check your configuration.'
      } else if (response.status === 404) {
        errorMessage = 'Product not found. Please verify the Product ID.'
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
      return NextResponse.json(
        { error: 'Invalid response from payment provider' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      url: data.checkout_url,
      checkoutId: data.checkout_id,
    })
  } catch (error) {
    console.error('Checkout error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
