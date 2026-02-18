import type { Metadata } from "next"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, ShoppingCart, Check, Eye, Code2 } from "lucide-react"
import Image from "next/image"
import { notFound } from "next/navigation"
import { createClient } from "@/lib/supabase/server"

// Fallback project data
const fallbackProjects: Record<string, Project> = {
  "agent-ppt-nano-banana": {
    id: "1",
    slug: "agent-ppt-nano-banana",
    title: "Agent-PPT (Nano Banana)",
    description: "智能 PTT 爬蟲與分析 Agent，自動追蹤熱門話題、情緒分析、關鍵字監控。支援即時通知與數據視覺化儀表板。",
    long_description: `## 功能特色

- **智能爬蟲**: 自動追蹤 PTT 各版文章，支援關鍵字過濾
- **情緒分析**: 基於 LLM 的情緒判斷，識別正負面評論
- **熱門追蹤**: 即時監控爆文、熱門話題趨勢
- **關鍵字監控**: 自訂關鍵字，新文章即時通知
- **數據儀表板**: 視覺化呈現數據趨勢與統計

## 技術架構

- Python + Playwright 爬蟲引擎
- LangChain + GPT-4 情緒分析
- FastAPI 後端 API
- Next.js 14 前端儀表板
- PostgreSQL + Redis 數據存儲
- LINE / Telegram Bot 通知

## 應用場景

- 品牌輿情監控
- 投資情報收集
- 市場趨勢分析
- 競品監測`,
    price: 199,
    category: "AI Agent",
    rating: 4.9,
    review_count: 87,
    download_count: 520,
    author_name: "NanoBanana",
    author_avatar: null,
    thumbnail_url: null,
    demo_url: "https://demo.example.com",
  },
  "ai-customer-service-sales": {
    id: "2",
    slug: "ai-customer-service-sales",
    title: "智能客服 (銷售版)",
    description: "專為銷售場景打造的 AI 客服系統，支援多輪對話、意圖識別、商品推薦、訂單查詢。整合 GPT-4 與知識庫 RAG。",
    long_description: `## 核心功能

- **多輪對話**: 自然流暢的對話體驗，理解上下文
- **意圖識別**: 精準識別用戶意圖，智能路由
- **商品推薦**: 基於對話內容的個性化推薦
- **訂單查詢**: 整合訂單系統，即時查詢狀態
- **知識庫 RAG**: 自動檢索產品資料回答問題

## 技術架構

- Next.js 14 + TypeScript 前端
- LangChain + GPT-4 對話引擎
- Pinecone / Qdrant 向量數據庫
- Supabase 後端服務
- WebSocket 即時通訊`,
    price: 299,
    category: "AI Agent",
    rating: 4.8,
    review_count: 156,
    download_count: 890,
    author_name: "SalesAI",
    author_avatar: null,
    thumbnail_url: null,
    demo_url: "https://demo.example.com",
  },
  "agentic-rag": {
    id: "3",
    slug: "agentic-rag",
    title: "Agentic RAG",
    description: "下一代智能檢索增強生成系統，結合多 Agent 協作、自動規劃、工具調用。支援多數據源整合與複雜問答場景。",
    long_description: `## 核心特色

- **多 Agent 協作**: 專業分工的 Agent 團隊，協同完成複雜任務
- **自動規劃**: 智能拆解問題，制定執行計劃
- **工具調用**: 支援網頁搜索、代碼執行、API 調用等工具
- **多數據源**: 整合文檔、數據庫、API 等多種數據源
- **引用溯源**: 回答附帶來源引用，可驗證可追溯`,
    price: 249,
    category: "RAG",
    rating: 4.9,
    review_count: 203,
    download_count: 1150,
    author_name: "AgenticLabs",
    author_avatar: null,
    thumbnail_url: null,
    demo_url: "https://demo.example.com",
  },
  "sora-veo-video-generator": {
    id: "4",
    slug: "sora-veo-video-generator",
    title: "無浮水印 Sora2/Veo3.1 視頻生成器",
    description: "整合 Sora 2 與 Veo 3.1 API 的視頻生成平台，無浮水印輸出、批量生成、風格控制。支援 4K 高清與多種比例。",
    long_description: `## 核心功能

- **雙引擎支援**: 整合 OpenAI Sora 2 與 Google Veo 3.1
- **無浮水印**: 乾淨輸出，可直接商用
- **批量生成**: 隊列管理，批量處理多個任務
- **風格控制**: 預設風格模板，自訂風格提示
- **多種比例**: 16:9、9:16、1:1 等多種輸出比例`,
    price: 399,
    category: "Video AI",
    rating: 4.7,
    review_count: 312,
    download_count: 2100,
    author_name: "VideoGenPro",
    author_avatar: null,
    thumbnail_url: null,
    demo_url: "https://demo.example.com",
  },
}

