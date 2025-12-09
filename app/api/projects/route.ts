import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { isAdmin } from "@/lib/admin/check-admin"

// Generate URL-friendly slug from title
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

// POST - Create a new project
export async function POST(request: Request) {
  try {
    const supabase = await createClient()

    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: "Unauthorized", message: "Please sign in to submit a project" },
        { status: 401 }
      )
    }

    const body = await request.json()

    // Validate required fields
    const { title, description, price, category, downloadUrl } = body

    if (!title || !description || price === undefined || !category || !downloadUrl) {
      return NextResponse.json(
        { error: "Bad Request", message: "Missing required fields" },
        { status: 400 }
      )
    }

    // Generate slug
    const baseSlug = generateSlug(title)
    let slug = baseSlug
    let counter = 1

    // Check if slug already exists and make it unique
    while (true) {
      const { data: existing } = await supabase
        .from('projects')
        .select('id')
        .eq('slug', slug)
        .single()

      if (!existing) break
      slug = `${baseSlug}-${counter}`
      counter++
    }

    // Insert the project
    const { data: project, error: insertError } = await supabase
      .from('projects')
      .insert({
        title,
        slug,
        description,
        long_description: body.longDescription || null,
        price: parseFloat(price) || 0,
        category,
        download_url: downloadUrl,
        docs_url: body.docsUrl || null,
        demo_url: body.demoUrl || null,
        user_id: user.id,
        author_name: user.user_metadata?.full_name || user.user_metadata?.user_name || user.email?.split('@')[0] || 'Anonymous',
        author_avatar: user.user_metadata?.avatar_url || null,
        status: 'pending', // pending, approved, rejected
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (insertError) {
      console.error('Project insert error:', insertError)
      return NextResponse.json(
        { error: "Database Error", message: insertError.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: "Project submitted successfully",
      project,
    })
  } catch (error) {
    console.error('POST /api/projects error:', error)
    return NextResponse.json(
      { error: "Internal Server Error", message: "An unexpected error occurred" },
      { status: 500 }
    )
  }
}

// GET - Fetch projects (with optional filtering for user's own projects)
export async function GET(request: Request) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)

    const myProjects = searchParams.get('my') === 'true'
    const allProjects = searchParams.get('all') === 'true' // Admin only: view all projects
    const status = searchParams.get('status')
    const limit = searchParams.get('limit')
    const category = searchParams.get('category')

    // Get current user for permission checks
    const { data: { user } } = await supabase.auth.getUser()
    const userIsAdmin = user ? await isAdmin(supabase, user.id, user.email ?? undefined) : false

    let query = supabase.from('projects').select('*')

    if (allProjects && userIsAdmin) {
      // Admin can view all projects (no status filter by default)
      // Status can still be filtered via query param
    } else if (myProjects) {
      // Get current user's projects
      if (!user) {
        return NextResponse.json(
          { error: "Unauthorized", message: "Please sign in to view your projects" },
          { status: 401 }
        )
      }

      query = query.eq('user_id', user.id)
    } else {
      // Public listing - only show approved projects
      query = query.eq('status', 'approved')
    }

    if (status) {
      query = query.eq('status', status)
    }

    if (category && category !== 'All') {
      query = query.eq('category', category)
    }

    // Order by download count (popularity) then by created date
    query = query.order('download_count', { ascending: false }).order('created_at', { ascending: false })

    // Apply limit if specified
    if (limit) {
      const limitNum = parseInt(limit, 10)
      if (!isNaN(limitNum) && limitNum > 0) {
        query = query.limit(limitNum)
      }
    }

    const { data: projects, error } = await query

    if (error) {
      console.error('Projects fetch error:', error)
      return NextResponse.json(
        { error: "Database Error", message: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ projects, isAdmin: userIsAdmin })
  } catch (error) {
    console.error('GET /api/projects error:', error)
    return NextResponse.json(
      { error: "Internal Server Error", message: "An unexpected error occurred" },
      { status: 500 }
    )
  }
}
