"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { PricingCards } from "@/components/pricing-cards"
import { useTranslations } from "next-intl"

export default function PricingClient() {
  const t = useTranslations()

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <section className="py-20 md:py-32">
          <div className="container px-4 md:px-6">
            {/* Page Header */}
            <div className="text-center space-y-4 mb-16">
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
                {t('pricing.title')}
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                {t('pricing.subtitle')}
              </p>
            </div>

            <PricingCards />
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
