"use client"

import { useState, useEffect } from "react"
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
import { Upload, Link as LinkIcon, FileText, DollarSign, Loader2, LogIn, ImageIcon } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import type { User } from "@supabase/supabase-js"

const categories = [
  "AI Agent",
  "LLM",
  "RAG",
  "Chatbot",
  "Image AI",
  "Video AI",
  "Automation",
  "Other",
]

export default function SellPage() {
  const { t } = useTranslation()
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
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

  useEffect(() => {
    const checkAuth = async () => {
      const supabase = createClient()
      if (!supabase) {
        setIsLoading(false)
        return
      }

      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      setIsLoading(false)
    }

    checkAuth()
  }, [])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price) || 0,
        }),
      })

      if (response.ok) {
        router.push("/dashboard?submitted=true")
      } else {
        const error = await response.json()
        alert(error.message || t('sell.error', 'Failed to submit project'))
      }
    } catch (error) {
      console.error("Submit error:", error)
      alert(t('sell.error', 'Failed to submit project'))
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
    if (!allowedTypes.includes(file.type)) {
      alert(t('sell.form.invalidFileType', 'Invalid file type. Allowed: JPEG, PNG, WebP, GIF'))
      return
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024
    if (file.size > maxSize) {
      alert(t('sell.form.fileTooLarge', 'File too large. Maximum size is 5MB'))
      return
    }

    setIsUploading(true)
    try {
      const formDataUpload = new FormData()
      formDataUpload.append('file', file)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formDataUpload,
      })

      const data = await response.json()

      if (data.success && data.url) {
        handleChange('thumbnailUrl', data.url)
      } else {
        alert(data.message || t('sell.form.uploadError', 'Failed to upload image'))
      }
    } catch (error) {
      console.error('Upload error:', error)
      alert(t('sell.form.uploadError', 'Failed to upload image'))
    } finally {
      setIsUploading(false)
      // Reset input so same file can be selected again
      e.target.value = ''
    }
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

  // Not authenticated - show sign in prompt
  if (!user) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 py-12">
          <div className="container px-4 md:px-6 max-w-md">
            <Card>
              <CardHeader className="text-center">
                <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <LogIn className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>{t('sell.signInRequired', '需要登入')}</CardTitle>
                <CardDescription>
                  {t('sell.signInRequiredDesc', '請先登入以上架您的 AI 項目')}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button className="w-full" asChild>
                  <a href="/auth/signin">
                    {t('common.signInWithGitHub', '使用 GitHub 登入')}
                  </a>
                </Button>
                <Button variant="outline" className="w-full" asChild>
                  <a href="/auth/signin/google">
                    {t('common.signInWithGoogle', '使用 Google 登入')}
                  </a>
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
      <main className="flex-1 py-8 md:py-12">
        <div className="container px-4 md:px-6 max-w-3xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight">
              {t('sell.title', 'Submit Your AI Project')}
            </h1>
            <p className="text-muted-foreground mt-2">
              {t('sell.subtitle', 'Share your AI project with our community of developers')}
            </p>
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
                  <Label htmlFor="description">{t('sell.form.description', 'Short Description')}</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleChange("description", e.target.value)}
                    placeholder={t('sell.form.descriptionPlaceholder', 'A brief description of your project (max 200 characters)')}
                    maxLength={200}
                  />
                  <p className="text-xs text-muted-foreground">
                    {formData.description.length}/200
                  </p>
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
                    {t('sell.form.thumbnail', 'Thumbnail Image')}
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      id="thumbnailUrl"
                      type="url"
                      value={formData.thumbnailUrl}
                      onChange={(e) => handleChange("thumbnailUrl", e.target.value)}
                      placeholder="https://example.com/image.png"
                      className="flex-1"
                    />
                    <input
                      type="file"
                      id="thumbnailFile"
                      accept="image/jpeg,image/png,image/webp,image/gif"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => document.getElementById('thumbnailFile')?.click()}
                      disabled={isUploading}
                    >
                      {isUploading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <>
                          <Upload className="h-4 w-4 mr-1" />
                          {t('sell.form.upload', 'Upload')}
                        </>
                      )}
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {t('sell.form.thumbnailHint', 'Upload an image or enter URL. Auto-generated from Demo URL if left empty.')}
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
                    {t('sell.form.downloadUrl', 'Download URL')}
                  </Label>
                  <Input
                    id="downloadUrl"
                    type="url"
                    value={formData.downloadUrl}
                    onChange={(e) => handleChange("downloadUrl", e.target.value)}
                    placeholder="https://github.com/... or https://drive.google.com/..."
                  />
                  <p className="text-xs text-muted-foreground">
                    {t('sell.form.downloadUrlHint', 'Link to download the source code (GitHub, Google Drive, etc.)')}
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

            {/* Submit */}
            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
              >
                {t('common.cancel', 'Cancel')}
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting
                  ? t('sell.submitting', 'Submitting...')
                  : t('sell.submit', 'Submit for Review')}
              </Button>
            </div>

            <p className="text-sm text-muted-foreground text-center">
              {t('sell.reviewNote', 'Your project will be reviewed within 24-48 hours before being published.')}
            </p>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  )
}
