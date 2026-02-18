"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Menu, Github, Bot, LogOut, User, ChevronDown } from "lucide-react"
import { useState, useEffect, useRef } from "react"
import { usePathname, useRouter } from "next/navigation"
import { useTranslations } from "next-intl"
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client"
import { LanguageSwitcher } from "@/components/language-switcher"
import { CartDrawer } from "@/components/cart-drawer"
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

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [loginMenuOpen, setLoginMenuOpen] = useState(false)
  const [isSigningIn, setIsSigningIn] = useState<'github' | 'google' | null>(null)
  const [user, setUser] = useState<SupabaseUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const pathname = usePathname()
  const router = useRouter()
  const loginMenuRef = useRef<HTMLDivElement>(null)
  const t = useTranslations()

  // Check if we're on the home page
  const isHomePage = pathname === '/'

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
    // Skip if Supabase is not configured
    if (!isSupabaseConfigured()) {
      setIsLoading(false)
      return
    }

    const supabase = createClient()
    if (!supabase) {
      setIsLoading(false)
      return
    }

    // Get initial session
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

    // Listen for auth changes
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

  const handleSignOut = async () => {
    try {
      const supabase = createClient()
      if (supabase) {
        await supabase.auth.signOut()
      }
      setUser(null)
      router.refresh()
    } catch (error) {
      console.error('Sign out error:', error)
    }
  }

  const handleSellClick = () => {
    if (!user) {
      setLoginMenuOpen(true)
    } else {
      router.push('/dashboard/sell')
    }
  }

  // Handle anchor link navigation with proper scrolling
  const handleAnchorClick = (e: React.MouseEvent<HTMLAnchorElement>, anchor: string) => {
    if (isHomePage) {
      // On home page, just scroll to the element
      e.preventDefault()
      const element = document.getElementById(anchor)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' })
      }
    } else {
      // On other pages, use native navigation to ensure proper hash handling
      e.preventDefault()
      window.location.href = `/#${anchor}`
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm">
      <div className="container flex h-16 md:h-20 items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <Bot className="h-8 w-8 text-primary" />
          <span className="text-xl md:text-2xl font-bold text-foreground tracking-tight">Quick Buyer</span>
        </Link>

        <nav className="hidden lg:flex items-center gap-8">
          <Link
            href="/projects"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors relative after:absolute after:bottom-[-4px] after:left-0 after:h-[2px] after:w-0 after:bg-primary after:transition-all hover:after:w-full"
          >
            {t('nav.projects')}
          </Link>
          <Link
            href="/deploy"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors relative after:absolute after:bottom-[-4px] after:left-0 after:h-[2px] after:w-0 after:bg-primary after:transition-all hover:after:w-full"
          >
            {t('nav.deploy')}
          </Link>
          <a
            href={isHomePage ? "#features" : "/#features"}
            onClick={(e) => handleAnchorClick(e, 'features')}
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors relative after:absolute after:bottom-[-4px] after:left-0 after:h-[2px] after:w-0 after:bg-primary after:transition-all hover:after:w-full cursor-pointer"
          >
            {t('nav.features')}
          </a>
          <Link
            href="/pricing"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors relative after:absolute after:bottom-[-4px] after:left-0 after:h-[2px] after:w-0 after:bg-primary after:transition-all hover:after:w-full"
          >
            {t('nav.pricing')}
          </Link>
          <a
            href={isHomePage ? "#faq" : "/#faq"}
            onClick={(e) => handleAnchorClick(e, 'faq')}
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors relative after:absolute after:bottom-[-4px] after:left-0 after:h-[2px] after:w-0 after:bg-primary after:transition-all hover:after:w-full cursor-pointer"
          >
            {t('nav.faq')}
          </a>
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <LanguageSwitcher />
          <CartDrawer />

          {isLoading ? (
            <div className="w-20 h-9 bg-muted animate-pulse rounded-md" />
          ) : user ? (
            <div className="flex items-center gap-3">
              <Link href="/dashboard">
                <Button variant="ghost" size="sm" className="gap-2">
                  {user.user_metadata?.avatar_url ? (
                    <img
                      src={user.user_metadata.avatar_url}
                      alt="Avatar"
                      className="w-6 h-6 rounded-full"
                    />
                  ) : (
                    <User className="h-4 w-4" />
                  )}
                  <span className="hidden sm:inline">
                    {user.user_metadata?.user_name || user.user_metadata?.full_name || user.email?.split('@')[0]}
                  </span>
                </Button>
              </Link>
              <Button
                variant="outline"
                size="sm"
                onClick={handleSignOut}
                className="gap-2"
              >
                <LogOut className="h-4 w-4" />
                {t('common.signOut')}
              </Button>
            </div>
          ) : (
            <div className="relative" ref={loginMenuRef}>
              <Button
                variant="outline"
                size="sm"
                className="hover:bg-accent gap-2"
                onClick={() => setLoginMenuOpen(!loginMenuOpen)}
                disabled={isSigningIn !== null}
              >
                {isSigningIn ? t('common.signingIn') : t('common.signIn')}
                <ChevronDown className="h-3 w-3" />
              </Button>

              {/* Login Dropdown Menu */}
              {loginMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-md border bg-background shadow-lg z-50">
                  <div className="py-1">
                    <button
                      onClick={handleGitHubSignIn}
                      className="flex w-full items-center gap-3 px-4 py-2 text-sm hover:bg-accent transition-colors"
                    >
                      <Github className="h-4 w-4" />
                      {t('auth.signInWithGithub')}
                    </button>
                    <button
                      onClick={handleGoogleSignIn}
                      className="flex w-full items-center gap-3 px-4 py-2 text-sm hover:bg-accent transition-colors"
                    >
                      <GoogleIcon className="h-4 w-4" />
                      {t('auth.signInWithGoogle')}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
          <Button
            size="sm"
            className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg hover:shadow-xl"
            onClick={handleSellClick}
          >
            {t('nav.sellProject')}
          </Button>
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <Menu className="h-6 w-6" />
        </Button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-border/40 bg-background/95 backdrop-blur">
          <nav className="container px-4 py-4 flex flex-col gap-4">
            <Link
              href="/projects"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              {t('nav.projects')}
            </Link>
            <Link
              href="/deploy"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              {t('nav.deploy')}
            </Link>
            <a
              href={isHomePage ? "#features" : "/#features"}
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors py-2 cursor-pointer"
              onClick={(e) => {
                handleAnchorClick(e, 'features')
                setMobileMenuOpen(false)
              }}
            >
              {t('nav.features')}
            </a>
            <Link
              href="/pricing"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              {t('nav.pricing')}
            </Link>
            <a
              href={isHomePage ? "#faq" : "/#faq"}
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors py-2 cursor-pointer"
              onClick={(e) => {
                handleAnchorClick(e, 'faq')
                setMobileMenuOpen(false)
              }}
            >
              {t('nav.faq')}
            </a>
            <div className="flex flex-col gap-2 pt-4 border-t border-border/40">
              <div className="flex justify-center py-2">
                <LanguageSwitcher />
              </div>
              {isLoading ? (
                <div className="w-full h-9 bg-muted animate-pulse rounded-md" />
              ) : user ? (
                <>
                  <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="outline" size="sm" className="w-full gap-2">
                      {user.user_metadata?.avatar_url ? (
                        <img
                          src={user.user_metadata.avatar_url}
                          alt="Avatar"
                          className="w-5 h-5 rounded-full"
                        />
                      ) : (
                        <User className="h-4 w-4" />
                      )}
                      {user.user_metadata?.user_name || user.user_metadata?.full_name || user.email?.split('@')[0]}
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      handleSignOut()
                      setMobileMenuOpen(false)
                    }}
                    className="w-full gap-2"
                  >
                    <LogOut className="h-4 w-4" />
                    {t('common.signOut')}
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full gap-2"
                    onClick={handleGitHubSignIn}
                    disabled={isSigningIn !== null}
                  >
                    <Github className="h-4 w-4" />
                    {isSigningIn === 'github' ? t('common.signingIn') : t('auth.signInWithGithub')}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full gap-2"
                    onClick={handleGoogleSignIn}
                    disabled={isSigningIn !== null}
                  >
                    <GoogleIcon className="h-4 w-4" />
                    {isSigningIn === 'google' ? t('common.signingIn') : t('auth.signInWithGoogle')}
                  </Button>
                </>
              )}
              <Button
                size="sm"
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                onClick={() => {
                  handleSellClick()
                  setMobileMenuOpen(false)
                }}
              >
                {t('nav.sellProject')}
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
