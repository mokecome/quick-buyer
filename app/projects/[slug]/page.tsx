import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, ShoppingCart, Download, Check, Eye, Code2 } from "lucide-react"
import Image from "next/image"

// Mock project data - in production, fetch from Supabase
const projectData = {
  id: "1",
  slug: "nextjs-saas-starter",
  title: "Next.js SaaS Starter Kit",
  description: "Complete SaaS boilerplate with authentication, payments, and dashboard. Built with Next.js 14, Tailwind CSS, and Stripe integration. Perfect for launching your next SaaS product quickly.",
  longDescription: `
## What's Included

- **Authentication**: Email/password, OAuth (Google, GitHub), Magic Links
- **Payments**: Stripe integration with subscription management
- **Dashboard**: Beautiful admin dashboard with charts and tables
- **Database**: Prisma ORM with PostgreSQL support
- **Email**: Transactional emails with Resend
- **UI Components**: 50+ pre-built components with shadcn/ui

## Tech Stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Prisma ORM
- Stripe
- NextAuth.js

## Features

- Multi-tenant architecture
- Role-based access control
- API rate limiting
- SEO optimized
- Dark mode support
- Responsive design
  `,
  price: 149,
  category: "SaaS",
  tags: ["Next.js", "React", "TypeScript", "Tailwind", "Stripe"],
  rating: 4.9,
  reviewCount: 128,
  downloads: 1250,
  author: {
    name: "DevStudio",
    avatar: null,
  },
  thumbnail: null,
  images: [],
  demoUrl: "https://demo.example.com",
  features: [
    "Full source code",
    "Lifetime updates",
    "Commercial license",
    "Documentation",
    "Support",
  ],
}

export default function ProjectDetailPage({
  params,
}: {
  params: { slug: string }
}) {
  const project = projectData // In production, fetch by slug

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <section className="py-12 md:py-20">
          <div className="container px-4 md:px-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-8">
                {/* Hero Image */}
                <div className="aspect-video bg-muted rounded-xl overflow-hidden">
                  {project.thumbnail ? (
                    <Image
                      src={project.thumbnail}
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
                      <span className="font-medium text-foreground">{project.rating}</span>
                      <span>({project.reviewCount} reviews)</span>
                    </div>
                  </div>
                  <h1 className="text-3xl md:text-4xl font-bold">{project.title}</h1>
                  <p className="text-lg text-muted-foreground">{project.description}</p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                      <Badge key={tag} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Description */}
                <div className="prose prose-neutral dark:prose-invert max-w-none">
                  <div className="whitespace-pre-wrap text-muted-foreground">
                    {project.longDescription}
                  </div>
                </div>
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
                      {project.features.map((feature, index) => (
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
                      {project.demoUrl && (
                        <Button size="lg" variant="outline" className="w-full" asChild>
                          <a href={project.demoUrl} target="_blank" rel="noopener noreferrer">
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
                        <span className="font-medium">{project.downloads.toLocaleString()}</span>
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
                        {project.author.avatar ? (
                          <Image
                            src={project.author.avatar}
                            alt={project.author.name}
                            width={48}
                            height={48}
                            className="rounded-full"
                          />
                        ) : (
                          <span className="text-lg font-medium">
                            {project.author.name.charAt(0)}
                          </span>
                        )}
                      </div>
                      <div>
                        <p className="font-medium">{project.author.name}</p>
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
