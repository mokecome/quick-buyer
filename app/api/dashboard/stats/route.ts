import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { isAdmin } from "@/lib/admin/check-admin"

export async function GET() {
  try {
    const supabase = await createClient()

    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: "Unauthorized", message: "Please sign in to view dashboard" },
        { status: 401 }
      )
    }

    const userIsAdmin = await isAdmin(supabase, user.id, user.email ?? undefined)

    // Get user's purchases count and total spent
    const { data: purchases, error: purchasesError } = await supabase
      .from('purchases')
      .select('id, amount, status')
      .eq('user_id', user.id)
      .eq('status', 'completed')

    if (purchasesError) {
      console.error('Purchases fetch error:', purchasesError)
    }

    const totalPurchases = purchases?.length || 0
    const totalSpent = purchases?.reduce((sum, p) => sum + (p.amount || 0), 0) || 0

    // Get user's total downloads (from their purchases)
    const { data: downloadData, error: downloadError } = await supabase
      .from('purchases')
      .select('download_count')
      .eq('user_id', user.id)
      .eq('status', 'completed')

    if (downloadError) {
      console.error('Download count fetch error:', downloadError)
    }

    const totalDownloads = downloadData?.reduce((sum, p) => sum + (p.download_count || 0), 0) || 0

    // Get user's projects stats (as seller)
    const { data: projects, error: projectsError } = await supabase
      .from('projects')
      .select('id, status, download_count, price')
      .eq('user_id', user.id)

    if (projectsError) {
      console.error('Projects fetch error:', projectsError)
    }

    const myProjects = {
      total: projects?.length || 0,
      approved: projects?.filter(p => p.status === 'approved').length || 0,
      pending: projects?.filter(p => p.status === 'pending').length || 0,
      rejected: projects?.filter(p => p.status === 'rejected').length || 0,
      totalDownloads: projects?.reduce((sum, p) => sum + (p.download_count || 0), 0) || 0,
    }

    // Get sales data (purchases of user's projects)
    const projectIds = projects?.map(p => p.id) || []
    let totalSales = 0
    let totalEarnings = 0

    if (projectIds.length > 0) {
      const { data: sales, error: salesError } = await supabase
        .from('purchases')
        .select('id, amount')
        .in('project_id', projectIds)
        .eq('status', 'completed')

      if (salesError) {
        console.error('Sales fetch error:', salesError)
      }

      totalSales = sales?.length || 0
      totalEarnings = sales?.reduce((sum, s) => sum + (s.amount || 0), 0) || 0
    }

    // Get recent purchases (with project details)
    const { data: recentPurchases, error: recentError } = await supabase
      .from('purchases')
      .select(`
        id,
        amount,
        created_at,
        download_count,
        project:projects(id, title, slug, thumbnail_url)
      `)
      .eq('user_id', user.id)
      .eq('status', 'completed')
      .order('created_at', { ascending: false })
      .limit(5)

    if (recentError) {
      console.error('Recent purchases fetch error:', recentError)
    }

    // Admin stats
    let adminStats = null
    if (userIsAdmin) {
      // Total platform stats
      const { count: totalUsers } = await supabase
        .from('users')
        .select('id', { count: 'exact', head: true })

      const { count: totalProjectsCount } = await supabase
        .from('projects')
        .select('id', { count: 'exact', head: true })

      const { count: pendingProjectsCount } = await supabase
        .from('projects')
        .select('id', { count: 'exact', head: true })
        .eq('status', 'pending')

      const { data: allPurchases } = await supabase
        .from('purchases')
        .select('amount')
        .eq('status', 'completed')

      const platformRevenue = allPurchases?.reduce((sum, p) => sum + (p.amount || 0), 0) || 0

      adminStats = {
        totalUsers: totalUsers || 0,
        totalProjects: totalProjectsCount || 0,
        pendingProjects: pendingProjectsCount || 0,
        platformRevenue,
      }
    }

    return NextResponse.json({
      stats: {
        purchases: {
          total: totalPurchases,
          totalSpent,
          totalDownloads,
        },
        seller: {
          projects: myProjects,
          sales: totalSales,
          earnings: totalEarnings,
        },
      },
      recentPurchases: recentPurchases || [],
      isAdmin: userIsAdmin,
      adminStats,
    })
  } catch (error) {
    console.error('Dashboard stats error:', error)
    return NextResponse.json(
      { error: "Internal Server Error", message: "Failed to fetch dashboard stats" },
      { status: 500 }
    )
  }
}
