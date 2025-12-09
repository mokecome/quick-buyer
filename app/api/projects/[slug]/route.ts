import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { isAdmin } from "@/lib/admin/check-admin"

// GET - Fetch a single project by ID or slug
export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    const userIsAdmin = user ? await isAdmin(supabase, user.id, user.email ?? undefined) : false

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

    // Admin can view any project, otherwise check ownership or approval status
    if (!userIsAdmin) {
      if (project.status !== 'approved' && (!user || project.user_id !== user.id)) {
        return NextResponse.json(
          { error: "Forbidden", message: "You don't have access to this project" },
          { status: 403 }
        )
      }
    }

    return NextResponse.json({ project, isAdmin: userIsAdmin })
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

    const userIsAdmin = await isAdmin(supabase, user.id, user.email ?? undefined)

    // Check if slug is a UUID (ID) or actual slug
    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(slug)

    // Fetch project
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

    // Check permission: admin can update any project, otherwise only owner
    if (!userIsAdmin && existingProject.user_id !== user.id) {
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

    // Admin can update status directly, regular users reset to pending
    const isOwner = existingProject.user_id === user.id
    const shouldResetStatus = !userIsAdmin && isOwner && existingProject.status !== 'pending'

    // Build update object
    const updateData: Record<string, unknown> = {
      title,
      description,
      long_description: body.longDescription || null,
      price: parseFloat(price) || 0,
      category,
      download_url: downloadUrl,
      docs_url: body.docsUrl || null,
      demo_url: body.demoUrl || null,
      updated_at: new Date().toISOString(),
    }

    // Admin can update status directly
    if (userIsAdmin && body.status) {
      updateData.status = body.status
    } else if (shouldResetStatus) {
      updateData.status = 'pending'
    }

    const { data: project, error: updateError } = await supabase
      .from('projects')
      .update(updateData)
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
      message: userIsAdmin
        ? "Project updated successfully"
        : shouldResetStatus
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

    const userIsAdmin = await isAdmin(supabase, user.id, user.email ?? undefined)

    // Check if slug is a UUID (ID) or actual slug
    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(slug)

    // Fetch project
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

    // Check permission: admin can delete any project, otherwise only owner
    if (!userIsAdmin && existingProject.user_id !== user.id) {
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
