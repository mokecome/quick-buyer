"use client"

import { useEffect, useState } from "react"
import { ProjectCard } from "@/components/project-card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight, Loader2, Flame } from "lucide-react"
import { useTranslations } from "next-intl"

interface Project {
  id: string
  slug: string
  title: string
  description: string
  price: number
  category: string
  rating: number
  review_count: number
  author_name: string
  thumbnail_url?: string
}

// Fallback data for featured AI projects
const fallbackProjects = [
  {
    id: "1",
    slug: "agent-ppt-nano-banana",
    title: "Agent-PPT (Nano Banana)",
    description: "智能 PTT 爬蟲與分析 Agent，自動追蹤熱門話題、情緒分析、關鍵字監控。",
    price: 199,
    category: "AI Agent",
    rating: 4.9,
    review_count: 87,
    author_name: "NanoBanana",
  },
  {
    id: "2",
    slug: "ai-customer-service-sales",
    title: "智能客服 (銷售版)",
    description: "專為銷售場景打造的 AI 客服系統，支援多輪對話、意圖識別、商品推薦。",
    price: 299,
    category: "AI Agent",
    rating: 4.8,
    review_count: 156,
    author_name: "SalesAI",
  },
  {
    id: "3",
    slug: "agentic-rag",
    title: "Agentic RAG",
    description: "下一代智能檢索增強生成系統，結合多 Agent 協作、自動規劃、工具調用。",
    price: 249,
    category: "RAG",
    rating: 4.9,
    review_count: 203,
    author_name: "AgenticLabs",
  },
  {
    id: "4",
    slug: "sora-veo-video-generator",
    title: "Sora2/Veo3.1 視頻生成器",
    description: "整合 Sora 2 與 Veo 3.1 API 的視頻生成平台，無浮水印輸出。",
    price: 399,
    category: "Video AI",
    rating: 4.7,
    review_count: 312,
    author_name: "VideoGenPro",
  },
]

export function FeaturedProjects() {
  const t = useTranslations()
  const [projects, setProjects] = useState<Project[]>(fallbackProjects)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchProjects() {
      try {
        const response = await fetch('/api/projects?limit=4')
        const data = await response.json()

        if (data.projects && data.projects.length > 0) {
          setProjects(data.projects.slice(0, 4))
        }
      } catch (error) {
        console.error('Error fetching featured projects:', error)
        // Keep fallback data
      } finally {
        setIsLoading(false)
      }
    }

    fetchProjects()
  }, [])

  return (
    <section className="py-16 md:py-24 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-orange-500/5 rounded-full blur-[100px]" />
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-primary/5 rounded-full blur-[80px]" />

      <div className="container px-4 md:px-6 relative">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500/10 text-orange-600 dark:text-orange-400 text-sm font-medium border border-orange-500/20">
              <Flame className="h-4 w-4" />
              Hot Projects
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight">
              {t('featuredProjects.title')}
            </h2>
            <p className="text-lg text-muted-foreground max-w-xl">
              {t('featuredProjects.subtitle')}
            </p>
          </div>
          <Button variant="outline" size="lg" className="group self-start md:self-auto" asChild>
            <Link href="/projects">
              {t('featuredProjects.viewAll')}
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="h-10 w-10 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">Loading projects...</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {projects.map((project) => (
              <ProjectCard
                key={project.id}
                id={project.id}
                slug={project.slug}
                title={project.title}
                description={project.description}
                price={project.price}
                thumbnail={project.thumbnail_url}
                category={project.category}
                rating={project.rating || 0}
                reviewCount={project.review_count || 0}
                author={{ name: project.author_name }}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
