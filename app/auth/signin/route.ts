import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const origin = new URL(request.url).origin

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: {
        redirectTo: `${origin}/auth/callback`,
      },
    })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ url: data.url })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Authentication service unavailable'
    return NextResponse.json({ error: message }, { status: 503 })
  }
}

export async function GET(request: Request) {
  try {
    const supabase = await createClient()
    const origin = new URL(request.url).origin

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: {
        redirectTo: `${origin}/auth/callback`,
      },
    })

    if (error) {
      return NextResponse.redirect(`${origin}?error=${encodeURIComponent(error.message)}`)
    }

    return NextResponse.redirect(data.url!)
  } catch (error) {
    const origin = new URL(request.url).origin
    const message = error instanceof Error ? error.message : 'Authentication service unavailable'
    return NextResponse.redirect(`${origin}?error=${encodeURIComponent(message)}`)
  }
}
