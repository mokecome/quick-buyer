"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import { ArrowRight, GraduationCap, Laptop, Building2, Sparkles } from "lucide-react"
import { useTranslations } from "next-intl"

const scenarios = [
  { key: 'learner', icon: GraduationCap, color: 'from-blue-500 to-cyan-500' },
  { key: 'freelancer', icon: Laptop, color: 'from-purple-500 to-pink-500' },
  { key: 'enterprise', icon: Building2, color: 'from-orange-500 to-red-500' },
]

export function Hero() {
  const t = useTranslations()

  return (
    <section className="relative overflow-hidden pt-16 pb-12 md:pt-24 md:pb-16">
      {/* Background gradient */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-primary/5 via-background to-background" />

      {/* Animated gradient orbs */}
      <div className="absolute top-20 left-10 w-[400px] h-[400px] bg-gradient-to-r from-primary/20 to-purple-500/20 rounded-full blur-[100px] animate-pulse" />
      <div className="absolute bottom-20 right-10 w-[500px] h-[500px] bg-gradient-to-r from-blue-500/15 to-cyan-500/15 rounded-full blur-[120px]" />

      {/* Grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.02)_1px,transparent_1px)] bg-[size:40px_40px] dark:bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)]" />

      <div className="container px-4 md:px-6 relative">
        <div className="flex flex-col items-center text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-8 border border-primary/20">
            <Sparkles className="h-4 w-4" />
            AI Project Marketplace
          </div>

          {/* Main heading */}
          <div className="space-y-6 mb-14 md:mb-18">
            <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight max-w-5xl leading-[1.1]">
              {t('hero.title')}{" "}
              <span className="bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent">
                {t('hero.titleHighlight')}
              </span>{" "}
              <br className="hidden md:block" />
              {t('hero.titleEnd')}
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mx-auto leading-relaxed max-w-2xl">
              {t('hero.subtitle')}
            </p>
          </div>

          {/* Scenario Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 w-full max-w-5xl mb-14">
            {scenarios.map((scenario, index) => (
              <Card
                key={scenario.key}
                className="group relative bg-card/60 backdrop-blur-xl hover:bg-card hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border-0 shadow-lg overflow-hidden"
              >
                {/* Card gradient border effect */}
                <div className={`absolute inset-0 bg-gradient-to-br ${scenario.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
                <div className="absolute inset-[1px] bg-card rounded-[inherit]" />

                <CardContent className="relative p-7 md:p-8 flex flex-col items-center text-center h-full">
                  <div className={`w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-gradient-to-br ${scenario.color} flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 group-hover:shadow-xl transition-all duration-300`}>
                    <scenario.icon className="h-7 w-7 md:h-8 md:w-8 text-white" />
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold mb-3">
                    {t(`hero.scenarios.${scenario.key}.title`)}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-6 flex-1">
                    {t(`hero.scenarios.${scenario.key}.desc`)}
                  </p>
                  <Button className="w-full group/btn" size="lg" asChild>
                    <Link href="/projects">
                      {t(`hero.scenarios.${scenario.key}.cta`)}
                      <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Secondary CTA */}
          <div className="flex items-center gap-4 px-6 py-3 rounded-full bg-muted/50 backdrop-blur-sm border">
            <span className="text-muted-foreground text-sm">{t('hero.orSell')}</span>
            <Button variant="default" size="sm" className="rounded-full" asChild>
              <Link href="/pricing">
                {t('hero.sellYourProject')}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
