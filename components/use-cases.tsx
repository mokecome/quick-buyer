"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { GraduationCap, Lightbulb, Laptop, Building2 } from "lucide-react"
import { useTranslation } from "react-i18next"
import Link from "next/link"

const useCaseItems = [
  { key: 'learner', icon: GraduationCap },
  { key: 'pm', icon: Lightbulb },
  { key: 'freelancer', icon: Laptop },
  { key: 'enterprise', icon: Building2 },
]

export function UseCases() {
  const { t } = useTranslation()

  return (
    <section className="py-20 md:py-32">
      <div className="container px-4 md:px-6">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
            {t('useCases.title')}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t('useCases.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {useCaseItems.map((item, index) => (
            <Card
              key={index}
              className="bg-background hover:shadow-lg transition-all hover:-translate-y-1 flex flex-col"
            >
              <CardHeader className="pb-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <item.icon className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-xl">
                  {t(`useCases.items.${item.key}.title`)}
                </CardTitle>
                <CardDescription className="text-sm font-medium text-primary">
                  {t(`useCases.items.${item.key}.audience`)}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col">
                <div className="space-y-3 flex-1">
                  <div className="p-3 rounded-lg bg-destructive/5 border border-destructive/10">
                    <p className="text-sm text-muted-foreground">
                      <span className="font-medium text-destructive/80">痛點：</span>
                      {t(`useCases.items.${item.key}.painPoint`)}
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-green-500/5 border border-green-500/10">
                    <p className="text-sm text-muted-foreground">
                      <span className="font-medium text-green-600 dark:text-green-400">解決：</span>
                      {t(`useCases.items.${item.key}.solution`)}
                    </p>
                  </div>
                </div>
                <Button className="w-full mt-4" variant="outline" asChild>
                  <Link href="/projects">
                    {t(`useCases.items.${item.key}.cta`)}
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
