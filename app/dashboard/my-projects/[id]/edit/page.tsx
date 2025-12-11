"use client"

import { useState, useEffect, use } from "react"
import { useRouter } from "next/navigation"
import { useTranslation } from "react-i18next"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"
import { Upload, Link as LinkIcon, FileText, DollarSign, Loader2, ArrowLeft, Trash2, AlertTriangle, ImageIcon } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import type { User } from "@supabase/supabase-js"

const categories = [
  "LLM",
  "Image AI",
  "Voice AI",
  "RAG",
  "Chatbot",
  "Automation",
  "NLP",
  "Computer Vision",
  "Other",
]

interface Project {
  id: string
  title: string
  description: string
  long_description: string | null
  price: number
  category: string
  thumbnail_url: string | null
  download_url: string
  docs_url: string | null
  demo_url: string | null
  status: 'pending' | 'approved' | 'rejected'
  user_id: string
}

export default function EditProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const { t, i18n } = useTranslation()
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [project, setProject] = useState<Project | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    longDescription: "",
    price: "",
    category: "",
    thumbnailUrl: "",
    downloadUrl: "",
    docsUrl: "",
    demoUrl: "",
  })

  const isZh = i18n.language?.startsWith('zh')

  useEffect(() => {
    const loadData = async () => {
      const supabase = createClient()
      if (!supabase) {
        setError("Supabase not configured")
        setIsLoading(false)
        return
      }

      // Check auth
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)

      if (!user) {
        setError(isZh ? "請先登入" : "Please sign in first")
        setIsLoading(false)
        return
      }

      // Fetch project
      try {
        const response = await fetch(`/api/projects/${id}`)
        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.message || "Failed to load project")
        }

        const proj = data.project
        setProject(proj)

        // Populate form
        setFormData({
          title: proj.title || "",
          description: proj.description || "",
          longDescription: proj.long_description || "",
          price: proj.price?.toString() || "",
          category: proj.category || "",
          thumbnailUrl: proj.thumbnail_url || "",
          downloadUrl: proj.download_url || "",
          docsUrl: proj.docs_url || "",
          demoUrl: proj.demo_url || "",
        })
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred")
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [id, isZh])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch(`/api/projects/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price) || 0,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        router.push("/dashboard/my-projects")
      } else {
        alert(data.message || t('edit.error', 'Failed to update project'))
      }
    } catch (error) {
      console.error("Update error:", error)
      alert(t('edit.error', 'Failed to update project'))
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async () => {
    setIsDeleting(true)

    try {
      const response = await fetch(`/api/projects/${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        router.push("/dashboard/my-projects")
      } else {
        const data = await response.json()
        alert(data.message || t('edit.deleteError', 'Failed to delete project'))
      }
    } catch (error) {
      console.error("Delete error:", error)
      alert(t('edit.deleteError', 'Failed to delete project'))
    } finally {
      setIsDeleting(false)
    }
  }

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  // Loading state
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

  // Error state
  if (error || !project) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 py-12">
          <div className="container px-4 md:px-6 max-w-md">
            <Card>
              <CardHeader className="text-center">
                <div className="mx-auto w-12 h-12 bg-destructive/10 rounded-full flex items-center justify-center mb-4">
                  <AlertTriangle className="h-6 w-6 text-destructive" />
                </div>
                <CardTitle>{isZh ? "無法載入項目" : "Cannot Load Project"}</CardTitle>
                <CardDescription>{error}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full" onClick={() => router.push("/dashboard/my-projects")}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  {isZh ? "返回我的項目" : "Back to My Projects"}
                </Button>
              </CardContent>
            </Card>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  const statusLabels = {
    pending: { zh: "審核中", en: "Pending Review" },
    approved: { zh: "已上架", en: "Approved" },
    rejected: { zh: "未通過", en: "Rejected" },
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 py-8 md:py-12">
        <div className="container px-4 md:px-6 max-w-3xl">
          <div className="mb-8">
            <Button
              variant="ghost"
              size="sm"
              className="mb-4"
              onClick={() => router.push("/dashboard/my-projects")}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              {isZh ? "返回我的項目" : "Back to My Projects"}
            </Button>

            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-3xl font-bold tracking-tight">
                {isZh ? "編輯項目" : "Edit Project"}
              </h1>
              <Badge variant={project.status === 'approved' ? 'default' : project.status === 'rejected' ? 'destructive' : 'secondary'}>
                {isZh ? statusLabels[project.status].zh : statusLabels[project.status].en}
              </Badge>
            </div>

            {project.status === 'approved' && (
              <p className="text-amber-600 dark:text-amber-400 text-sm mt-2">
                {isZh
                  ? "修改後項目將重新進入審核狀態"
                  : "Editing will reset the project to pending review"}
              </p>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Info */}
            <Card>
              <CardHeader>
                <CardTitle>{t('sell.basicInfo', 'Basic Information')}</CardTitle>
                <CardDescription>
                  {t('sell.basicInfoDesc', 'Tell us about your project')}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">{t('sell.form.title', 'Project Title')} *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleChange("title", e.target.value)}
                    placeholder={t('sell.form.titlePlaceholder', 'e.g., ChatGPT Clone with Next.js')}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">{t('sell.form.description', 'Short Description')} *</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleChange("description", e.target.value)}
                    placeholder={t('sell.form.descriptionPlaceholder', 'A brief description of your project (max 200 characters)')}
                    maxLength={200}
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    {formData.description.length}/200
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="longDescription">{t('sell.form.longDescription', 'Detailed Description')}</Label>
                  <Textarea
                    id="longDescription"
                    value={formData.longDescription}
                    onChange={(e) => handleChange("longDescription", e.target.value)}
                    placeholder={t('sell.form.longDescriptionPlaceholder', 'Provide a detailed description of features, tech stack, and use cases...')}
                    rows={6}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="category">{t('sell.form.category', 'Category')} *</Label>
                    <Select
                      value={formData.category}
                      onValueChange={(value) => handleChange("category", value)}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={t('sell.form.categoryPlaceholder', 'Select a category')} />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat} value={cat}>
                            {cat}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="price">{t('sell.form.price', 'Price (USD)')} *</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="price"
                        type="number"
                        min="0"
                        step="1"
                        value={formData.price}
                        onChange={(e) => handleChange("price", e.target.value)}
                        placeholder="99"
                        className="pl-9"
                        required
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Files & Links */}
            <Card>
              <CardHeader>
                <CardTitle>{t('sell.filesLinks', 'Files & Links')}</CardTitle>
                <CardDescription>
                  {t('sell.filesLinksDesc', 'Provide download and documentation links')}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="thumbnailUrl">
                    <ImageIcon className="inline h-4 w-4 mr-2" />
                    {t('sell.form.thumbnailUrl', 'Thumbnail Image URL')}
                  </Label>
                  <Input
                    id="thumbnailUrl"
                    type="url"
                    value={formData.thumbnailUrl}
                    onChange={(e) => handleChange("thumbnailUrl", e.target.value)}
                    placeholder="https://example.com/image.png"
                  />
                  <p className="text-xs text-muted-foreground">
                    {t('sell.form.thumbnailUrlHint', 'Preview image for your project (recommended: 16:9 ratio, e.g., 1280x720)')}
                  </p>
                  {formData.thumbnailUrl && (
                    <div className="mt-2 relative aspect-video w-full max-w-sm bg-muted rounded-lg overflow-hidden">
                      <img
                        src={formData.thumbnailUrl}
                        alt="Thumbnail preview"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none'
                        }}
                      />
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="downloadUrl">
                    <Upload className="inline h-4 w-4 mr-2" />
                    {t('sell.form.downloadUrl', 'Download URL')} *
                  </Label>
                  <Input
                    id="downloadUrl"
                    type="url"
                    value={formData.downloadUrl}
                    onChange={(e) => handleChange("downloadUrl", e.target.value)}
                    placeholder="https://github.com/... or https://drive.google.com/..."
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    {t('sell.form.downloadUrlHint', 'Link to download the source code (GitHub, Google Drive, etc.)')}
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="docsUrl">
                    <FileText className="inline h-4 w-4 mr-2" />
                    {t('sell.form.docsUrl', 'Documentation URL')}
                  </Label>
                  <Input
                    id="docsUrl"
                    type="url"
                    value={formData.docsUrl}
                    onChange={(e) => handleChange("docsUrl", e.target.value)}
                    placeholder="https://docs.example.com or https://notion.so/..."
                  />
                  <p className="text-xs text-muted-foreground">
                    {t('sell.form.docsUrlHint', 'Link to project documentation or tutorial (Notion, GitBook, etc.)')}
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="demoUrl">
                    <LinkIcon className="inline h-4 w-4 mr-2" />
                    {t('sell.form.demoUrl', 'Live Demo URL')}
                  </Label>
                  <Input
                    id="demoUrl"
                    type="url"
                    value={formData.demoUrl}
                    onChange={(e) => handleChange("demoUrl", e.target.value)}
                    placeholder="https://demo.example.com"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="flex flex-col-reverse sm:flex-row justify-between gap-4">
              {/* Delete Button */}
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button type="button" variant="destructive" disabled={isDeleting}>
                    <Trash2 className="h-4 w-4 mr-2" />
                    {isZh ? "刪除項目" : "Delete Project"}
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      {isZh ? "確定要刪除此項目？" : "Are you sure you want to delete this project?"}
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      {isZh
                        ? "此操作無法撤銷。項目將被永久刪除。"
                        : "This action cannot be undone. The project will be permanently deleted."}
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>{isZh ? "取消" : "Cancel"}</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleDelete}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      {isDeleting ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        isZh ? "確定刪除" : "Delete"
                      )}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>

              {/* Save Buttons */}
              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push("/dashboard/my-projects")}
                >
                  {t('common.cancel', 'Cancel')}
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      {isZh ? "儲存中..." : "Saving..."}
                    </>
                  ) : (
                    isZh ? "儲存變更" : "Save Changes"
                  )}
                </Button>
              </div>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  )
}
