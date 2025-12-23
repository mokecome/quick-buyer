"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Github, Upload, FileCode, FolderOpen, ArrowLeft, ExternalLink, Copy, Check, Globe } from "lucide-react"
import { useState, useEffect, useRef, useCallback } from "react"
import { useRouter } from "next/navigation"
import { useTranslation } from "react-i18next"
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client"
import type { User as SupabaseUser, AuthChangeEvent, Session } from "@supabase/supabase-js"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

// Google Icon Component
function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  )
}

// Code file icon
function CodeFileIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <rect x="4" y="2" width="16" height="20" rx="2" fill="#818CF8" fillOpacity="0.2" stroke="#818CF8" strokeWidth="1.5"/>
      <path d="M9 12l-2 2 2 2" stroke="#818CF8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M15 12l2 2-2 2" stroke="#818CF8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <rect x="8" y="2" width="8" height="4" rx="1" fill="#818CF8" fillOpacity="0.3"/>
    </svg>
  )
}

interface UploadRecord {
  cid: string
  url: string
  filename: string
  size: number
  created_at: string
}

export default function UploadPage() {
  const [isSigningIn, setIsSigningIn] = useState<'github' | 'google' | null>(null)
  const [user, setUser] = useState<SupabaseUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'file' | 'folder'>('file')
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadResult, setUploadResult] = useState<{ cid: string; url: string } | null>(null)
  const [uploadHistory, setUploadHistory] = useState<UploadRecord[]>([])
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null)
  const [siteTitle, setSiteTitle] = useState("")
  const [siteDescription, setSiteDescription] = useState("")
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const folderInputRef = useRef<HTMLInputElement>(null)
  const { t } = useTranslation()

  useEffect(() => {
    if (!isSupabaseConfigured()) {
      setIsLoading(false)
      return
    }

    const supabase = createClient()
    if (!supabase) {
      setIsLoading(false)
      return
    }

    const getUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        setUser(user)
        if (user) {
          // Fetch upload history
          const { data: history } = await supabase
            .from('ipfs_uploads')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })
            .limit(10)
          if (history) {
            setUploadHistory(history)
          }
        }
      } catch (error) {
        console.error('Error getting user:', error)
      } finally {
        setIsLoading(false)
      }
    }

    getUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event: AuthChangeEvent, session: Session | null) => {
        setUser(session?.user ?? null)
        if (event === 'SIGNED_IN') {
          router.refresh()
        }
      }
    )

    return () => {
      subscription.unsubscribe()
    }
  }, [router])

  const handleGitHubSignIn = async () => {
    setIsSigningIn('github')
    try {
      const response = await fetch('/auth/signin', {
        method: 'POST',
      })
      const data = await response.json()

      if (data.url) {
        window.location.href = data.url
      } else if (data.error) {
        alert(`${t('auth.authError.title')}: ${data.error}`)
      }
    } catch (error) {
      console.error('Sign in error:', error)
      alert(t('auth.authError.description'))
    } finally {
      setIsSigningIn(null)
    }
  }

  const handleGoogleSignIn = async () => {
    setIsSigningIn('google')
    try {
      const response = await fetch('/auth/signin/google', {
        method: 'POST',
      })
      const data = await response.json()

      if (data.url) {
        window.location.href = data.url
      } else if (data.error) {
        alert(`${t('auth.authError.title')}: ${data.error}`)
      }
    } catch (error) {
      console.error('Sign in error:', error)
      alert(t('auth.authError.description'))
    } finally {
      setIsSigningIn(null)
    }
  }

  // Handle file upload to IPFS
  const handleFileUpload = async (files: FileList | null) => {
    if (!files || files.length === 0 || !user) return

    setIsUploading(true)
    setUploadResult(null)

    try {
      const formData = new FormData()

      // Add all files to form data
      for (let i = 0; i < files.length; i++) {
        formData.append('files', files[i])
      }

      const response = await fetch('/api/ipfs/upload', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()

      if (data.success) {
        setUploadResult({
          cid: data.cid,
          url: data.url,
        })
        // Refresh history
        const supabase = createClient()
        if (supabase) {
          const { data: history } = await supabase
            .from('ipfs_uploads')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })
            .limit(10)
          if (history) {
            setUploadHistory(history)
          }
        }
      } else {
        alert(data.error || 'Upload failed')
      }
    } catch (error) {
      console.error('Upload error:', error)
      alert('Upload failed')
    } finally {
      setIsUploading(false)
    }
  }

  // Drag and drop handlers
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    if (user) {
      setIsDragging(true)
    }
  }, [user])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    if (user) {
      handleFileUpload(e.dataTransfer.files)
    }
  }, [user])

  const handleDropzoneClick = () => {
    if (!user) return
    if (activeTab === 'file') {
      fileInputRef.current?.click()
    } else {
      folderInputRef.current?.click()
    }
  }

  const handleCopyUrl = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url)
      setCopiedUrl(url)
      setTimeout(() => setCopiedUrl(null), 2000)
    } catch (error) {
      console.error('Failed to copy:', error)
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const isDisabled = !user || isLoading

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-gradient-to-b from-muted/30 to-background">
        <div className="container px-4 md:px-6 py-8 md:py-12">
          {/* Back Link */}
          <Link
            href="/deploy"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
          >
            <ArrowLeft className="h-4 w-4" />
            {t('deploy.backToList', '返回網站列表')}
          </Link>

          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 text-emerald-600 text-sm font-medium mb-4">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              {t('browserDeploy.badge')}
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-4">
              {t('deploy.uploadTitle', '上傳您的網站')}
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t('deploy.uploadSubtitle', '將您的靜態網站上傳到 IPFS，獲得永久託管的連結')}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Upload Card - Main */}
            <div className="lg:col-span-2">
              <Card className={`overflow-hidden shadow-xl relative ${isDisabled ? 'opacity-60' : ''}`}>
                {/* Header */}
                <div className="p-4 border-b">
                  <h3 className="text-lg font-semibold">
                    {t('browserDeploy.upload.title')}
                  </h3>
                </div>

                {/* Tabs */}
                <div className="flex border-b">
                  <button
                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition-colors ${
                      activeTab === 'file'
                        ? 'bg-primary text-primary-foreground'
                        : 'hover:bg-muted'
                    }`}
                    onClick={() => setActiveTab('file')}
                    disabled={isDisabled}
                  >
                    <FileCode className="h-4 w-4" />
                    {t('browserDeploy.upload.tabs.file')}
                  </button>
                  <button
                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition-colors ${
                      activeTab === 'folder'
                        ? 'bg-primary text-primary-foreground'
                        : 'hover:bg-muted'
                    }`}
                    onClick={() => setActiveTab('folder')}
                    disabled={isDisabled}
                  >
                    <FolderOpen className="h-4 w-4" />
                    {t('browserDeploy.upload.tabs.folder')}
                  </button>
                </div>

                {/* Dropzone */}
                <div className="p-6">
                  <div
                    className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
                      isDisabled
                        ? 'border-muted cursor-not-allowed bg-muted/30'
                        : isDragging
                        ? 'border-primary bg-primary/5'
                        : 'border-muted-foreground/25 hover:border-primary/50 cursor-pointer'
                    }`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={handleDropzoneClick}
                  >
                    {isUploading ? (
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                        <p className="text-sm text-muted-foreground">{t('browserDeploy.upload.uploading')}</p>
                      </div>
                    ) : uploadResult ? (
                      <div className="flex flex-col items-center gap-4">
                        <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center">
                          <svg className="w-8 h-8 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <p className="text-lg font-medium text-emerald-600">{t('browserDeploy.upload.success')}</p>
                        <div className="flex items-center gap-2 max-w-full">
                          <a
                            href={uploadResult.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-primary hover:underline break-all flex items-center gap-1"
                          >
                            {uploadResult.url}
                            <ExternalLink className="h-3 w-3 flex-shrink-0" />
                          </a>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleCopyUrl(uploadResult.url)
                            }}
                          >
                            {copiedUrl === uploadResult.url ? (
                              <Check className="h-4 w-4 text-emerald-500" />
                            ) : (
                              <Copy className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            setUploadResult(null)
                          }}
                        >
                          {t('deploy.uploadAnother')}
                        </Button>
                      </div>
                    ) : (
                      <>
                        <div className="flex justify-center mb-4">
                          <CodeFileIcon className="w-20 h-20" />
                        </div>
                        <p className="text-muted-foreground">
                          {t('browserDeploy.upload.dropzone.text')}
                          <span className="text-primary font-medium cursor-pointer hover:underline">
                            {t('browserDeploy.upload.dropzone.click')}
                          </span>
                        </p>
                        <p className="text-xs text-muted-foreground mt-4">
                          {t('deploy.maxSize')}
                        </p>
                      </>
                    )}
                  </div>

                  {/* Note */}
                  <p className="mt-4 text-xs text-muted-foreground text-center">
                    {t('browserDeploy.upload.note')}
                  </p>
                </div>

                {/* Hidden file inputs */}
                <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  multiple
                  accept=".html,.css,.js,.json,.txt,.md,.png,.jpg,.jpeg,.gif,.svg,.ico,.woff,.woff2,.ttf,.eot"
                  onChange={(e) => handleFileUpload(e.target.files)}
                  disabled={isDisabled}
                />
                <input
                  ref={folderInputRef}
                  type="file"
                  className="hidden"
                  {...{ webkitdirectory: "", directory: "" } as any}
                  onChange={(e) => handleFileUpload(e.target.files)}
                  disabled={isDisabled}
                />

                {/* Disabled Overlay */}
                {isDisabled && (
                  <div className="absolute inset-0 bg-background/50 backdrop-blur-[1px] flex items-center justify-center">
                    <div className="text-center p-4">
                      <p className="text-sm text-muted-foreground mb-4">
                        {t('browserDeploy.upload.loginRequired')}
                      </p>
                      <div className="flex flex-col gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleGitHubSignIn}
                          disabled={isSigningIn !== null}
                          className="gap-2"
                        >
                          <Github className="h-4 w-4" />
                          {isSigningIn === 'github' ? t('common.signingIn') : t('auth.signInWithGithub')}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleGoogleSignIn}
                          disabled={isSigningIn !== null}
                          className="gap-2"
                        >
                          <GoogleIcon className="h-4 w-4" />
                          {isSigningIn === 'google' ? t('common.signingIn') : t('auth.signInWithGoogle')}
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </Card>
            </div>

            {/* Sidebar - Upload History */}
            <div className="lg:col-span-1">
              <Card className="overflow-hidden">
                <div className="p-4 border-b">
                  <h3 className="text-lg font-semibold">{t('deploy.history')}</h3>
                </div>
                <div className="p-4">
                  {!user ? (
                    <p className="text-sm text-muted-foreground text-center py-8">
                      {t('deploy.loginForHistory')}
                    </p>
                  ) : uploadHistory.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-8">
                      {t('deploy.noHistory')}
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {uploadHistory.map((record) => (
                        <div
                          key={record.cid}
                          className="p-3 rounded-lg border bg-muted/30 hover:bg-muted/50 transition-colors"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0 flex-1">
                              <p className="text-sm font-medium truncate">{record.filename}</p>
                              <p className="text-xs text-muted-foreground">
                                {formatFileSize(record.size)} • {formatDate(record.created_at)}
                              </p>
                            </div>
                            <div className="flex items-center gap-1">
                              <a
                                href={record.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-1.5 rounded hover:bg-muted transition-colors"
                              >
                                <ExternalLink className="h-4 w-4 text-muted-foreground" />
                              </a>
                              <button
                                onClick={() => handleCopyUrl(record.url)}
                                className="p-1.5 rounded hover:bg-muted transition-colors"
                              >
                                {copiedUrl === record.url ? (
                                  <Check className="h-4 w-4 text-emerald-500" />
                                ) : (
                                  <Copy className="h-4 w-4 text-muted-foreground" />
                                )}
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
