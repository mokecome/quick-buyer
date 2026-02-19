"use client"

import Link from "next/link"
import { Bot, Github, Twitter } from "lucide-react"
import { useTranslations } from "next-intl"

const linkClass = "text-muted-foreground hover:text-foreground transition-colors"

export function Footer() {
  const t = useTranslations()

  const aiCategoryLinks = [
    { href: "/projects", label: t('footer.browseAll') },
    { href: "/projects?category=llm", label: t('footer.llmApps') },
    { href: "/projects?category=image-ai", label: t('footer.imageAI') },
    { href: "/projects?category=voice-ai", label: t('footer.voiceAI') },
  ]

  const companyLinks = [
    { href: "/about", label: t('footer.about') },
    { href: "/blog", label: t('footer.blog') },
    { href: "/pricing", label: t('footer.pricingPlans') },
    { href: "/dashboard/sell", label: t('footer.sellYourProject') },
  ]

  const legalLinks = [
    { href: "/privacy", label: t('footer.privacy') },
    { href: "/terms", label: t('footer.terms') },
    { href: "/refund", label: t('footer.refund') },
  ]

  return (
    <footer className="border-t border-border/40 bg-background">
      <div className="container px-4 md:px-6 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <Bot className="h-6 w-6 text-primary" />
              <span className="text-lg font-bold">Quick Buyer</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              {t('footer.description')}
            </p>
            <div className="flex gap-4">
              <a href="https://github.com/mokecome" target="_blank" rel="noopener noreferrer" className={linkClass}>
                <Github className="h-5 w-5" />
              </a>
              <a href="https://x.com/mokecome" target="_blank" rel="noopener noreferrer" className={linkClass}>
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* AI Categories */}
          <div className="space-y-4">
            <h3 className="font-semibold">{t('footer.aiCategories')}</h3>
            <ul className="space-y-2 text-sm">
              {aiCategoryLinks.map(({ href, label }) => (
                <li key={href}>
                  <Link href={href} className={linkClass}>{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div className="space-y-4">
            <h3 className="font-semibold">{t('footer.aboutUs')}</h3>
            <ul className="space-y-2 text-sm">
              {companyLinks.map(({ href, label }) => (
                <li key={href}>
                  <Link href={href} className={linkClass}>{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div className="space-y-4">
            <h3 className="font-semibold">{t('footer.legal')}</h3>
            <ul className="space-y-2 text-sm">
              {legalLinks.map(({ href, label }) => (
                <li key={href}>
                  <Link href={href} className={linkClass}>{label}</Link>
                </li>
              ))}
              <li>
                <a href="mailto:supports@quick-buyer.com" className={linkClass}>
                  {t('footer.emailSupport')}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border/40">
          <p className="text-center text-sm text-muted-foreground">
            {t('footer.copyright', { year: new Date().getFullYear() })}
          </p>
        </div>
      </div>
    </footer>
  )
}
