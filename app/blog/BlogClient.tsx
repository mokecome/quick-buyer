"use client"

import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { useLocale } from "next-intl"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CalendarDays, Clock } from "lucide-react"
import { blogPosts, categoryColorMap, t } from "@/lib/blog-posts"

export default function BlogClient() {
  const locale = useLocale()
  const isZh = locale !== 'en'

  const blogSchema = {
    "@context": "https://schema.org",
    "@type": "Blog",
    "@id": "https://quick-buyer.com/blog#blog",
    "url": "https://quick-buyer.com/blog",
    "name": isZh ? "Quick Buyer 部落格" : "Quick Buyer Blog",
    "description": isZh
      ? "AI 開發技巧、行業趨勢和最佳實踐"
      : "AI development tips, industry trends, and best practices",
    "publisher": {
      "@id": "https://quick-buyer.com/#organization"
    }
  }

  const blogItemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": isZh ? "Quick Buyer 部落格文章列表" : "Quick Buyer Blog Posts",
    "url": "https://quick-buyer.com/blog",
    "numberOfItems": blogPosts.length,
    "itemListElement": blogPosts.map((post, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "url": `https://quick-buyer.com/blog/${post.slug}`,
      "name": t(post.title, locale),
      "item": {
        "@type": "BlogPosting",
        "headline": t(post.title, locale),
        "description": t(post.description, locale),
        "url": `https://quick-buyer.com/blog/${post.slug}`,
        "datePublished": post.date,
        "articleSection": t(post.category, locale),
        "publisher": {
          "@id": "https://quick-buyer.com/#organization"
        }
      }
    }))
  }

  return (
    <div className="min-h-screen flex flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogItemListSchema) }}
      />
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
            {blogPosts.map((post) => {
              const category = t(post.category, locale)
              return (
                <Link key={post.slug} href={`/blog/${post.slug}`} className="block group">
                  <Card className="h-full hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="secondary" className={categoryColorMap[post.category.en]}>
                          {category}
                        </Badge>
                      </div>
                      <CardTitle className="line-clamp-2 group-hover:text-primary transition-colors">
                        {t(post.title, locale)}
                      </CardTitle>
                      <CardDescription className="line-clamp-3">
                        {t(post.description, locale)}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <CalendarDays className="h-4 w-4" />
                          {post.date}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {t(post.readTime, locale)}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              )
            })}
          </div>

          {/* Coming Soon Notice */}
          <div className="mt-12 text-center">
            <p className="text-muted-foreground">
              {isZh ? "更多精彩內容即將推出，敬請期待！" : "More exciting content coming soon, stay tuned!"}
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
