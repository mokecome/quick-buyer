import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { getLocale } from "next-intl/server"
import { CalendarDays, Clock, ArrowLeft } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { blogPosts, categoryColorMap, getPost, t } from "@/lib/blog-posts"

export function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const post = getPost(slug)
  if (!post) return { title: "Not Found" }

  const locale = await getLocale()
  const title = t(post.title, locale)
  const description = t(post.description, locale)
  return {
    title: `${title} | Quick Buyer Blog`,
    description,
    openGraph: { title, description, type: "article", publishedTime: post.date },
  }
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const post = getPost(slug)
  if (!post) notFound()

  const locale = await getLocale()
  const isZh = locale !== "en"

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: t(post.title, locale),
    description: t(post.description, locale),
    datePublished: post.date,
    url: `https://quick-buyer.com/blog/${post.slug}`,
    articleSection: t(post.category, locale),
    publisher: { "@id": "https://quick-buyer.com/#organization" },
  }

  return (
    <div className="min-h-screen flex flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <Header />
      <main className="flex-1 py-12">
        <div className="container px-4 md:px-6 max-w-3xl">
          {/* Back */}
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
          >
            <ArrowLeft className="h-4 w-4" />
            {isZh ? "返回部落格" : "Back to Blog"}
          </Link>

          {/* Header */}
          <div className="space-y-4 mb-10">
            <Badge variant="secondary" className={categoryColorMap[post.category.en]}>
              {t(post.category, locale)}
            </Badge>
            <h1 className="text-3xl md:text-4xl font-bold leading-tight">
              {t(post.title, locale)}
            </h1>
            <p className="text-lg text-muted-foreground">
              {t(post.description, locale)}
            </p>
            <div className="flex items-center gap-4 text-sm text-muted-foreground pt-2">
              <span className="flex items-center gap-1">
                <CalendarDays className="h-4 w-4" />
                {post.date}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {t(post.readTime, locale)}
              </span>
            </div>
          </div>

          <hr className="border-border/60 mb-10" />

          {/* Coming Soon */}
          <div className="rounded-xl border border-border/60 bg-muted/40 px-8 py-12 text-center space-y-3">
            <p className="text-xl font-semibold">
              {isZh ? "完整文章即將推出" : "Full Article Coming Soon"}
            </p>
            <p className="text-muted-foreground">
              {isZh
                ? "我們正在撰寫這篇文章，敬請期待！"
                : "We're working on this article. Stay tuned!"}
            </p>
            <Link
              href="/blog"
              className="inline-block mt-2 text-sm text-primary hover:underline"
            >
              {isZh ? "瀏覽其他文章 →" : "Browse other articles →"}
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
