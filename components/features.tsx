"use client"

import { Bot, Zap, Shield, Brain, Cpu, Sparkles } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useTranslation } from "react-i18next"

const featureKeys = [
  { key: 'aiModels', icon: Brain },
  { key: 'instantDeploy', icon: Zap },
  { key: 'secure', icon: Shield },
  { key: 'categories', icon: Cpu },
  { key: 'developerFriendly', icon: Bot },
  { key: 'updates', icon: Sparkles },
]

export function Features() {
  const { t } = useTranslation()

  return (
    <section id="features" className="py-12 md:py-16 bg-muted/30">
      <div className="container px-4 md:px-6">
        <div className="text-center space-y-4 mb-10">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
            {t('features.title')}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t('features.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featureKeys.map((feature, index) => (
            <Card key={index} className="bg-background hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>{t(`features.items.${feature.key}.title`)}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
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
