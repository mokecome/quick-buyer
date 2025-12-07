import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight, Bot, Zap, Shield, Sparkles } from "lucide-react"

export function Hero() {
  return (
    <section className="relative overflow-hidden py-20 md:py-32">
      {/* Background gradient */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-background via-background to-muted/30" />

      {/* Decorative elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />

      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center text-center space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
            <Sparkles className="h-4 w-4" />
            <span>AI 項目專屬市集</span>
          </div>

          {/* Main heading */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight max-w-4xl">
            探索優質{" "}
            <span className="text-primary">AI 項目</span>{" "}
            加速創新
          </h1>

          {/* Subtitle */}
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl">
            專注於 AI 領域的項目市集。發現生產就緒的 AI 模板、機器學習工具、
            LLM 應用和智能自動化方案。用經過驗證的 AI 代碼加速您的開發。
          </p>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Button size="lg" className="shadow-lg hover:shadow-xl" asChild>
              <Link href="/projects">
                瀏覽 AI 項目
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/pricing">
                上架您的 AI 項目
              </Link>
            </Button>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-8 pt-8">
            <div className="flex flex-col items-center">
              <span className="text-3xl md:text-4xl font-bold">200+</span>
              <span className="text-sm text-muted-foreground">AI 項目</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-3xl md:text-4xl font-bold">5K+</span>
              <span className="text-sm text-muted-foreground">AI 開發者</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-3xl md:text-4xl font-bold">50+</span>
              <span className="text-sm text-muted-foreground">AI 類別</span>
            </div>
          </div>

          {/* Trust badges */}
          <div className="flex items-center gap-6 pt-4 text-muted-foreground">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              <span className="text-sm">安全交易</span>
            </div>
            <div className="flex items-center gap-2">
              <Bot className="h-4 w-4" />
              <span className="text-sm">AI 品質認證</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
