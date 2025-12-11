"use client"

import { Suspense, useEffect, useState, useCallback } from "react"
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

const categories = ["All", "AI Agent", "RAG", "LLM", "Video AI", "Image AI", "Voice AI"]

const sortOptions = [
  { value: "popular", label: "Most Popular" },
  { value: "newest", label: "Newest" },
  { value: "price_low", label: "Price: Low to High" },
  { value: "price_high", label: "Price: High to Low" },
  { value: "rating", label: "Highest Rated" },
]

function ProjectsContent() {
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

      setProjects(data.projects || [])
      setPagination(data.pagination || null)
    } catch (error) {
      console.error("Error fetching projects:", error)
      setProjects([])
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

function ProjectsLoading() {
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

export default function ProjectsPage() {
  return (
    <Suspense fallback={<ProjectsLoading />}>
      <ProjectsContent />
    </Suspense>
  )
}
