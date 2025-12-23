"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Github, Upload, FileCode, FolderOpen, ArrowLeft, ExternalLink, Copy, Check, Globe, Sparkles, Clock, Shield, Zap, CloudUpload } from "lucide-react"
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
      <main className="flex-1 bg-gradient-to-b from-emerald-50/50 via-background to-background dark:from-emerald-950/20 relative overflow-hidden">
        {/* Background decorations */}
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-teal-500/10 rounded-full blur-[80px]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.02)_1px,transparent_1px)] bg-[size:32px_32px] dark:bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)]" />

        <div className="container px-4 md:px-6 py-8 md:py-12 relative">
          {/* Back Link */}
          <Link
            href="/deploy"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-emerald-600 transition-colors mb-8 group"
          >
            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            {t('deploy.backToList', '返回網站列表')}
          </Link>

          {/* Header */}
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-sm font-medium mb-6 border border-emerald-500/20">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              {t('browserDeploy.badge')}
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-4">
              <span className="bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-400 dark:to-teal-400 bg-clip-text text-transparent">
                {t('deploy.uploadTitle', '上傳您的網站')}
              </span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              {t('deploy.uploadSubtitle', '將您的靜態網站上傳到 IPFS，獲得永久託管的連結')}
            </p>

            {/* Feature badges */}
            <div className="flex flex-wrap justify-center gap-4 mt-8">
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-background/80 backdrop-blur-sm border shadow-sm">
                <Zap className="h-4 w-4 text-emerald-500" />
                <span className="text-sm font-medium">{t('browserDeploy.features.instant')}</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-background/80 backdrop-blur-sm border shadow-sm">
                <Shield className="h-4 w-4 text-emerald-500" />
                <span className="text-sm font-medium">{t('browserDeploy.features.permanent')}</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-background/80 backdrop-blur-sm border shadow-sm">
                <Clock className="h-4 w-4 text-emerald-500" />
                <span className="text-sm font-medium">{t('browserDeploy.features.free')}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Upload Card - Main */}
            <div className="lg:col-span-2">
              {/* Glow effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 rounded-3xl blur-2xl scale-95 -z-10" />

              <Card className={`overflow-hidden shadow-2xl relative bg-card/80 backdrop-blur-xl border-0 ${isDisabled ? 'opacity-70' : ''}`}>
                {/* Header */}
                <div className="p-5 border-b bg-gradient-to-r from-emerald-500/5 to-teal-500/5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg">
                      <CloudUpload className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold">
                        {t('browserDeploy.upload.title')}
                      </h3>
                      <p className="text-xs text-muted-foreground">IPFS Decentralized Hosting</p>
                    </div>
                  </div>
                </div>

                {/* Tabs */}
                <div className="flex p-2 gap-2 bg-muted/30">
                  <button
                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition-all rounded-lg ${
                      activeTab === 'file'
                        ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg'
                        : 'hover:bg-muted text-muted-foreground hover:text-foreground'
                    }`}
                    onClick={() => setActiveTab('file')}
                    disabled={isDisabled}
                  >
                    <FileCode className="h-4 w-4" />
                    {t('browserDeploy.upload.tabs.file')}
                  </button>
                  <button
                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition-all rounded-lg ${
                      activeTab === 'folder'
                        ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg'
                        : 'hover:bg-muted text-muted-foreground hover:text-foreground'
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
                    className={`border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300 ${
                      isDisabled
                        ? 'border-muted cursor-not-allowed bg-muted/20'
                        : isDragging
                        ? 'border-emerald-500 bg-emerald-500/10 scale-[1.02]'
                        : 'border-muted-foreground/25 hover:border-emerald-500/50 hover:bg-emerald-500/5 cursor-pointer'
                    }`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={handleDropzoneClick}
                  >
                    {isUploading ? (
                      <div className="flex flex-col items-center gap-4">
                        <div className="relative">
                          <div className="w-20 h-20 border-4 border-emerald-500/30 rounded-full"></div>
                          <div className="absolute inset-0 w-20 h-20 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                          <CloudUpload className="absolute inset-0 m-auto h-8 w-8 text-emerald-500" />
                        </div>
                        <p className="text-sm font-medium text-muted-foreground">{t('browserDeploy.upload.uploading')}</p>
                      </div>
                    ) : uploadResult ? (
                      <div className="flex flex-col items-center gap-5">
                        <div className="relative">
                          <div className="absolute inset-0 bg-emerald-500/20 rounded-full blur-xl animate-pulse"></div>
                          <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg">
                            <Check className="h-10 w-10 text-white" />
                          </div>
                        </div>
                        <div className="space-y-1">
                          <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400">{t('browserDeploy.upload.success')}</p>
                          <p className="text-sm text-muted-foreground">Your site is now live on IPFS</p>
                        </div>
                        <div className="flex items-center gap-2 max-w-full bg-muted/50 rounded-lg p-3">
                          <Globe className="h-4 w-4 text-emerald-500 flex-shrink-0" />
                          <a
                            href={uploadResult.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-primary hover:underline break-all flex-1"
                          >
                            {uploadResult.url}
                          </a>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="flex-shrink-0"
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
                        <div className="flex gap-3">
                          <Button
                            variant="outline"
                            onClick={(e) => {
                              e.stopPropagation()
                              window.open(uploadResult.url, '_blank')
                            }}
                            className="gap-2"
                          >
                            <ExternalLink className="h-4 w-4" />
                            Visit Site
                          </Button>
                          <Button
                            variant="default"
                            className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 gap-2"
                            onClick={(e) => {
                              e.stopPropagation()
                              setUploadResult(null)
                            }}
                          >
                            <Upload className="h-4 w-4" />
                            {t('deploy.uploadAnother')}
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="flex justify-center mb-6">
                          <div className="relative">
                            <div className="absolute inset-0 bg-emerald-500/20 rounded-2xl blur-xl"></div>
                            <div className="relative w-24 h-24 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 flex items-center justify-center border border-emerald-500/30">
                              {activeTab === 'file' ? (
                                <FileCode className="h-12 w-12 text-emerald-500" />
                              ) : (
                                <FolderOpen className="h-12 w-12 text-emerald-500" />
                              )}
                            </div>
                          </div>
                        </div>
                        <p className="text-lg font-medium mb-2">
                          {t('browserDeploy.upload.dropzone.text')}
                          <span className="text-emerald-600 dark:text-emerald-400 font-semibold cursor-pointer hover:underline">
                            {t('browserDeploy.upload.dropzone.click')}
                          </span>
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {t('deploy.maxSize')}
                        </p>
                        <div className="flex flex-wrap justify-center gap-2 mt-6">
                          {['HTML', 'CSS', 'JS', 'Images', 'Fonts'].map((type) => (
                            <span key={type} className="px-3 py-1 rounded-full bg-muted text-xs font-medium text-muted-foreground">
                              {type}
                            </span>
                          ))}
                        </div>
                      </>
                    )}
                  </div>

                  {/* Note */}
                  <p className="mt-4 text-xs text-muted-foreground text-center flex items-center justify-center gap-2">
                    <Shield className="h-3 w-3" />
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
                  <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center">
                    <div className="text-center p-8 max-w-sm">
                      <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                        <Globe className="h-8 w-8 text-muted-foreground" />
                      </div>
                      <h3 className="font-bold text-lg mb-2">Sign in to continue</h3>
                      <p className="text-sm text-muted-foreground mb-6">
                        {t('browserDeploy.upload.loginRequired')}
                      </p>
                      <div className="flex flex-col gap-3">
                        <Button
                          variant="outline"
                          onClick={handleGitHubSignIn}
                          disabled={isSigningIn !== null}
                          className="gap-2 h-11"
                        >
                          <Github className="h-5 w-5" />
                          {isSigningIn === 'github' ? t('common.signingIn') : t('auth.signInWithGithub')}
                        </Button>
                        <Button
                          variant="outline"
                          onClick={handleGoogleSignIn}
                          disabled={isSigningIn !== null}
                          className="gap-2 h-11"
                        >
                          <GoogleIcon className="h-5 w-5" />
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
              <Card className="overflow-hidden bg-card/80 backdrop-blur-xl border-0 shadow-xl sticky top-24">
                <div className="p-5 border-b bg-gradient-to-r from-primary/5 to-purple-500/5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center shadow-lg">
                      <Clock className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold">{t('deploy.history')}</h3>
                      <p className="text-xs text-muted-foreground">Recent uploads</p>
                    </div>
                  </div>
                </div>
                <div className="p-4 max-h-[500px] overflow-y-auto">
                  {!user ? (
                    <div className="text-center py-12">
                      <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mx-auto mb-3">
                        <Clock className="h-6 w-6 text-muted-foreground" />
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {t('deploy.loginForHistory')}
                      </p>
                    </div>
                  ) : uploadHistory.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mx-auto mb-3">
                        <Upload className="h-6 w-6 text-muted-foreground" />
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {t('deploy.noHistory')}
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {uploadHistory.map((record, index) => (
                        <div
                          key={record.cid}
                          className="group p-4 rounded-xl border bg-gradient-to-r from-muted/30 to-muted/10 hover:from-muted/50 hover:to-muted/30 transition-all duration-200 hover:shadow-md"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <div className="w-6 h-6 rounded bg-primary/10 flex items-center justify-center flex-shrink-0">
                                  <FileCode className="h-3 w-3 text-primary" />
                                </div>
                                <p className="text-sm font-semibold truncate">{record.filename}</p>
                              </div>
                              <p className="text-xs text-muted-foreground pl-8">
                                {formatFileSize(record.size)} • {formatDate(record.created_at)}
                              </p>
                            </div>
                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <a
                                href={record.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 rounded-lg hover:bg-background transition-colors"
                              >
                                <ExternalLink className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                              </a>
                              <button
                                onClick={() => handleCopyUrl(record.url)}
                                className="p-2 rounded-lg hover:bg-background transition-colors"
                              >
                                {copiedUrl === record.url ? (
                                  <Check className="h-4 w-4 text-emerald-500" />
                                ) : (
                                  <Copy className="h-4 w-4 text-muted-foreground hover:text-foreground" />
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
