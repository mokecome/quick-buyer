import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

// GET - Fetch a single project by ID or slug
export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()

    // Check if slug is a UUID (ID) or actual slug
    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(slug)

    // Fetch the project by ID or slug
    let query = supabase.from('projects').select('*')

    if (isUUID) {
      query = query.eq('id', slug)
    } else {
      query = query.eq('slug', slug)
    }

    const { data: project, error } = await query.single()

    if (error || !project) {
      return NextResponse.json(
        { error: "Not Found", message: "Project not found" },
        { status: 404 }
      )
    }

    // Check if user owns the project or if it's approved (public)
    if (project.status !== 'approved' && (!user || project.user_id !== user.id)) {
      return NextResponse.json(
        { error: "Forbidden", message: "You don't have access to this project" },
        { status: 403 }
      )
    }

    return NextResponse.json({ project })
  } catch (error) {
    console.error('GET /api/projects/[slug] error:', error)
    return NextResponse.json(
      { error: "Internal Server Error", message: "An unexpected error occurred" },
      { status: 500 }
    )
  }
}

// PUT - Update a project
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    const supabase = await createClient()

    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: "Unauthorized", message: "Please sign in to update a project" },
        { status: 401 }
      )
    }

    // Check if slug is a UUID (ID) or actual slug
    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(slug)

    // Verify ownership
    let query = supabase.from('projects').select('id, user_id, status')
    if (isUUID) {
      query = query.eq('id', slug)
    } else {
      query = query.eq('slug', slug)
    }

    const { data: existingProject, error: fetchError } = await query.single()

    if (fetchError || !existingProject) {
      return NextResponse.json(
        { error: "Not Found", message: "Project not found" },
        { status: 404 }
      )
    }

    if (existingProject.user_id !== user.id) {
      return NextResponse.json(
        { error: "Forbidden", message: "You can only update your own projects" },
        { status: 403 }
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

    // Update the project (reset to pending if it was approved/rejected and content changed)
    const shouldResetStatus = existingProject.status !== 'pending'

    const { data: project, error: updateError } = await supabase
      .from('projects')
      .update({
        title,
        description,
        long_description: body.longDescription || null,
        price: parseFloat(price) || 0,
        category,
        download_url: downloadUrl,
        docs_url: body.docsUrl || null,
        demo_url: body.demoUrl || null,
        // Reset status to pending if significant changes were made
        ...(shouldResetStatus ? { status: 'pending' } : {}),
        updated_at: new Date().toISOString(),
      })
      .eq('id', existingProject.id)
      .select()
      .single()

    if (updateError) {
      console.error('Project update error:', updateError)
      return NextResponse.json(
        { error: "Database Error", message: updateError.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: shouldResetStatus
        ? "Project updated and submitted for re-review"
        : "Project updated successfully",
      project,
    })
  } catch (error) {
    console.error('PUT /api/projects/[slug] error:', error)
    return NextResponse.json(
      { error: "Internal Server Error", message: "An unexpected error occurred" },
      { status: 500 }
    )
  }
}

// DELETE - Delete a project
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    const supabase = await createClient()

    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: "Unauthorized", message: "Please sign in to delete a project" },
        { status: 401 }
      )
    }

    // Check if slug is a UUID (ID) or actual slug
    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(slug)

    // Verify ownership
    let query = supabase.from('projects').select('id, user_id')
    if (isUUID) {
      query = query.eq('id', slug)
    } else {
      query = query.eq('slug', slug)
    }

    const { data: existingProject, error: fetchError } = await query.single()

    if (fetchError || !existingProject) {
      return NextResponse.json(
        { error: "Not Found", message: "Project not found" },
        { status: 404 }
      )
    }

    if (existingProject.user_id !== user.id) {
      return NextResponse.json(
        { error: "Forbidden", message: "You can only delete your own projects" },
        { status: 403 }
      )
    }

    // Delete the project
    const { error: deleteError } = await supabase
      .from('projects')
      .delete()
      .eq('id', existingProject.id)

    if (deleteError) {
      console.error('Project delete error:', deleteError)
      return NextResponse.json(
        { error: "Database Error", message: deleteError.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: "Project deleted successfully",
    })
  } catch (error) {
    console.error('DELETE /api/projects/[slug] error:', error)
    return NextResponse.json(
      { error: "Internal Server Error", message: "An unexpected error occurred" },
      { status: 500 }
    )
  }
}
