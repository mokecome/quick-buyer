"use client"

import { Bot, Zap, Shield, Brain, Cpu, Sparkles } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useTranslation } from "react-i18next"

const featureKeys = [
  { key: 'aiModels', icon: Brain, color: 'from-violet-500 to-purple-600' },
  { key: 'instantDeploy', icon: Zap, color: 'from-amber-500 to-orange-600' },
  { key: 'secure', icon: Shield, color: 'from-emerald-500 to-teal-600' },
  { key: 'categories', icon: Cpu, color: 'from-blue-500 to-cyan-600' },
  { key: 'developerFriendly', icon: Bot, color: 'from-pink-500 to-rose-600' },
  { key: 'updates', icon: Sparkles, color: 'from-indigo-500 to-violet-600' },
]

export function Features() {
  const { t } = useTranslation()

  return (
    <section id="features" className="py-20 md:py-28 bg-gradient-to-b from-muted/50 to-background relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[120px]" />

      <div className="container px-4 md:px-6 relative">
        <div className="text-center space-y-4 mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium border border-primary/20 mb-4">
            <Sparkles className="h-4 w-4" />
            Why Choose Us
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight">
            {t('features.title')}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            {t('features.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {featureKeys.map((feature, index) => (
            <Card
              key={index}
              className="group bg-card/60 backdrop-blur-sm hover:bg-card hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-0 shadow-md overflow-hidden"
            >
              <CardHeader className="pb-4">
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-5 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="h-7 w-7 text-white" />
                </div>
                <CardTitle className="text-xl">{t(`features.items.${feature.key}.title`)}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base leading-relaxed">
                  {t(`features.items.${feature.key}.description`)}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
