import { NextResponse } from "next/server"

// Use Microlink API to generate screenshots (free tier: 100/day)
export async function POST(request: Request) {
  try {
    const { url } = await request.json()

    if (!url) {
      return NextResponse.json(
        { error: "Bad Request", message: "URL is required" },
        { status: 400 }
      )
    }

    // Validate URL format
    try {
      new URL(url)
    } catch {
      return NextResponse.json(
        { error: "Bad Request", message: "Invalid URL format" },
        { status: 400 }
      )
    }

    // Microlink screenshot API (free tier)
    // Options: https://microlink.io/docs/api/parameters/screenshot
    const screenshotUrl = `https://api.microlink.io/?url=${encodeURIComponent(url)}&screenshot=true&meta=false&embed=screenshot.url&viewport.width=1280&viewport.height=720&viewport.deviceScaleFactor=1`

    const response = await fetch(screenshotUrl)
    const data = await response.json()

    if (data.status === 'success' && data.data?.screenshot?.url) {
      return NextResponse.json({
        success: true,
        screenshotUrl: data.data.screenshot.url,
      })
    }

    // Fallback: return the Microlink CDN URL directly
    const fallbackUrl = `https://api.microlink.io/?url=${encodeURIComponent(url)}&screenshot=true&meta=false&embed=screenshot.url`

    return NextResponse.json({
      success: true,
      screenshotUrl: fallbackUrl,
    })
  } catch (error) {
    console.error('Screenshot API error:', error)
    return NextResponse.json(
      { error: "Internal Server Error", message: "Failed to generate screenshot" },
      { status: 500 }
    )
  }
}
