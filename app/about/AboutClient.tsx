"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { useLocale } from "next-intl"
import { Bot, Shield, Zap, Users, Heart, Target } from "lucide-react"

export default function AboutClient() {
  const locale = useLocale()
  const isZh = locale.startsWith('zh') || locale === 'ch'

  const values = [
    {
      icon: Shield,
      title: isZh ? "品質保證" : "Quality Assurance",
      description: isZh
        ? "每個項目都經過嚴格審核，確保代碼品質和安全性"
        : "Every project undergoes rigorous review to ensure code quality and security"
    },
    {
      icon: Zap,
      title: isZh ? "快速交付" : "Fast Delivery",
      description: isZh
        ? "購買即可立即下載，縮短您的開發週期"
        : "Instant download upon purchase, shortening your development cycle"
    },
    {
      icon: Users,
      title: isZh ? "開發者優先" : "Developer First",
      description: isZh
        ? "由開發者打造，為開發者服務，我們理解您的需求"
        : "Built by developers, for developers. We understand your needs"
    },
    {
      icon: Heart,
      title: isZh ? "社群驅動" : "Community Driven",
      description: isZh
        ? "連接全球 AI 開發者，共同推動 AI 創新"
        : "Connecting AI developers worldwide to drive AI innovation together"
    }
  ]

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-16 md:py-24 bg-gradient-to-b from-primary/5 to-background">
          <div className="container px-4 md:px-6 text-center">
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-primary/10 rounded-full">
                <Bot className="h-12 w-12 text-primary" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              {isZh ? "關於 Quick Buyer" : "About Quick Buyer"}
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              {isZh
                ? "我們是專注於 AI 項目的優質交易市集，致力於幫助開發者更快地將 AI 創意變為現實。"
                : "We are a premium marketplace focused on AI projects, dedicated to helping developers turn AI ideas into reality faster."}
            </p>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-16">
          <div className="container px-4 md:px-6 max-w-4xl">
            <div className="text-center mb-12">
              <Target className="h-10 w-10 text-primary mx-auto mb-4" />
              <h2 className="text-3xl font-bold mb-4">
                {isZh ? "我們的使命" : "Our Mission"}
              </h2>
              <p className="text-lg text-muted-foreground">
                {isZh
                  ? "讓每個開發者都能輕鬆獲取高品質的 AI 解決方案，加速 AI 應用的普及與創新。我們相信，通過連接 AI 項目的創建者和使用者，可以大幅降低 AI 開發的門檻，讓更多人受益於 AI 技術的發展。"
                  : "To make high-quality AI solutions easily accessible to every developer, accelerating the adoption and innovation of AI applications. We believe that by connecting creators and users of AI projects, we can significantly lower the barriers to AI development and bring the benefits of AI technology to more people."}
              </p>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-16 bg-muted/30">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold text-center mb-12">
              {isZh ? "我們的價值觀" : "Our Values"}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, index) => (
                <div key={index} className="text-center">
                  <div className="inline-flex p-3 bg-primary/10 rounded-lg mb-4">
                    <value.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{value.title}</h3>
                  <p className="text-muted-foreground text-sm">{value.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16">
          <div className="container px-4 md:px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-4xl font-bold text-primary mb-2">100+</div>
                <div className="text-muted-foreground">{isZh ? "AI 項目" : "AI Projects"}</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-primary mb-2">500+</div>
                <div className="text-muted-foreground">{isZh ? "開發者" : "Developers"}</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-primary mb-2">8+</div>
                <div className="text-muted-foreground">{isZh ? "AI 分類" : "AI Categories"}</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-primary mb-2">99%</div>
                <div className="text-muted-foreground">{isZh ? "滿意度" : "Satisfaction"}</div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-16 bg-muted/30">
          <div className="container px-4 md:px-6 text-center">
            <h2 className="text-3xl font-bold mb-4">
              {isZh ? "聯繫我們" : "Contact Us"}
            </h2>
            <p className="text-muted-foreground mb-6">
              {isZh
                ? "有任何問題或建議？我們很樂意聽取您的意見。"
                : "Have questions or suggestions? We'd love to hear from you."}
            </p>
            <a
              href="mailto:supports@quick-buyer.com"
              className="inline-flex items-center justify-center px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
            >
              supports@quick-buyer.com
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
