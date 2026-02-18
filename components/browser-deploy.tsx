"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowRight, Globe, Upload, Zap, Shield, Clock, Sparkles } from "lucide-react"
import Link from "next/link"
import { useTranslations } from "next-intl"

const features = [
  { icon: Zap, key: 'instant' },
  { icon: Shield, key: 'permanent' },
  { icon: Clock, key: 'free' },
]

export function BrowserDeploy() {
  const t = useTranslations()

  return (
    <section className="py-20 md:py-28 bg-gradient-to-b from-emerald-50/50 via-background to-background dark:from-emerald-950/20 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[100px]" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-primary/10 rounded-full blur-[80px]" />

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.02)_1px,transparent_1px)] bg-[size:32px_32px] dark:bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)]" />

      <div className="container px-4 md:px-6 relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left content */}
          <div className="space-y-8 lg:pl-4">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-sm font-medium border border-emerald-500/20">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              {t('browserDeploy.badge')}
            </div>

            {/* Title */}
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight">
              <span className="bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-400 dark:to-teal-400 bg-clip-text text-transparent">
                {t('browserDeploy.title')}
              </span>
            </h2>

            {/* Subtitle */}
            <p className="text-lg text-muted-foreground leading-relaxed max-w-xl">
              {t('browserDeploy.subtitle')}
            </p>

            {/* Features list */}
            <div className="flex flex-wrap gap-4">
              {features.map((feature) => (
                <div
                  key={feature.key}
                  className="flex items-center gap-2 px-4 py-2 rounded-full bg-background/80 backdrop-blur-sm border shadow-sm"
                >
                  <feature.icon className="h-4 w-4 text-emerald-500" />
                  <span className="text-sm font-medium">{t(`browserDeploy.features.${feature.key}`)}</span>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <Button size="lg" className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-lg shadow-emerald-500/25 hover:shadow-xl hover:shadow-emerald-500/30 transition-all" asChild>
                <Link href="/deploy">
                  <Globe className="mr-2 h-5 w-5" />
                  {t('browserDeploy.browseSites')}
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="group border-2 hover:border-emerald-500/50 hover:bg-emerald-50/50 dark:hover:bg-emerald-950/20" asChild>
                <Link href="/deploy/upload">
                  <Upload className="mr-2 h-5 w-5 group-hover:text-emerald-600 transition-colors" />
                  {t('browserDeploy.cta')}
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </div>
          </div>

          {/* Right content - Preview Card */}
          <div className="relative lg:pl-8">
            {/* Glow effect behind card */}
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-3xl blur-2xl scale-95" />

            <Card className="relative overflow-hidden shadow-2xl border-0 bg-gradient-to-br from-card to-card/90 backdrop-blur-xl">
              <div className="aspect-[4/3] bg-gradient-to-br from-emerald-500/5 via-transparent to-primary/5 relative overflow-hidden">
                {/* Browser frame */}
                <div className="absolute top-0 left-0 right-0 h-10 bg-muted/60 backdrop-blur-md flex items-center px-4 gap-2 border-b">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-400/80 hover:bg-red-500 transition-colors cursor-pointer" />
                    <div className="w-3 h-3 rounded-full bg-yellow-400/80 hover:bg-yellow-500 transition-colors cursor-pointer" />
                    <div className="w-3 h-3 rounded-full bg-green-400/80 hover:bg-green-500 transition-colors cursor-pointer" />
                  </div>
                  <div className="flex-1 mx-4 h-6 bg-background/60 rounded-md text-xs text-muted-foreground flex items-center px-3 border">
                    <Globe className="h-3 w-3 mr-2 text-emerald-500" />
                    ipfs.glitterprotocol.dev/ipfs/Qm...
                  </div>
                </div>

                {/* Content preview */}
                <div className="pt-14 p-8 h-full flex items-center justify-center">
                  <div className="text-center space-y-4">
                    <div className="relative">
                      <div className="absolute inset-0 bg-emerald-500/20 rounded-full blur-xl animate-pulse" />
                      <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 flex items-center justify-center mx-auto border border-emerald-500/30">
                        <Sparkles className="h-10 w-10 text-emerald-500" />
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">{t('browserDeploy.preview.title')}</p>
                  </div>
                </div>
              </div>

              <CardContent className="p-5 border-t bg-gradient-to-r from-background to-muted/30">
                <div className="flex items-center justify-between">
                  <div className="text-left">
                    <p className="font-semibold">{t('browserDeploy.preview.siteName')}</p>
                    <p className="text-sm text-muted-foreground">{t('browserDeploy.preview.hosted')}</p>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-full border border-emerald-500/20">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                    {t('browserDeploy.preview.live')}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Floating decoration elements */}
            <div className="absolute -top-6 -right-6 w-32 h-32 bg-gradient-to-br from-emerald-500/20 to-teal-500/10 rounded-2xl rotate-12 hidden lg:block border border-emerald-500/10" />
            <div className="absolute -bottom-8 -left-8 w-40 h-40 bg-gradient-to-br from-primary/20 to-purple-500/10 rounded-2xl -rotate-6 hidden lg:block border border-primary/10" />
          </div>
        </div>
      </div>
    </section>
  )
}
