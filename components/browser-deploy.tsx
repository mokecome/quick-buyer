"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, Github, HelpCircle, Check } from "lucide-react"
import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { useTranslation } from "react-i18next"
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client"
import type { User as SupabaseUser, AuthChangeEvent, Session } from "@supabase/supabase-js"

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

// Strikethrough icon for "no need" items
function StrikethroughIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <line x1="4" y1="4" x2="20" y2="20" />
    </svg>
  )
}

export function BrowserDeploy() {
  const [loginMenuOpen, setLoginMenuOpen] = useState(false)
  const [isSigningIn, setIsSigningIn] = useState<'github' | 'google' | null>(null)
  const [user, setUser] = useState<SupabaseUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const loginMenuRef = useRef<HTMLDivElement>(null)
  const { t } = useTranslation()

  // Close login menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (loginMenuRef.current && !loginMenuRef.current.contains(event.target as Node)) {
        setLoginMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

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
    setLoginMenuOpen(false)
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
    setLoginMenuOpen(false)
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

  const handleUploadClick = () => {
    if (!user) {
      setLoginMenuOpen(true)
    } else {
      router.push('/dashboard/sell')
    }
  }

  const noNeedItems = t('browserDeploy.config.noNeedItems', { returnObjects: true }) as string[]
  const supportItems = t('browserDeploy.config.supportItems', { returnObjects: true }) as string[]

  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-muted/20 to-background">
      <div className="container px-4 md:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left Side - Text Content */}
          <div className="space-y-6">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 text-emerald-600 text-sm font-medium">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              {t('browserDeploy.badge')}
            </div>

            {/* Title */}
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight">
              {t('browserDeploy.title')}
            </h2>

            {/* Subtitle */}
            <p className="text-lg text-muted-foreground leading-relaxed max-w-xl">
              {t('browserDeploy.subtitle')}
            </p>

            {/* CTA Buttons */}
            <div className="flex items-center gap-4 pt-2">
              <a
                href="#"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2"
              >
                <HelpCircle className="h-4 w-4" />
                {t('browserDeploy.howToUse')}
              </a>

              <div className="relative" ref={loginMenuRef}>
                <Button
                  size="lg"
                  className="bg-zinc-900 hover:bg-zinc-800 text-white px-6"
                  onClick={handleUploadClick}
                  disabled={isSigningIn !== null || isLoading}
                >
                  {isSigningIn ? t('common.signingIn') : t('browserDeploy.cta')}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>

                {/* Login Dropdown Menu */}
                {loginMenuOpen && (
                  <div className="absolute left-0 mt-2 w-56 rounded-md border bg-background shadow-lg z-50">
                    <div className="py-1">
                      <button
                        onClick={handleGitHubSignIn}
                        className="flex w-full items-center gap-3 px-4 py-3 text-sm hover:bg-accent transition-colors"
                      >
                        <Github className="h-5 w-5" />
                        {t('auth.signInWithGithub')}
                      </button>
                      <button
                        onClick={handleGoogleSignIn}
                        className="flex w-full items-center gap-3 px-4 py-3 text-sm hover:bg-accent transition-colors"
                      >
                        <GoogleIcon className="h-5 w-5" />
                        {t('auth.signInWithGoogle')}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Side - Code Panel */}
          <div className="relative">
            <div className="bg-zinc-900 rounded-xl overflow-hidden shadow-2xl border border-zinc-800">
              {/* Header */}
              <div className="px-4 py-3 border-b border-zinc-800 flex items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
                <span className="text-zinc-500 text-sm font-mono ml-2">
                  {"{ "}{t('browserDeploy.config.header')}{" }"}
                </span>
              </div>

              {/* Content */}
              <div className="p-6 font-mono text-sm">
                <div className="flex">
                  {/* Line Numbers */}
                  <div className="text-zinc-600 select-none pr-4 text-right">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map(n => (
                      <div key={n}>{n}</div>
                    ))}
                  </div>

                  {/* Code Content */}
                  <div className="flex-1 space-y-1">
                    <div className="text-cyan-400">
                      {"< "}{t('browserDeploy.config.headline')}{" />"}
                    </div>
                    <div className="text-zinc-500">
                      {"// "}{t('browserDeploy.config.tagline')}
                    </div>
                    <div className="h-2"></div>
                    <div className="text-zinc-500">
                      {"// "}{t('browserDeploy.config.noNeed')}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {Array.isArray(noNeedItems) && noNeedItems.map((item, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center gap-1 text-zinc-500 line-through decoration-zinc-600"
                        >
                          <StrikethroughIcon className="h-3 w-3" />
                          {item}
                        </span>
                      ))}
                    </div>
                    <div className="h-2"></div>
                    <div className="text-zinc-500">
                      {"// "}{t('browserDeploy.config.support')}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {Array.isArray(supportItems) && supportItems.map((item, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center gap-1 text-emerald-400"
                        >
                          <Check className="h-3 w-3" />
                          {item}
                        </span>
                      ))}
                    </div>
                    <div className="h-2"></div>
                    <div className="text-emerald-400 flex items-center gap-1">
                      <Check className="h-3 w-3" />
                      {t('browserDeploy.config.free')}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Decorative blur */}
            <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-primary/5 rounded-full blur-3xl"></div>
          </div>
        </div>
      </div>
    </section>
  )
}
