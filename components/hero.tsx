"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight, Bot, Shield, Sparkles } from "lucide-react"
import { useTranslation } from "react-i18next"

export function Hero() {
  const { t } = useTranslation()

  return (
    <section className="relative overflow-hidden py-20 md:py-32">
      {/* Background gradient */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-background via-background to-muted/30" />

      {/* Decorative elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />

      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center text-center space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
            <Sparkles className="h-4 w-4" />
            <span>{t('hero.badge')}</span>
          </div>

          {/* Main heading */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight max-w-4xl">
            {t('hero.title')}{" "}
            <span className="text-primary">{t('hero.titleHighlight')}</span>{" "}
            {t('hero.titleEnd')}
          </h1>

          {/* Subtitle */}
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl">
            {t('hero.subtitle')}
          </p>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Button size="lg" className="shadow-lg hover:shadow-xl" asChild>
              <Link href="/projects">
                {t('hero.browseProjects')}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/pricing">
                {t('hero.sellYourProject')}
              </Link>
            </Button>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-8 pt-8">
            <div className="flex flex-col items-center">
              <span className="text-3xl md:text-4xl font-bold">200+</span>
              <span className="text-sm text-muted-foreground">{t('hero.stats.projects')}</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-3xl md:text-4xl font-bold">5K+</span>
              <span className="text-sm text-muted-foreground">{t('hero.stats.developers')}</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-3xl md:text-4xl font-bold">50+</span>
              <span className="text-sm text-muted-foreground">{t('hero.stats.categories')}</span>
            </div>
          </div>

          {/* Trust badges */}
          <div className="flex items-center gap-6 pt-4 text-muted-foreground">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              <span className="text-sm">{t('hero.trust.securePayments')}</span>
            </div>
            <div className="flex items-center gap-2">
              <Bot className="h-4 w-4" />
              <span className="text-sm">{t('hero.trust.qualityVerified')}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
