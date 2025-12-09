"use client"

import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import {
  Package,
  Plus,
  Clock,
  CheckCircle,
  XCircle,
  ExternalLink,
  Download,
  Edit,
  Loader2,
} from "lucide-react"

interface Project {
  id: string
  slug: string
  title: string
  description: string
  price: number
  category: string
  status: 'pending' | 'approved' | 'rejected'
  download_count: number
  created_at: string
  demo_url?: string
}

const statusConfig = {
  pending: {
    label: "審核中",
    labelEn: "Pending",
    icon: Clock,
    variant: "secondary" as const,
  },
  approved: {
    label: "已上架",
    labelEn: "Approved",
    icon: CheckCircle,
    variant: "default" as const,
  },
  rejected: {
    label: "未通過",
    labelEn: "Rejected",
    icon: XCircle,
    variant: "destructive" as const,
  },
}

export default function MyProjectsPage() {
  const { t, i18n } = useTranslation()
  const [projects, setProjects] = useState<Project[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    try {
      const response = await fetch('/api/projects?my=true')
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch projects')
      }

      setProjects(data.projects || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  const isZh = i18n.language?.startsWith('zh')

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 py-8 md:py-12">
        <div className="container px-4 md:px-6">
          <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold">
                  {t('myProjects.title', '我的項目')}
                </h1>
                <p className="text-muted-foreground mt-1">
                  {t('myProjects.subtitle', '管理您上架的項目')}
                </p>
              </div>
              <Button asChild>
                <Link href="/dashboard/sell">
                  <Plus className="h-4 w-4 mr-2" />
                  {t('myProjects.addNew', '上架新項目')}
                </Link>
              </Button>
            </div>

            {/* Projects List */}
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : error ? (
              <Card>
                <CardContent className="py-12">
                  <div className="text-center text-muted-foreground">
                    <XCircle className="h-12 w-12 mx-auto mb-4 text-destructive" />
                    <p>{error}</p>
                    <Button
                      variant="outline"
                      className="mt-4"
                      onClick={() => window.location.href = '/auth/signin'}
                    >
                      {t('common.signIn', '登入')}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : projects.length === 0 ? (
              <Card>
                <CardContent className="py-12">
                  <div className="text-center text-muted-foreground">
                    <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p className="font-medium">
                      {t('myProjects.empty', '您還沒有上架任何項目')}
                    </p>
                    <p className="text-sm mt-1">
                      {t('myProjects.emptyHint', '開始上架您的第一個 AI 項目吧！')}
                    </p>
                    <Button className="mt-4" asChild>
                      <Link href="/dashboard/sell">
                        <Plus className="h-4 w-4 mr-2" />
                        {t('myProjects.submitFirst', '提交第一個項目')}
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {projects.map((project) => {
                  const status = statusConfig[project.status]
                  const StatusIcon = status.icon

                  return (
                    <Card key={project.id}>
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between gap-4">
                          <div className="space-y-1 flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <CardTitle className="text-lg">
                                {project.title}
                              </CardTitle>
                              <Badge variant={status.variant} className="shrink-0">
                                <StatusIcon className="h-3 w-3 mr-1" />
                                {isZh ? status.label : status.labelEn}
                              </Badge>
                            </div>
                            <CardDescription className="line-clamp-2">
                              {project.description}
                            </CardDescription>
                          </div>
                          <div className="text-right shrink-0">
                            <div className="text-2xl font-bold">
                              ${project.price}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              USD
                            </div>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Badge variant="outline">{project.category}</Badge>
                            </span>
                            {project.status === 'approved' && (
                              <span className="flex items-center gap-1">
                                <Download className="h-4 w-4" />
                                {project.download_count} {t('myProjects.downloads', '下載')}
                              </span>
                            )}
                            <span>
                              {new Date(project.created_at).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            {project.demo_url && (
                              <Button variant="outline" size="sm" asChild>
                                <a href={project.demo_url} target="_blank" rel="noopener noreferrer">
                                  <ExternalLink className="h-4 w-4 mr-1" />
                                  Demo
                                </a>
                              </Button>
                            )}
                            {project.status === 'approved' && (
                              <Button variant="outline" size="sm" asChild>
                                <Link href={`/projects/${project.slug}`}>
                                  {t('myProjects.view', '查看')}
                                </Link>
                              </Button>
                            )}
                            <Button variant="outline" size="sm" asChild>
                              <Link href={`/dashboard/my-projects/${project.id}/edit`}>
                                <Edit className="h-4 w-4 mr-1" />
                                {t('myProjects.edit', '編輯')}
                              </Link>
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
