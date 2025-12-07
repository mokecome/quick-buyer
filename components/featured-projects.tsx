import { ProjectCard } from "@/components/project-card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

// Mock data for featured AI projects
const featuredProjects = [
  {
    id: "1",
    slug: "chatgpt-saas-kit",
    title: "ChatGPT SaaS 完整套件",
    description: "基於 GPT-4 的完整 SaaS 方案，包含用戶認證、對話管理、Token 計費和管理後台。Next.js 14 + OpenAI API。",
    price: 199,
    category: "LLM",
    rating: 4.9,
    reviewCount: 156,
    author: { name: "AI Studio" },
  },
  {
    id: "2",
    slug: "ai-image-generator",
    title: "AI 圖像生成平台",
    description: "整合 DALL-E 3 和 Stable Diffusion 的圖像生成平台。支持文生圖、圖生圖、風格遷移等功能。",
    price: 149,
    category: "圖像 AI",
    rating: 4.8,
    reviewCount: 98,
    author: { name: "VisionLabs" },
  },
  {
    id: "3",
    slug: "langchain-rag-template",
    title: "LangChain RAG 模板",
    description: "企業級 RAG 知識庫方案。支持多種文檔格式、向量數據庫整合、智能問答。Python + LangChain。",
    price: 129,
    category: "RAG",
    rating: 4.9,
    reviewCount: 87,
    author: { name: "LangAI" },
  },
  {
    id: "4",
    slug: "ai-voice-assistant",
    title: "AI 語音助手套件",
    description: "結合 Whisper 語音識別和 TTS 的完整語音助手方案。支持多語言、即時轉錄、語音合成。",
    price: 169,
    category: "語音 AI",
    rating: 4.7,
    reviewCount: 63,
    author: { name: "VoiceTech" },
  },
]

export function FeaturedProjects() {
  return (
    <section className="py-20 md:py-32">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12">
          <div className="space-y-2">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
              精選 AI 項目
            </h2>
            <p className="text-lg text-muted-foreground">
              精心挑選的優質 AI 解決方案
            </p>
          </div>
          <Button variant="outline" asChild>
            <Link href="/projects">
              查看全部項目
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProjects.map((project) => (
            <ProjectCard key={project.id} {...project} />
          ))}
        </div>
      </div>
    </section>
  )
}