interface Project {
  id: string
  slug: string
  title: string
  description: string
  long_description: string | null
  price: number
  category: string
  rating: number | null
  review_count: number | null
  download_count: number | null
  author_name: string
  author_avatar: string | null
  thumbnail_url: string | null
  demo_url: string | null
}

const defaultFeatures = ["完整源代碼", "終身更新", "商業授權", "部署文檔", "技術支援"]

async function getProject(slug: string): Promise<Project | null> {
  try {
    const supabase = await createClient()

    const { data: project, error } = await supabase
      .from('projects')
      .select('*')
      .eq('slug', slug)
      .eq('status', 'approved')
      .single()

    if (error || !project) {
      // Try fallback data
      return fallbackProjects[slug] || null
    }

    // Generate thumbnail URL if missing but has demo URL
    if (!project.thumbnail_url && project.demo_url) {
      project.thumbnail_url = `https://api.microlink.io/?url=${encodeURIComponent(project.demo_url)}&screenshot=true&meta=false&embed=screenshot.url`
    }

    return project
  } catch (error) {
    console.error('Error fetching project:', error)
    return fallbackProjects[slug] || null
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const project = await getProject(slug)

  if (!project) {
    return { title: 'Project Not Found' }
  }

  return {
    title: `${project.title} | Quick Buyer`,
    description: project.description,
    openGraph: {
      title: project.title,
      description: project.description,
      type: 'website',
    },
  }
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const project = await getProject(slug)

  if (!project) {
    notFound()
  }

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": project.title,
    "description": project.description,
    "category": project.category,
    "url": `https://quick-buyer.com/projects/${project.slug}`,
    ...(project.thumbnail_url ? { "image": project.thumbnail_url } : {}),
    "brand": {
      "@type": "Brand",
      "name": project.author_name
    },
    "offers": {
      "@type": "Offer",
      "price": project.price,
      "priceCurrency": "USD",
      "availability": "https://schema.org/InStock",
      "seller": {
        "@type": "Organization",
        "@id": "https://quick-buyer.com/#organization"
      }
    },
    ...(project.rating != null ? {
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": project.rating,
        "reviewCount": project.review_count || 0,
        "bestRating": 5,
        "worstRating": 1
      }
    } : {})
  }

  return (
    <div className="min-h-screen flex flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      <Header />
      <main className="flex-1">
        <section className="py-12 md:py-20">
          <div className="container px-4 md:px-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-8">
                {/* Hero Image */}
                <div className="aspect-video bg-muted rounded-xl overflow-hidden">
                  {project.thumbnail_url ? (
                    <Image
                      src={project.thumbnail_url}
                      alt={project.title}
                      width={800}
                      height={450}
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-primary/5">
                      <Code2 className="h-20 w-20 text-primary/40" />
                    </div>
                  )}
                </div>

                {/* Title and Meta */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Badge>{project.category}</Badge>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium text-foreground">{project.rating || 0}</span>
                      <span>({project.review_count || 0} reviews)</span>
                    </div>
                  </div>
                  <h1 className="text-3xl md:text-4xl font-bold">{project.title}</h1>
                  <p className="text-lg text-muted-foreground">{project.description}</p>
                </div>

                {/* Description */}
                {project.long_description && (
                  <div className="prose prose-neutral dark:prose-invert max-w-none">
                    <div className="whitespace-pre-wrap text-muted-foreground">
                      {project.long_description}
                    </div>
                  </div>
                )}
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Purchase Card */}
                <Card className="sticky top-24">
                  <CardHeader>
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl font-bold">${project.price}</span>
                      <span className="text-muted-foreground">USD</span>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Features */}
                    <ul className="space-y-3">
                      {defaultFeatures.map((feature, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <Check className="h-5 w-5 text-green-600 dark:text-green-400" />
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    {/* CTA Buttons */}
                    <div className="space-y-3">
                      <Button size="lg" className="w-full">
                        <ShoppingCart className="mr-2 h-4 w-4" />
                        Add to Cart
                      </Button>
                      {project.demo_url && (
                        <Button size="lg" variant="outline" className="w-full" asChild>
                          <a href={project.demo_url} target="_blank" rel="noopener noreferrer">
                            <Eye className="mr-2 h-4 w-4" />
                            Live Demo
                          </a>
                        </Button>
                      )}
                    </div>

                    {/* Stats */}
                    <div className="pt-4 border-t">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Downloads</span>
                        <span className="font-medium">{(project.download_count || 0).toLocaleString()}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Author Card */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">About the Author</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                        {project.author_avatar ? (
                          <Image
                            src={project.author_avatar}
                            alt={project.author_name}
                            width={48}
                            height={48}
                            className="rounded-full"
                          />
                        ) : (
                          <span className="text-lg font-medium">
                            {project.author_name.charAt(0)}
                          </span>
                        )}
                      </div>
                      <div>
                        <p className="font-medium">{project.author_name}</p>
                        <p className="text-sm text-muted-foreground">Seller</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
