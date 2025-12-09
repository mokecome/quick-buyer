import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ProjectCard } from "@/components/project-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Filter } from "lucide-react"

// AI Projects data
const projects = [
  {
    id: "1",
    slug: "agent-ptt-nano-banana",
    title: "Agent-PPT (Nano Banana)",
    description: "智能 PTT 爬蟲與分析 Agent，自動追蹤熱門話題、情緒分析、關鍵字監控。支援即時通知與數據視覺化儀表板。",
    price: 199,
    category: "AI Agent",
    rating: 4.9,
    reviewCount: 87,
    author: { name: "NanoBanana" },
  },
  {
    id: "2",
    slug: "ai-customer-service-sales",
    title: "智能客服 (銷售版)",
    description: "專為銷售場景打造的 AI 客服系統，支援多輪對話、意圖識別、商品推薦、訂單查詢。整合 GPT-4 與知識庫 RAG。",
    price: 299,
    category: "AI Agent",
    rating: 4.8,
    reviewCount: 156,
    author: { name: "SalesAI" },
  },
  {
    id: "3",
    slug: "agentic-rag",
    title: "Agentic RAG",
    description: "下一代智能檢索增強生成系統，結合多 Agent 協作、自動規劃、工具調用。支援多數據源整合與複雜問答場景。",
    price: 249,
    category: "RAG",
    rating: 4.9,
    reviewCount: 203,
    author: { name: "AgenticLabs" },
  },
  {
    id: "4",
    slug: "sora-veo-video-generator",
    title: "無浮水印 Sora2/Veo3.1 視頻生成器",
    description: "整合 Sora 2 與 Veo 3.1 API 的視頻生成平台，無浮水印輸出、批量生成、風格控制。支援 4K 高清與多種比例。",
    price: 399,
    category: "Video AI",
    rating: 4.7,
    reviewCount: 312,
    author: { name: "VideoGenPro" },
  },
  {
    id: "5",
    slug: "chatgpt-saas-kit",
    title: "ChatGPT SaaS 完整套件",
    description: "基於 GPT-4 的完整 SaaS 解決方案，包含用戶認證、對話管理、Token 計費和管理後台。Next.js 14 + OpenAI API。",
    price: 179,
    category: "LLM",
    rating: 4.8,
    reviewCount: 245,
    author: { name: "ChatSaaS" },
  },
  {
    id: "6",
    slug: "ai-image-generation-platform",
    title: "AI 圖像生成平台",
    description: "整合 DALL-E 3、Stable Diffusion XL、Midjourney API 的圖像生成平台。支援文生圖、圖生圖、風格轉換、局部重繪。",
    price: 159,
    category: "Image AI",
    rating: 4.6,
    reviewCount: 178,
    author: { name: "ImageGenAI" },
  },
  {
    id: "7",
    slug: "voice-assistant-kit",
    title: "AI 語音助手套件",
    description: "結合 Whisper 語音識別、GPT-4 對話、TTS 語音合成的完整語音助手。支援多語言、即時轉錄、情感分析。",
    price: 189,
    category: "Voice AI",
    rating: 4.8,
    reviewCount: 92,
    author: { name: "VoiceAI" },
  },
  {
    id: "8",
    slug: "langchain-rag-template",
    title: "LangChain RAG 模板",
    description: "企業級 RAG 知識庫解決方案，支援 PDF、Word、網頁等多種格式。向量數據庫整合、智能問答、引用溯源。",
    price: 129,
    category: "RAG",
    rating: 4.7,
    reviewCount: 167,
    author: { name: "LangChainPro" },
  },
]

const categories = ["All", "AI Agent", "RAG", "LLM", "Video AI", "Image AI", "Voice AI"]

export default function ProjectsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <section className="py-12 md:py-20">
          <div className="container px-4 md:px-6">
            {/* Page Header */}
            <div className="text-center space-y-4 mb-12">
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
                Browse Projects
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Discover production-ready code projects from talented developers worldwide
              </p>
            </div>

            {/* Search and Filters */}
            <div className="flex flex-col md:flex-row gap-4 mb-8">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search projects..."
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
                {categories.map((category) => (
                  <Button
                    key={category}
                    variant={category === "All" ? "default" : "outline"}
                    size="sm"
                    className="whitespace-nowrap"
                  >
                    {category}
                  </Button>
                ))}
              </div>
            </div>

            {/* Projects Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {projects.map((project) => (
                <ProjectCard key={project.id} {...project} />
              ))}
            </div>

            {/* Load More */}
            <div className="flex justify-center mt-12">
              <Button variant="outline" size="lg">
                Load More Projects
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
