"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Menu, Github, ShoppingCart, Code2 } from "lucide-react"
import { useState } from "react"
import { usePathname } from "next/navigation"

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isSigningIn, setIsSigningIn] = useState(false)
  const pathname = usePathname()

  // Check if we're on the home page
  const isHomePage = pathname === '/'

  // Check if Supabase is configured
  const isSupabaseConfigured =
    typeof window !== 'undefined' &&
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_URL !== 'your-project-url.supabase.co' &&
    process.env.NEXT_PUBLIC_SUPABASE_URL.startsWith('http')

  const handleGitHubSignIn = async () => {
    if (!isSupabaseConfigured) {
      alert('GitHub login is not configured yet. Please configure Supabase in .env.local')
      return
    }

    setIsSigningIn(true)
    try {
      const response = await fetch('/auth/signin', {
        method: 'POST',
      })
      const data = await response.json()

      if (data.url) {
        window.location.href = data.url
      } else if (data.error) {
        alert(`Login error: ${data.error}`)
      }
    } catch (error) {
      console.error('Sign in error:', error)
      alert('Failed to sign in. Please try again.')
    } finally {
      setIsSigningIn(false)
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm">
      <div className="container flex h-16 md:h-20 items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <Code2 className="h-8 w-8 text-primary" />
          <span className="text-xl md:text-2xl font-bold text-foreground tracking-tight">Quick Buyer</span>
        </Link>

        <nav className="hidden lg:flex items-center gap-8">
          <Link
            href="/projects"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors relative after:absolute after:bottom-[-4px] after:left-0 after:h-[2px] after:w-0 after:bg-primary after:transition-all hover:after:w-full"
          >
            Projects
          </Link>
          <Link
            href={isHomePage ? "#features" : "/#features"}
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors relative after:absolute after:bottom-[-4px] after:left-0 after:h-[2px] after:w-0 after:bg-primary after:transition-all hover:after:w-full"
          >
            Features
          </Link>
          <Link
            href="/pricing"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors relative after:absolute after:bottom-[-4px] after:left-0 after:h-[2px] after:w-0 after:bg-primary after:transition-all hover:after:w-full"
          >
            Pricing
          </Link>
          <Link
            href={isHomePage ? "#faq" : "/#faq"}
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors relative after:absolute after:bottom-[-4px] after:left-0 after:h-[2px] after:w-0 after:bg-primary after:transition-all hover:after:w-full"
          >
            FAQ
          </Link>
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="hover:bg-accent"
          >
            <ShoppingCart className="h-5 w-5" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="hover:bg-accent"
            onClick={handleGitHubSignIn}
            disabled={isSigningIn}
          >
            <Github className="h-4 w-4 mr-2" />
            {isSigningIn ? 'Signing in...' : 'Sign In'}
          </Button>
          <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg hover:shadow-xl">
            上架 AI 項目
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
              Projects
            </Link>
            <Link
              href={isHomePage ? "#features" : "/#features"}
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Features
            </Link>
            <Link
              href="/pricing"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Pricing
            </Link>
            <Link
              href={isHomePage ? "#faq" : "/#faq"}
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              FAQ
            </Link>
            <div className="flex flex-col gap-2 pt-4 border-t border-border/40">
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={handleGitHubSignIn}
                disabled={isSigningIn}
              >
                <Github className="h-4 w-4 mr-2" />
                {isSigningIn ? 'Signing in...' : 'Sign In with GitHub'}
              </Button>
              <Button size="sm" className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                上架 AI 項目
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
