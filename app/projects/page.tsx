"use client"

import { useEffect, useState, useCallback } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ProjectCard } from "@/components/project-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Search, Loader2, ChevronLeft, ChevronRight } from "lucide-react"
import { useTranslation } from "react-i18next"

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

interface Pagination {
  page: number
  limit: number
  totalCount: number
  totalPages: number
  hasNextPage: boolean
  hasPrevPage: boolean
}

// Fallback data in case database is not available
const fallbackProjects: Project[] = [
  {
    id: "1",
    slug: "agent-ppt-nano-banana",
    title: "Agent-PPT (Nano Banana)",
    description: "智能 PTT 爬蟲與分析 Agent，自動追蹤熱門話題、情緒分析、關鍵字監控。支援即時通知與數據視覺化儀表板。",
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
    description: "專為銷售場景打造的 AI 客服系統，支援多輪對話、意圖識別、商品推薦、訂單查詢。整合 GPT-4 與知識庫 RAG。",
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
    description: "下一代智能檢索增強生成系統，結合多 Agent 協作、自動規劃、工具調用。支援多數據源整合與複雜問答場景。",
    price: 249,
    category: "RAG",
    rating: 4.9,
    review_count: 203,
    author_name: "AgenticLabs",
  },
  {
    id: "4",
    slug: "sora-veo-video-generator",
    title: "無浮水印 Sora2/Veo3.1 視頻生成器",
    description: "整合 Sora 2 與 Veo 3.1 API 的視頻生成平台，無浮水印輸出、批量生成、風格控制。支援 4K 高清與多種比例。",
    price: 399,
    category: "Video AI",
    rating: 4.7,
    review_count: 312,
    author_name: "VideoGenPro",
  },
  {
    id: "5",
    slug: "chatgpt-saas-kit",
    title: "ChatGPT SaaS 完整套件",
    description: "基於 GPT-4 的完整 SaaS 解決方案，包含用戶認證、對話管理、Token 計費和管理後台。Next.js 14 + OpenAI API。",
    price: 179,
    category: "LLM",
    rating: 4.8,
    review_count: 245,
    author_name: "ChatSaaS",
  },
  {
    id: "6",
    slug: "ai-image-generation-platform",
    title: "AI 圖像生成平台",
    description: "整合 DALL-E 3、Stable Diffusion XL、Midjourney API 的圖像生成平台。支援文生圖、圖生圖、風格轉換、局部重繪。",
    price: 159,
    category: "Image AI",
    rating: 4.6,
    review_count: 178,
    author_name: "ImageGenAI",
  },
  {
    id: "7",
    slug: "voice-assistant-kit",
    title: "AI 語音助手套件",
    description: "結合 Whisper 語音識別、GPT-4 對話、TTS 語音合成的完整語音助手。支援多語言、即時轉錄、情感分析。",
    price: 189,
    category: "Voice AI",
    rating: 4.8,
    review_count: 92,
    author_name: "VoiceAI",
  },
  {
    id: "8",
    slug: "langchain-rag-template",
    title: "LangChain RAG 模板",
    description: "企業級 RAG 知識庫解決方案，支援 PDF、Word、網頁等多種格式。向量數據庫整合、智能問答、引用溯源。",
    price: 129,
    category: "RAG",
    rating: 4.7,
    review_count: 167,
    author_name: "LangChainPro",
  },
]

const categories = ["All", "AI Agent", "RAG", "LLM", "Video AI", "Image AI", "Voice AI"]

const sortOptions = [
  { value: "popular", label: "Most Popular" },
  { value: "newest", label: "Newest" },
  { value: "price_low", label: "Price: Low to High" },
  { value: "price_high", label: "Price: High to Low" },
  { value: "rating", label: "Highest Rated" },
]

