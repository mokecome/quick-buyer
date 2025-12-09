import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json(
        { error: 'Please sign in to download' },
        { status: 401 }
      )
    }

    // Get project with download info
    const { data: project, error: projectError } = await supabase
      .from('projects')
      .select('id, download_url, docs_url, title')
      .eq('slug', slug)
      .single()

    if (projectError || !project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      )
    }

    // Check if user has subscription access
    const { data: subscription } = await supabase
      .from('subscriptions')
      .select('status, current_period_end')
      .eq('user_id', user.id)
      .eq('status', 'active')
      .single()

    const isSubscriber = subscription &&
      new Date(subscription.current_period_end) > new Date()

    // If not subscriber, check if user purchased this project
    if (!isSubscriber) {
      const { data: purchase } = await supabase
        .from('purchases')
        .select('id, download_count')
        .eq('project_id', project.id)
        .eq('user_id', user.id)
        .eq('status', 'completed')
        .single()

      if (!purchase) {
        return NextResponse.json(
          { error: 'You need to purchase this project or subscribe to access it' },
          { status: 403 }
        )
      }

      // Update download count for purchased project
      await supabase
        .from('purchases')
        .update({
          download_count: (purchase.download_count || 0) + 1,
          last_downloaded_at: new Date().toISOString(),
        })
        .eq('id', purchase.id)

      // Also increment project download count
      await supabase.rpc('increment_project_download_count', { project_slug: slug })
    }

    // Return download URLs
    return NextResponse.json({
      download_url: project.download_url,
      docs_url: project.docs_url,
      title: project.title,
    })
  } catch (error) {
    console.error('Download error:', error)
    return NextResponse.json(
      { error: 'Failed to get download link' },
      { status: 500 }
    )
  }
}
