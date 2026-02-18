"use client"

import { useEffect, useState } from "react"
import { useTranslations, useLocale } from "next-intl"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
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
  ChevronDown,
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
  author_name?: string
}

type ProjectStatus = 'pending' | 'approved' | 'rejected'

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
  const t = useTranslations()
  const locale = useLocale()
  const [projects, setProjects] = useState<Project[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isAdmin, setIsAdmin] = useState(false)

  // Status change dialog state
  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [newStatus, setNewStatus] = useState<ProjectStatus | null>(null)
  const [isUpdating, setIsUpdating] = useState(false)

  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    try {
      // Admin sees all projects, regular users see their own
      const response = await fetch('/api/projects?all=true')
      const data = await response.json()

      if (!response.ok) {
        // If not admin, fallback to my projects
        if (response.status === 401) {
          const myResponse = await fetch('/api/projects?my=true')
          const myData = await myResponse.json()
          if (!myResponse.ok) {
            throw new Error(myData.message || 'Failed to fetch projects')
          }
          setProjects(myData.projects || [])
          setIsAdmin(false)
        } else {
          throw new Error(data.message || 'Failed to fetch projects')
        }
      } else {
        setProjects(data.projects || [])
        setIsAdmin(data.isAdmin || false)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  const handleStatusClick = (project: Project, status: ProjectStatus) => {
    setSelectedProject(project)
    setNewStatus(status)
    setDialogOpen(true)
  }

  const confirmStatusChange = async () => {
    if (!selectedProject || !newStatus) return

    setIsUpdating(true)
    try {
      const response = await fetch(`/api/projects/${selectedProject.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: newStatus,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.message || 'Failed to update status')
      }

      // Update local state
      setProjects(projects.map(p =>
        p.id === selectedProject.id ? { ...p, status: newStatus } : p
      ))
    } catch (err) {
      console.error('Status update error:', err)
      alert(err instanceof Error ? err.message : 'Failed to update status')
    } finally {
      setIsUpdating(false)
      setDialogOpen(false)
      setSelectedProject(null)
      setNewStatus(null)
    }
  }

  const isZh = locale.startsWith('zh') || locale === 'ch'

  const getStatusLabel = (status: ProjectStatus) => {
    const config = statusConfig[status]
    return isZh ? config.label : config.labelEn
  }

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
                  {isAdmin
                    ? (isZh ? '項目管理' : 'Project Management')
                    : t('myProjects.title')
                  }
                </h1>
                <p className="text-muted-foreground mt-1">
                  {isAdmin
                    ? (isZh ? '審核和管理所有項目' : 'Review and manage all projects')
                    : t('myProjects.subtitle')
                  }
                </p>
              </div>
              <Button asChild>
                <Link href="/dashboard/sell">
                  <Plus className="h-4 w-4 mr-2" />
                  {t('myProjects.addNew')}
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
                      {t('common.signIn')}
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
                      {t('myProjects.empty')}
                    </p>
                    <p className="text-sm mt-1">
                      {t('myProjects.emptyHint')}
                    </p>
                    <Button className="mt-4" asChild>
                      <Link href="/dashboard/sell">
                        <Plus className="h-4 w-4 mr-2" />
                        {t('myProjects.submitFirst')}
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
                              {/* Admin: Clickable status dropdown */}
                              {isAdmin ? (
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="h-auto p-0 hover:bg-transparent"
                                    >
                                      <Badge
                                        variant={status.variant}
                                        className="shrink-0 cursor-pointer hover:opacity-80"
                                      >
                                        <StatusIcon className="h-3 w-3 mr-1" />
                                        {isZh ? status.label : status.labelEn}
                                        <ChevronDown className="h-3 w-3 ml-1" />
                                      </Badge>
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="start">
                                    <DropdownMenuItem
                                      onClick={() => handleStatusClick(project, 'approved')}
                                      disabled={project.status === 'approved'}
                                    >
                                      <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                                      {isZh ? '審核通過' : 'Approve'}
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      onClick={() => handleStatusClick(project, 'pending')}
                                      disabled={project.status === 'pending'}
                                    >
                                      <Clock className="h-4 w-4 mr-2 text-yellow-600" />
                                      {isZh ? '設為審核中' : 'Set Pending'}
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      onClick={() => handleStatusClick(project, 'rejected')}
                                      disabled={project.status === 'rejected'}
                                    >
                                      <XCircle className="h-4 w-4 mr-2 text-red-600" />
                                      {isZh ? '拒絕' : 'Reject'}
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              ) : (
                                <Badge variant={status.variant} className="shrink-0">
                                  <StatusIcon className="h-3 w-3 mr-1" />
                                  {isZh ? status.label : status.labelEn}
                                </Badge>
                              )}
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
                            {isAdmin && project.author_name && (
                              <span className="text-xs">
                                by {project.author_name}
                              </span>
                            )}
                            {project.status === 'approved' && (
                              <span className="flex items-center gap-1">
                                <Download className="h-4 w-4" />
                                {project.download_count} {t('myProjects.downloads')}
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
                                  {t('myProjects.view')}
                                </Link>
                              </Button>
                            )}
                            <Button variant="outline" size="sm" asChild>
                              <Link href={`/dashboard/my-projects/${project.id}/edit`}>
                                <Edit className="h-4 w-4 mr-1" />
                                {t('myProjects.edit')}
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

      {/* Status Change Confirmation Dialog */}
      <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {isZh ? '確認更改狀態' : 'Confirm Status Change'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {isZh
                ? `確定要將「${selectedProject?.title}」的狀態從「${selectedProject ? getStatusLabel(selectedProject.status) : ''}」更改為「${newStatus ? getStatusLabel(newStatus) : ''}」嗎？`
                : `Are you sure you want to change "${selectedProject?.title}" status from "${selectedProject ? getStatusLabel(selectedProject.status) : ''}" to "${newStatus ? getStatusLabel(newStatus) : ''}"?`
              }
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isUpdating}>
              {isZh ? '取消' : 'Cancel'}
            </AlertDialogCancel>
            <AlertDialogAction onClick={confirmStatusChange} disabled={isUpdating}>
              {isUpdating ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  {isZh ? '處理中...' : 'Processing...'}
                </>
              ) : (
                isZh ? '確認' : 'Confirm'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
