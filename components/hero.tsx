"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight, GraduationCap, Lightbulb, Laptop, Building2 } from "lucide-react"
import { useTranslation } from "react-i18next"

const scenarios = [
  { key: 'learner', icon: GraduationCap },
  { key: 'pm', icon: Lightbulb },
  { key: 'freelancer', icon: Laptop },
  { key: 'enterprise', icon: Building2 },
]

export function Hero() {
  const { t } = useTranslation()

  return (
    <section className="relative overflow-hidden py-16 md:py-24">
      {/* Background gradient */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-background via-background to-muted/30" />

      {/* Decorative elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />

      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center text-center space-y-8">
          {/* Main heading */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight max-w-3xl">
            {t('hero.title')}{" "}
            <span className="text-primary">{t('hero.titleHighlight')}</span>{" "}
            {t('hero.titleEnd')}
          </h1>

          {/* Subtitle */}
          <p className="text-lg text-muted-foreground max-w-2xl">
            {t('hero.subtitle')}
          </p>

          {/* Scenario Cards - 場景優先 */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 w-full max-w-4xl pt-4">
            {scenarios.map((scenario) => (
              <Link
                key={scenario.key}
                href="/projects"
                className="group relative p-4 md:p-5 rounded-xl bg-card border hover:border-primary/50 hover:shadow-lg transition-all hover:-translate-y-1"
              >
                <div className="flex flex-col items-center text-center space-y-2">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <scenario.icon className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="font-semibold text-sm md:text-base">
                    {t(`hero.scenarios.${scenario.key}.title`)}
                  </h3>
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {t(`hero.scenarios.${scenario.key}.desc`)}
                  </p>
                </div>
              </Link>
            ))}
          </div>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
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

          {/* Stats - 更簡潔 */}
          <div className="flex flex-wrap justify-center gap-8 pt-4 text-muted-foreground">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-foreground">200+</span>
              <span className="text-sm">{t('hero.stats.projects')}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-foreground">5K+</span>
              <span className="text-sm">{t('hero.stats.developers')}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-foreground">50+</span>
              <span className="text-sm">{t('hero.stats.categories')}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
