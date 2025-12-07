import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { PricingCards } from "@/components/pricing-cards"

export default function PricingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <section className="py-20 md:py-32">
          <div className="container px-4 md:px-6">
            {/* Page Header */}
            <div className="text-center space-y-4 mb-16">
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
                簡單透明的定價方案
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                選擇適合您的方案。無需預付費用，立即開始銷售您的 AI 項目。
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
