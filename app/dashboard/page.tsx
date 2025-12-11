"use client"

import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import {
  Package,
  Download,
  DollarSign,
  Store,
  Plus,
  LayoutList,
  Loader2,
  TrendingUp,
  Users,
  Clock,
  ShoppingCart,
  ExternalLink,
} from "lucide-react"

interface DashboardStats {
  purchases: {
    total: number
    totalSpent: number
    totalDownloads: number
  }
  seller: {
    projects: {
      total: number
      approved: number
      pending: number
      rejected: number
      totalDownloads: number
    }
    sales: number
    earnings: number
  }
}

interface RecentPurchase {
  id: string
  amount: number
  created_at: string
  download_count: number
  project: {
    id: string
    title: string
    slug: string
    thumbnail_url: string | null
  } | null
}

interface AdminStats {
  totalUsers: number
  totalProjects: number
  pendingProjects: number
  platformRevenue: number
}

export default function DashboardPage() {
  const { t, i18n } = useTranslation()
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [recentPurchases, setRecentPurchases] = useState<RecentPurchase[]>([])
  const [isAdmin, setIsAdmin] = useState(false)
  const [adminStats, setAdminStats] = useState<AdminStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const isZh = i18n.language?.startsWith('zh')

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/dashboard/stats')
        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.message || 'Failed to fetch stats')
        }

        setStats(data.stats)
        setRecentPurchases(data.recentPurchases || [])
        setIsAdmin(data.isAdmin || false)
        setAdminStats(data.adminStats)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setIsLoading(false)
      }
    }

    fetchStats()
  }, [])

  const formatCurrency = (amount: number) => {
    return `$${amount.toLocaleString()}`
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 py-12">
          <div className="container px-4 md:px-6 flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 py-12">
          <div className="container px-4 md:px-6">
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground mb-4">{error}</p>
                <Button asChild>
                  <Link href="/auth/signin">
                    {isZh ? '登入' : 'Sign In'}
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 py-12">
        <div className="container px-4 md:px-6">
          <div className="space-y-8">
            {/* Header */}
            <div>
              <h1 className="text-3xl font-bold">
                {isZh ? '控制台' : 'Dashboard'}
              </h1>
              <p className="text-muted-foreground">
                {isZh ? '歡迎回來！這是您帳戶的概覽。' : "Welcome back! Here's an overview of your account."}
              </p>
            </div>

            {/* Admin Stats (if admin) */}
            {isAdmin && adminStats && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  {isZh ? '平台統計' : 'Platform Stats'}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <Card className="border-blue-200 bg-blue-50/50 dark:border-blue-900 dark:bg-blue-950/20">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <CardTitle className="text-sm font-medium text-muted-foreground">
                        {isZh ? '總用戶數' : 'Total Users'}
                      </CardTitle>
                      <Users className="h-4 w-4 text-blue-600" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{adminStats.totalUsers}</div>
                    </CardContent>
                  </Card>

                  <Card className="border-green-200 bg-green-50/50 dark:border-green-900 dark:bg-green-950/20">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <CardTitle className="text-sm font-medium text-muted-foreground">
                        {isZh ? '總項目數' : 'Total Projects'}
                      </CardTitle>
                      <Package className="h-4 w-4 text-green-600" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{adminStats.totalProjects}</div>
                    </CardContent>
                  </Card>

                  <Card className="border-yellow-200 bg-yellow-50/50 dark:border-yellow-900 dark:bg-yellow-950/20">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <CardTitle className="text-sm font-medium text-muted-foreground">
                        {isZh ? '待審核' : 'Pending Review'}
                      </CardTitle>
                      <Clock className="h-4 w-4 text-yellow-600" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{adminStats.pendingProjects}</div>
                      {adminStats.pendingProjects > 0 && (
                        <Button variant="link" size="sm" className="p-0 h-auto" asChild>
                          <Link href="/dashboard/my-projects">
                            {isZh ? '查看' : 'View'} →
                          </Link>
                        </Button>
                      )}
                    </CardContent>
                  </Card>

                  <Card className="border-purple-200 bg-purple-50/50 dark:border-purple-900 dark:bg-purple-950/20">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <CardTitle className="text-sm font-medium text-muted-foreground">
                        {isZh ? '平台收入' : 'Platform Revenue'}
                      </CardTitle>
                      <DollarSign className="h-4 w-4 text-purple-600" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{formatCurrency(adminStats.platformRevenue)}</div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}

            {/* Buyer Stats */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <ShoppingCart className="h-5 w-5" />
                {isZh ? '購買統計' : 'Purchase Stats'}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      {isZh ? '已購買項目' : 'Total Purchases'}
                    </CardTitle>
                    <Package className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats?.purchases.total || 0}</div>
                    <p className="text-xs text-muted-foreground">
                      {isZh ? '已購買的項目' : 'Projects purchased'}
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      {isZh ? '下載次數' : 'Downloads'}
                    </CardTitle>
                    <Download className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats?.purchases.totalDownloads || 0}</div>
                    <p className="text-xs text-muted-foreground">
                      {isZh ? '總下載次數' : 'Total downloads'}
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      {isZh ? '總消費' : 'Total Spent'}
                    </CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {formatCurrency(stats?.purchases.totalSpent || 0)}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {isZh ? '累計消費金額' : 'Lifetime spending'}
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Seller Section */}
            <Card className="border-primary/20 bg-primary/5">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Store className="h-5 w-5 text-primary" />
                  <CardTitle>{isZh ? '賣家中心' : 'Seller Dashboard'}</CardTitle>
                </div>
                <CardDescription>
                  {isZh ? '上架您的 AI 項目並賺取收益' : 'Sell your AI projects and earn money'}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Seller Stats */}
                {stats && stats.seller.projects.total > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div className="text-center p-3 bg-background rounded-lg">
                      <div className="text-2xl font-bold">{stats.seller.projects.total}</div>
                      <div className="text-xs text-muted-foreground">
                        {isZh ? '我的項目' : 'My Projects'}
                      </div>
                    </div>
                    <div className="text-center p-3 bg-background rounded-lg">
                      <div className="text-2xl font-bold text-green-600">{stats.seller.projects.approved}</div>
                      <div className="text-xs text-muted-foreground">
                        {isZh ? '已上架' : 'Approved'}
                      </div>
                    </div>
                    <div className="text-center p-3 bg-background rounded-lg">
                      <div className="text-2xl font-bold">{stats.seller.sales}</div>
                      <div className="text-xs text-muted-foreground">
                        {isZh ? '銷售數量' : 'Total Sales'}
                      </div>
                    </div>
                    <div className="text-center p-3 bg-background rounded-lg">
                      <div className="text-2xl font-bold text-primary">
                        {formatCurrency(stats.seller.earnings)}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {isZh ? '總收益' : 'Earnings'}
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row gap-3">
                  <Button asChild>
                    <Link href="/dashboard/sell">
                      <Plus className="h-4 w-4 mr-2" />
                      {isZh ? '上架新項目' : 'Submit New Project'}
                    </Link>
                  </Button>
                  <Button variant="outline" asChild>
                    <Link href="/dashboard/my-projects">
                      <LayoutList className="h-4 w-4 mr-2" />
                      {isZh ? '我的項目' : 'My Projects'}
                      {stats && stats.seller.projects.pending > 0 && (
                        <span className="ml-2 px-2 py-0.5 text-xs bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 rounded-full">
                          {stats.seller.projects.pending} {isZh ? '審核中' : 'pending'}
                        </span>
                      )}
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>{isZh ? '我的購買' : 'My Purchases'}</CardTitle>
                  <CardDescription>
                    {isZh ? '查看和下載您購買的項目' : 'Access and download your purchased projects'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button asChild>
                    <Link href="/dashboard/purchases">
                      {isZh ? '查看購買記錄' : 'View Purchases'}
                    </Link>
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>{isZh ? '瀏覽項目' : 'Browse Projects'}</CardTitle>
                  <CardDescription>
                    {isZh ? '發現新的 AI 項目和模板' : 'Discover new code projects and templates'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" asChild>
                    <Link href="/projects">
                      {isZh ? '探索項目' : 'Explore Projects'}
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Recent Purchases */}
            <Card>
              <CardHeader>
                <CardTitle>{isZh ? '最近購買' : 'Recent Purchases'}</CardTitle>
                <CardDescription>
                  {isZh ? '您最近購買的項目' : 'Your latest project purchases'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {recentPurchases.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>{isZh ? '尚無購買記錄' : 'No purchases yet'}</p>
                    <p className="text-sm">
                      {isZh ? '開始瀏覽我們的' : 'Start by browsing our'}{" "}
                      <Link href="/projects" className="text-primary hover:underline">
                        {isZh ? '項目目錄' : 'project catalog'}
                      </Link>
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {recentPurchases.map((purchase) => (
                      <div
                        key={purchase.id}
                        className="flex items-center justify-between p-4 border rounded-lg"
                      >
                        <div className="flex items-center gap-4">
                          {purchase.project?.thumbnail_url ? (
                            <img
                              src={purchase.project.thumbnail_url}
                              alt={purchase.project.title}
                              className="w-12 h-12 rounded object-cover"
                            />
                          ) : (
                            <div className="w-12 h-12 rounded bg-muted flex items-center justify-center">
                              <Package className="h-6 w-6 text-muted-foreground" />
                            </div>
                          )}
                          <div>
                            <p className="font-medium">{purchase.project?.title || 'Unknown Project'}</p>
                            <p className="text-sm text-muted-foreground">
                              {new Date(purchase.created_at).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="font-medium">{formatCurrency(purchase.amount)}</span>
                          {purchase.project?.slug && (
                            <Button variant="ghost" size="sm" asChild>
                              <Link href={`/projects/${purchase.project.slug}`}>
                                <ExternalLink className="h-4 w-4" />
                              </Link>
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                    {recentPurchases.length > 0 && (
                      <Button variant="outline" className="w-full" asChild>
                        <Link href="/dashboard/purchases">
                          {isZh ? '查看全部購買記錄' : 'View All Purchases'}
                        </Link>
                      </Button>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
