import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ProjectCard } from "@/components/project-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Filter } from "lucide-react"

// Mock data for projects
const projects = [
  {
    id: "1",
    slug: "nextjs-saas-starter",
    title: "Next.js SaaS Starter Kit",
    description: "Complete SaaS boilerplate with auth, payments, and dashboard. Built with Next.js 14, Tailwind, and Stripe.",
    price: 149,
    category: "SaaS",
    rating: 4.9,
    reviewCount: 128,
    author: { name: "DevStudio" },
  },
  {
    id: "2",
    slug: "react-admin-dashboard",
    title: "React Admin Dashboard",
    description: "Beautiful admin panel with charts, tables, and forms. Fully responsive and customizable.",
    price: 79,
    category: "Template",
    rating: 4.7,
    reviewCount: 89,
    author: { name: "UILabs" },
  },
  {
    id: "3",
    slug: "api-boilerplate",
    title: "Node.js API Boilerplate",
    description: "Production-ready REST API with authentication, validation, and documentation. TypeScript + Express.",
    price: 59,
    category: "Backend",
    rating: 4.8,
    reviewCount: 56,
    author: { name: "BackendPro" },
  },
  {
    id: "4",
    slug: "mobile-app-template",
    title: "React Native App Template",
    description: "Cross-platform mobile app starter with navigation, state management, and UI components.",
    price: 99,
    category: "Mobile",
    rating: 4.6,
    reviewCount: 42,
    author: { name: "MobileFirst" },
  },
  {
    id: "5",
    slug: "ecommerce-template",
    title: "E-commerce Store Template",
    description: "Full-featured online store with product pages, cart, checkout, and admin panel.",
    price: 129,
    category: "E-commerce",
    rating: 4.8,
    reviewCount: 73,
    author: { name: "ShopifyDev" },
  },
  {
    id: "6",
    slug: "landing-page-kit",
    title: "Landing Page Kit",
    description: "Collection of 20+ landing page templates with animations and responsive design.",
    price: 49,
    category: "Template",
    rating: 4.5,
    reviewCount: 156,
    author: { name: "LandingPro" },
  },
  {
    id: "7",
    slug: "ai-chatbot-template",
    title: "AI Chatbot Template",
    description: "Ready-to-deploy AI chatbot with OpenAI integration. Includes streaming and conversation history.",
    price: 89,
    category: "AI",
    rating: 4.9,
    reviewCount: 34,
    author: { name: "AIBuilders" },
  },
  {
    id: "8",
    slug: "blog-starter",
    title: "Blog Starter Kit",
    description: "Modern blog template with MDX support, syntax highlighting, and SEO optimization.",
    price: 39,
    category: "Template",
    rating: 4.6,
    reviewCount: 91,
    author: { name: "ContentDev" },
  },
]

const categories = ["All", "SaaS", "Template", "Backend", "Mobile", "E-commerce", "AI"]

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
