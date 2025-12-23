"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowRight, Globe, Upload, Zap, Shield, Clock } from "lucide-react"
import Link from "next/link"
import { useTranslation } from "react-i18next"

const features = [
  { icon: Zap, key: 'instant' },
  { icon: Shield, key: 'permanent' },
  { icon: Clock, key: 'free' },
]

export function BrowserDeploy() {
  const { t } = useTranslation()

  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-muted/20 to-background relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />

      <div className="container px-4 md:px-6 relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
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

            {/* Features list */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              {features.map((feature) => (
                <div key={feature.key} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <feature.icon className="h-4 w-4 text-emerald-500" />
                  <span>{t(`browserDeploy.features.${feature.key}`)}</span>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pt-4">
              <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-white" asChild>
                <Link href="/deploy">
                  <Globe className="mr-2 h-5 w-5" />
                  {t('browserDeploy.browseSites')}
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/deploy/upload">
                  <Upload className="mr-2 h-5 w-5" />
                  {t('browserDeploy.cta')}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>

          {/* Right Side - Preview Cards */}
          <div className="relative">
            {/* Main card */}
            <Card className="overflow-hidden shadow-2xl border-0 bg-gradient-to-br from-card to-card/80">
              <div className="aspect-video bg-gradient-to-br from-emerald-500/10 to-primary/10 relative overflow-hidden">
                {/* Browser frame */}
                <div className="absolute top-0 left-0 right-0 h-8 bg-muted/50 backdrop-blur flex items-center px-3 gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-400/80" />
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-400/80" />
                  <div className="w-2.5 h-2.5 rounded-full bg-green-400/80" />
                  <div className="flex-1 mx-3 h-4 bg-background/50 rounded text-[10px] text-muted-foreground flex items-center px-2">
                    ipfs.glitterprotocol.dev/ipfs/Qm...
                  </div>
                </div>
                {/* Content preview */}
                <div className="pt-12 p-6 h-full flex items-center justify-center">
                  <div className="text-center space-y-3">
                    <Globe className="h-16 w-16 text-emerald-500/50 mx-auto" />
                    <p className="text-sm text-muted-foreground">{t('browserDeploy.preview.title')}</p>
                  </div>
                </div>
              </div>
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{t('browserDeploy.preview.siteName')}</p>
                    <p className="text-sm text-muted-foreground">{t('browserDeploy.preview.hosted')}</p>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-emerald-600 bg-emerald-500/10 px-2.5 py-1 rounded-full">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    {t('browserDeploy.preview.live')}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Floating decoration cards */}
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-emerald-500/10 rounded-lg rotate-12 hidden lg:block" />
            <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-primary/10 rounded-lg -rotate-6 hidden lg:block" />
          </div>
        </div>
      </div>
    </section>
  )
}
