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
        thumbnail_url: body.thumbnailUrl || null,
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

// GET - Fetch projects (with optional filtering, pagination, and search)
export async function GET(request: Request) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)

    // Query parameters
    const myProjects = searchParams.get('my') === 'true'
    const allProjects = searchParams.get('all') === 'true' // Admin only: view all projects
    const status = searchParams.get('status')
    const category = searchParams.get('category')
    const search = searchParams.get('search') || searchParams.get('q') // Search query
    const sortBy = searchParams.get('sort') || 'popular' // popular, newest, price_low, price_high

    // Pagination parameters
    const page = parseInt(searchParams.get('page') || '1', 10)
    const limit = parseInt(searchParams.get('limit') || '12', 10)
    const offset = (page - 1) * limit

    // Get current user for permission checks
    const { data: { user } } = await supabase.auth.getUser()
    const userIsAdmin = user ? await isAdmin(supabase, user.id, user.email ?? undefined) : false

    // Build base query with count
    let query = supabase.from('projects').select('*', { count: 'exact' })

    // Apply access control filters
    if (allProjects && userIsAdmin) {
      // Admin can view all projects (no status filter by default)
    } else if (myProjects) {
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

    // Apply status filter
    if (status) {
      query = query.eq('status', status)
    }

    // Apply category filter
    if (category && category !== 'All') {
      query = query.eq('category', category)
    }

    // Apply search filter (searches title, description, author_name, category)
    if (search && search.trim()) {
      const searchTerm = search.trim()
      query = query.or(
        `title.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%,author_name.ilike.%${searchTerm}%,category.ilike.%${searchTerm}%`
      )
    }

    // Apply sorting
    switch (sortBy) {
      case 'newest':
        query = query.order('created_at', { ascending: false })
        break
      case 'oldest':
        query = query.order('created_at', { ascending: true })
        break
      case 'price_low':
        query = query.order('price', { ascending: true })
        break
      case 'price_high':
        query = query.order('price', { ascending: false })
        break
      case 'rating':
        query = query.order('rating', { ascending: false }).order('review_count', { ascending: false })
        break
      case 'popular':
      default:
        query = query.order('download_count', { ascending: false }).order('created_at', { ascending: false })
        break
    }

    // Apply pagination
    query = query.range(offset, offset + limit - 1)

    const { data: projects, error, count } = await query

    if (error) {
      console.error('Projects fetch error:', error)
      return NextResponse.json(
        { error: "Database Error", message: error.message },
        { status: 500 }
      )
    }

    // Calculate pagination metadata
    const totalCount = count || 0
    const totalPages = Math.ceil(totalCount / limit)
    const hasNextPage = page < totalPages
    const hasPrevPage = page > 1

    return NextResponse.json({
      projects,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages,
        hasNextPage,
        hasPrevPage,
      },
      isAdmin: userIsAdmin,
    })
  } catch (error) {
    console.error('GET /api/projects error:', error)
    return NextResponse.json(
      { error: "Internal Server Error", message: "An unexpected error occurred" },
      { status: 500 }
    )
  }
}
