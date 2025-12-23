"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { useTranslation } from "react-i18next"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CalendarDays, Clock, ArrowRight } from "lucide-react"
import Link from "next/link"

export default function BlogPage() {
  const { i18n } = useTranslation()
  const isZh = i18n.language?.startsWith('zh') || i18n.language === 'ch'

  const posts = [
    {
      slug: "getting-started-with-ai-development",
      title: isZh ? "AI 開發入門指南：從零開始構建你的第一個 AI 應用" : "Getting Started with AI Development: Build Your First AI App",
      description: isZh
        ? "本文將帶你了解 AI 開發的基礎知識，包括選擇合適的框架、設置開發環境，以及構建一個簡單的 AI 應用。"
        : "This guide covers AI development basics, including choosing the right framework, setting up your environment, and building a simple AI application.",
      date: "2024-12-15",
      readTime: isZh ? "8 分鐘" : "8 min read",
      category: isZh ? "教學" : "Tutorial",
    },
    {
      slug: "top-ai-trends-2024",
      title: isZh ? "2024 年 AI 技術趨勢：開發者必須知道的 5 個方向" : "Top AI Trends 2024: 5 Directions Every Developer Should Know",
      description: isZh
        ? "從大型語言模型到多模態 AI，了解 2024 年最重要的 AI 技術趨勢，以及如何將它們應用到你的項目中。"
        : "From large language models to multimodal AI, discover the most important AI trends of 2024 and how to apply them to your projects.",
      date: "2024-12-10",
      readTime: isZh ? "6 分鐘" : "6 min read",
      category: isZh ? "趨勢" : "Trends",
    },
    {
      slug: "chatgpt-api-best-practices",
      title: isZh ? "ChatGPT API 最佳實踐：打造高效能 AI 應用" : "ChatGPT API Best Practices: Building High-Performance AI Apps",
      description: isZh
        ? "深入了解如何有效使用 ChatGPT API，包括提示工程、錯誤處理、成本優化等關鍵技巧。"
        : "Deep dive into effectively using the ChatGPT API, including prompt engineering, error handling, and cost optimization techniques.",
      date: "2024-12-05",
      readTime: isZh ? "10 分鐘" : "10 min read",
      category: isZh ? "技術" : "Technical",
    },
    {
      slug: "monetize-your-ai-projects",
      title: isZh ? "如何將你的 AI 項目變現：完整指南" : "How to Monetize Your AI Projects: A Complete Guide",
      description: isZh
        ? "了解將 AI 項目商業化的各種方式，從 SaaS 模式到市集銷售，找到最適合你的變現策略。"
        : "Explore various ways to commercialize AI projects, from SaaS models to marketplace sales, and find the best monetization strategy for you.",
      date: "2024-11-28",
      readTime: isZh ? "7 分鐘" : "7 min read",
      category: isZh ? "商業" : "Business",
    },
    {
      slug: "rag-system-tutorial",
      title: isZh ? "RAG 系統實戰教學：構建企業級知識庫" : "RAG System Tutorial: Building Enterprise Knowledge Bases",
      description: isZh
        ? "手把手教你使用 LangChain 和向量數據庫構建一個生產就緒的 RAG 系統，實現智能文檔問答。"
        : "Step-by-step guide to building a production-ready RAG system using LangChain and vector databases for intelligent document Q&A.",
      date: "2024-11-20",
      readTime: isZh ? "12 分鐘" : "12 min read",
      category: isZh ? "教學" : "Tutorial",
    },
    {
      slug: "ai-image-generation-guide",
      title: isZh ? "AI 圖像生成完全指南：從 DALL-E 到 Stable Diffusion" : "Complete Guide to AI Image Generation: From DALL-E to Stable Diffusion",
      description: isZh
        ? "比較不同的 AI 圖像生成模型，了解它們的優缺點，以及如何在你的應用中整合它們。"
        : "Compare different AI image generation models, understand their pros and cons, and learn how to integrate them into your applications.",
      date: "2024-11-15",
      readTime: isZh ? "9 分鐘" : "9 min read",
      category: isZh ? "技術" : "Technical",
    },
  ]

  const categoryColors: Record<string, string> = {
    "教學": "bg-blue-500/10 text-blue-500",
    "Tutorial": "bg-blue-500/10 text-blue-500",
    "趨勢": "bg-purple-500/10 text-purple-500",
    "Trends": "bg-purple-500/10 text-purple-500",
    "技術": "bg-green-500/10 text-green-500",
    "Technical": "bg-green-500/10 text-green-500",
    "商業": "bg-orange-500/10 text-orange-500",
    "Business": "bg-orange-500/10 text-orange-500",
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 py-12">
        <div className="container px-4 md:px-6">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">
              {isZh ? "部落格" : "Blog"}
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              {isZh
                ? "AI 開發技巧、行業趨勢和最佳實踐"
                : "AI development tips, industry trends, and best practices"}
            </p>
          </div>

          {/* Blog Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <Card key={post.slug} className="group hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="secondary" className={categoryColors[post.category]}>
                      {post.category}
                    </Badge>
                  </div>
                  <CardTitle className="line-clamp-2 group-hover:text-primary transition-colors">
                    {post.title}
                  </CardTitle>
                  <CardDescription className="line-clamp-3">
                    {post.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1">
                        <CalendarDays className="h-4 w-4" />
                        {post.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {post.readTime}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Coming Soon Notice */}
          <div className="mt-12 text-center">
            <p className="text-muted-foreground">
              {isZh
                ? "更多精彩內容即將推出，敬請期待！"
                : "More exciting content coming soon, stay tuned!"}
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