export default function ProjectsPage() {
  const { t } = useTranslation()
  const router = useRouter()
  const searchParams = useSearchParams()

  // State
  const [projects, setProjects] = useState<Project[]>([])
  const [pagination, setPagination] = useState<Pagination | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [searchInput, setSearchInput] = useState("")

  // Get current filter values from URL
  const currentPage = parseInt(searchParams.get("page") || "1", 10)
  const currentCategory = searchParams.get("category") || "All"
  const currentSort = searchParams.get("sort") || "popular"
  const currentSearch = searchParams.get("q") || ""

  // Fetch projects
  const fetchProjects = useCallback(async () => {
    setIsLoading(true)
    try {
      const params = new URLSearchParams()
      params.set("page", currentPage.toString())
      params.set("limit", "12")
      if (currentCategory !== "All") params.set("category", currentCategory)
      if (currentSort) params.set("sort", currentSort)
      if (currentSearch) params.set("search", currentSearch)

      const response = await fetch(`/api/projects?${params.toString()}`)
      const data = await response.json()

      if (data.projects && data.projects.length > 0) {
        setProjects(data.projects)
        setPagination(data.pagination)
      } else {
        setProjects(fallbackProjects)
        setPagination(null)
      }
    } catch (error) {
      console.error("Error fetching projects:", error)
      setProjects(fallbackProjects)
      setPagination(null)
    } finally {
      setIsLoading(false)
    }
  }, [currentPage, currentCategory, currentSort, currentSearch])

  useEffect(() => {
    fetchProjects()
  }, [fetchProjects])

  // Initialize search input from URL
  useEffect(() => {
    setSearchInput(currentSearch)
  }, [currentSearch])

  // Update URL with new params
  const updateParams = (updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString())

    Object.entries(updates).forEach(([key, value]) => {
      if (value === null || value === "" || value === "All") {
        params.delete(key)
      } else {
        params.set(key, value)
      }
    })

    // Reset to page 1 when filters change (except when changing page)
    if (!("page" in updates)) {
      params.delete("page")
    }

    router.push(`/projects?${params.toString()}`)
  }

  // Handle search submit
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    updateParams({ q: searchInput })
  }

  // Handle category change
  const handleCategoryChange = (category: string) => {
    updateParams({ category })
  }

  // Handle sort change
  const handleSortChange = (sort: string) => {
    updateParams({ sort })
  }

  // Handle page change
  const handlePageChange = (page: number) => {
    updateParams({ page: page.toString() })
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <section className="py-12 md:py-20">
          <div className="container px-4 md:px-6">
            {/* Page Header */}
            <div className="text-center space-y-4 mb-12">
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
                {t("projects.title", "Browse Projects")}
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                {t("projects.subtitle", "Discover production-ready code projects from talented developers worldwide")}
              </p>
            </div>

            {/* Search and Filters */}
            <div className="flex flex-col gap-4 mb-8">
              {/* Search Bar */}
              <form onSubmit={handleSearch} className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder={t("projects.searchPlaceholder", "Search projects...")}
                    className="pl-10"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                  />
                </div>
                <Button type="submit">
                  {t("projects.search", "Search")}
                </Button>
              </form>

              {/* Filters Row */}
              <div className="flex flex-col sm:flex-row gap-4 justify-between">
                {/* Category Filters */}
                <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0">
                  {categories.map((category) => (
                    <Button
                      key={category}
                      variant={currentCategory === category ? "default" : "outline"}
                      size="sm"
                      className="whitespace-nowrap"
                      onClick={() => handleCategoryChange(category)}
                    >
                      {category}
                    </Button>
                  ))}
                </div>

                {/* Sort Dropdown */}
                <Select value={currentSort} onValueChange={handleSortChange}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder={t("projects.sortBy", "Sort by")} />
                  </SelectTrigger>
                  <SelectContent>
                    {sortOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {t(`projects.sort.${option.value}`, option.label)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Results Count */}
            {pagination && (
              <div className="text-sm text-muted-foreground mb-6">
                {t("projects.showing", "Showing")} {projects.length} {t("projects.of", "of")} {pagination.totalCount} {t("projects.results", "results")}
                {currentSearch && (
                  <span> {t("projects.for", "for")} &quot;{currentSearch}&quot;</span>
                )}
              </div>
            )}

            {/* Loading State */}
            {isLoading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : projects.length === 0 ? (
              /* Empty State */
              <div className="text-center py-20">
                <p className="text-lg text-muted-foreground">
                  {t("projects.noResults", "No projects found matching your criteria.")}
                </p>
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => {
                    setSearchInput("")
                    router.push("/projects")
                  }}
                >
                  {t("projects.clearFilters", "Clear Filters")}
                </Button>
              </div>
            ) : (
              <>
                {/* Projects Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {projects.map((project) => (
                    <ProjectCard
                      key={project.id}
                      id={project.id}
                      slug={project.slug}
                      title={project.title}
                      description={project.description}
                      price={project.price}
                      category={project.category}
                      rating={project.rating || 0}
                      reviewCount={project.review_count || 0}
                      author={{ name: project.author_name }}
                    />
                  ))}
                </div>

                {/* Pagination */}
                {pagination && pagination.totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-12">
                    <Button
                      variant="outline"
                      size="icon"
                      disabled={!pagination.hasPrevPage}
                      onClick={() => handlePageChange(currentPage - 1)}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>

                    {/* Page Numbers */}
                    <div className="flex gap-1">
                      {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
                        .filter((page) => {
                          // Show first, last, current, and adjacent pages
                          return (
                            page === 1 ||
                            page === pagination.totalPages ||
                            Math.abs(page - currentPage) <= 1
                          )
                        })
                        .map((page, index, array) => {
                          // Add ellipsis
                          const prevPage = array[index - 1]
                          const showEllipsis = prevPage && page - prevPage > 1

                          return (
                            <div key={page} className="flex items-center gap-1">
                              {showEllipsis && (
                                <span className="px-2 text-muted-foreground">...</span>
                              )}
                              <Button
                                variant={page === currentPage ? "default" : "outline"}
                                size="icon"
                                onClick={() => handlePageChange(page)}
                              >
                                {page}
                              </Button>
                            </div>
                          )
                        })}
                    </div>

                    <Button
                      variant="outline"
                      size="icon"
                      disabled={!pagination.hasNextPage}
                      onClick={() => handlePageChange(currentPage + 1)}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
