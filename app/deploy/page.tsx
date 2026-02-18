"use client"

import { Suspense, useEffect, useState, useCallback } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Search, Loader2, ChevronLeft, ChevronRight, Upload, Globe, ExternalLink, Eye } from "lucide-react"
import { useTranslations } from "next-intl"

interface StaticSite {
  id: string
  cid: string
  filename: string
  url: string
  size: number
  created_at: string
  user_id: string
  preview_image?: string
  title?: string
  description?: string
}

// Fallback demo sites
const demoSites: StaticSite[] = [
  {
    id: "demo-1",
    cid: "QmDemo1...",
    filename: "portfolio-site",
    url: "https://ipfs.glitterprotocol.dev/ipfs/QmDemo1",
    size: 1024000,
    created_at: new Date().toISOString(),
    user_id: "demo",
    title: "個人作品集網站",
    description: "使用 HTML、CSS、JavaScript 製作的現代化個人作品集網站模板",
  },
  {
    id: "demo-2",
    cid: "QmDemo2...",
    filename: "landing-page",
    url: "https://ipfs.glitterprotocol.dev/ipfs/QmDemo2",
    size: 512000,
    created_at: new Date().toISOString(),
    user_id: "demo",
    title: "產品著陸頁",
    description: "響應式產品著陸頁模板，包含動畫效果和表單整合",
  },
  {
    id: "demo-3",
    cid: "QmDemo3...",
    filename: "blog-template",
    url: "https://ipfs.glitterprotocol.dev/ipfs/QmDemo3",
    size: 768000,
    created_at: new Date().toISOString(),
    user_id: "demo",
    title: "極簡部落格模板",
    description: "乾淨簡潔的部落格設計，支援 Markdown 和程式碼高亮",
  },
  {
    id: "demo-4",
    cid: "QmDemo4...",
    filename: "dashboard-ui",
    url: "https://ipfs.glitterprotocol.dev/ipfs/QmDemo4",
    size: 2048000,
    created_at: new Date().toISOString(),
    user_id: "demo",
    title: "管理後台 UI 套件",
    description: "完整的管理後台介面元件庫，包含圖表、表格、表單等",
  },
]

const categories = ["All", "Portfolio", "Landing Page", "Blog", "Dashboard", "E-commerce", "Documentation"]

const sortOptions = [
  { value: "newest", label: "Newest" },
  { value: "popular", label: "Most Popular" },
  { value: "size_small", label: "Size: Small to Large" },
  { value: "size_large", label: "Size: Large to Small" },
]

function StaticSiteCard({ site }: { site: StaticSite }) {
  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  return (
    <Card className="group overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      {/* Preview Image */}
      <div className="aspect-video bg-gradient-to-br from-primary/5 to-primary/10 relative overflow-hidden">
        {site.preview_image ? (
          <img
            src={site.preview_image}
            alt={site.title || site.filename}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Globe className="h-12 w-12 text-primary/30" />
          </div>
        )}
        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
          <a
            href={site.url}
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
          >
            <Eye className="h-5 w-5 text-white" />
          </a>
          <a
            href={site.url}
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
          >
            <ExternalLink className="h-5 w-5 text-white" />
          </a>
        </div>
      </div>

      <CardContent className="p-4">
        <h3 className="font-semibold text-lg mb-1 line-clamp-1">
          {site.title || site.filename}
        </h3>
        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
          {site.description || "靜態網站"}
        </p>
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>{formatSize(site.size)}</span>
          <span className="flex items-center gap-1">
            <Globe className="h-3 w-3" />
            IPFS
          </span>
        </div>
      </CardContent>
    </Card>
  )
}

function DeployContent() {
  const t = useTranslations()
  const router = useRouter()
  const searchParams = useSearchParams()

  // State
  const [sites, setSites] = useState<StaticSite[]>(demoSites)
  const [isLoading, setIsLoading] = useState(false)
  const [searchInput, setSearchInput] = useState("")

  // Get current filter values from URL
  const currentCategory = searchParams.get("category") || "All"
  const currentSort = searchParams.get("sort") || "newest"
  const currentSearch = searchParams.get("q") || ""

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

    router.push(`/deploy?${params.toString()}`)
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

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <section className="py-12 md:py-20">
          <div className="container px-4 md:px-6">
            {/* Page Header */}
            <div className="text-center space-y-4 mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 text-emerald-600 text-sm font-medium mb-4">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                {t("deploy.badge")}
              </div>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                {t("deploy.pageSubtitle")}
              </p>

              {/* Upload CTA */}
              <div className="pt-4">
                <Button size="lg" asChild>
                  <Link href="/deploy/upload">
                    <Upload className="mr-2 h-5 w-5" />
                    {t("deploy.uploadYours")}
                  </Link>
                </Button>
              </div>
            </div>

            {/* Search and Filters */}
            <div className="flex flex-col gap-4 mb-8">
              {/* Search Bar */}
              <form onSubmit={handleSearch} className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder={t("deploy.searchPlaceholder")}
                    className="pl-10"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                  />
                </div>
                <Button type="submit">
                  {t("common.search")}
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
                    <SelectValue placeholder={t("common.sortBy")} />
                  </SelectTrigger>
                  <SelectContent>
                    {sortOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Results */}
            {isLoading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : sites.length === 0 ? (
              /* Empty State */
              <div className="text-center py-20">
                <Globe className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
                <p className="text-lg text-muted-foreground mb-4">
                  {t("deploy.noResults")}
                </p>
                <Button asChild>
                  <Link href="/deploy/upload">
                    <Upload className="mr-2 h-4 w-4" />
                    {t("deploy.beFirst")}
                  </Link>
                </Button>
              </div>
            ) : (
              /* Sites Grid */
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {sites.map((site) => (
                  <StaticSiteCard key={site.id} site={site} />
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}

function DeployLoading() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <section className="py-12 md:py-20">
          <div className="container px-4 md:px-6">
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}

export default function DeployPage() {
  return (
    <Suspense fallback={<DeployLoading />}>
      <DeployContent />
    </Suspense>
  )
}
