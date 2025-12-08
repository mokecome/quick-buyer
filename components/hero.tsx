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
    <section className="relative overflow-hidden py-16 md:py-24">
      {/* Background gradient */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-background via-background to-muted/30" />

      {/* Decorative elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />

      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center text-center space-y-10">
          {/* Main heading */}
          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight max-w-3xl">
              {t('hero.title')}{" "}
              <span className="text-primary">{t('hero.titleHighlight')}</span>{" "}
              {t('hero.titleEnd')}
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t('hero.subtitle')}
            </p>
          </div>

          {/* Scenario Cards - 三欄 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl">
            {scenarios.map((scenario) => (
              <Card
                key={scenario.key}
                className="group bg-card hover:shadow-xl transition-all hover:-translate-y-1 border-2 hover:border-primary/30"
              >
                <CardContent className="p-6 flex flex-col items-center text-center space-y-4">
                  <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <scenario.icon className="h-7 w-7 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold">
                    {t(`hero.scenarios.${scenario.key}.title`)}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {t(`hero.scenarios.${scenario.key}.desc`)}
                  </p>
                  <Button className="w-full mt-2" asChild>
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
          <div className="flex flex-col sm:flex-row items-center gap-4 pt-2">
            <span className="text-muted-foreground">{t('hero.orSell')}</span>
            <Button size="lg" variant="outline" asChild>
              <Link href="/pricing">
                {t('hero.sellYourProject')}
              </Link>
            </Button>
          </div>

          {/* Stats */}
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
