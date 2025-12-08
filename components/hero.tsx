"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import { ArrowRight, GraduationCap, Laptop, Building2 } from "lucide-react"
import { useTranslation } from "react-i18next"

const scenarios = [
  { key: 'learner', icon: GraduationCap },
  { key: 'freelancer', icon: Laptop },
  { key: 'enterprise', icon: Building2 },
]

export function Hero() {
  const { t } = useTranslation()

  return (
    <section className="relative overflow-hidden py-20 md:py-28 lg:py-32">
      {/* Background gradient */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-background via-background to-muted/20" />

      {/* Decorative elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />

      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center text-center">
          {/* Main heading */}
          <div className="space-y-6 mb-12 md:mb-16">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight max-w-4xl leading-tight">
              {t('hero.title')}{" "}
              <span className="text-primary">{t('hero.titleHighlight')}</span>{" "}
              {t('hero.titleEnd')}
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              {t('hero.subtitle')}
            </p>
          </div>

          {/* Scenario Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6 w-full max-w-5xl mb-12">
            {scenarios.map((scenario) => (
              <Card
                key={scenario.key}
                className="group bg-card/50 backdrop-blur-sm hover:bg-card hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border hover:border-primary/20"
              >
                <CardContent className="p-6 md:p-8 flex flex-col items-center text-center h-full">
                  <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-5 group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                    <scenario.icon className="h-6 w-6 md:h-7 md:w-7 text-primary group-hover:text-primary-foreground transition-colors duration-300" />
                  </div>
                  <h3 className="text-lg md:text-xl font-bold mb-3">
                    {t(`hero.scenarios.${scenario.key}.title`)}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-6 flex-1">
                    {t(`hero.scenarios.${scenario.key}.desc`)}
                  </p>
                  <Button className="w-full" size="lg" asChild>
                    <Link href="/projects">
                      {t(`hero.scenarios.${scenario.key}.cta`)}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Secondary CTA */}
          <div className="flex items-center gap-3 mb-12">
            <span className="text-muted-foreground text-sm">{t('hero.orSell')}</span>
            <Button variant="outline" asChild>
              <Link href="/pricing">
                {t('hero.sellYourProject')}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-x-12 gap-y-4">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl md:text-4xl font-bold text-primary">200+</span>
              <span className="text-sm text-muted-foreground">{t('hero.stats.projects')}</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl md:text-4xl font-bold text-primary">5K+</span>
              <span className="text-sm text-muted-foreground">{t('hero.stats.developers')}</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl md:text-4xl font-bold text-primary">50+</span>
              <span className="text-sm text-muted-foreground">{t('hero.stats.categories')}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
