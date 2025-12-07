"use client"

import { ProjectCard } from "@/components/project-card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { useTranslation } from "react-i18next"

// Mock data for featured AI projects
const featuredProjects = [
  {
    id: "1",
    slug: "chatgpt-saas-kit",
    titleKey: "featuredProjects.projects.chatgpt.title",
    descriptionKey: "featuredProjects.projects.chatgpt.description",
    price: 199,
    category: "LLM",
    rating: 4.9,
    reviewCount: 156,
    author: { name: "AI Studio" },
  },
  {
    id: "2",
    slug: "ai-image-generator",
    titleKey: "featuredProjects.projects.imageGen.title",
    descriptionKey: "featuredProjects.projects.imageGen.description",
    price: 149,
    category: "Image AI",
    rating: 4.8,
    reviewCount: 98,
    author: { name: "VisionLabs" },
  },
  {
    id: "3",
    slug: "langchain-rag-template",
    titleKey: "featuredProjects.projects.rag.title",
    descriptionKey: "featuredProjects.projects.rag.description",
    price: 129,
    category: "RAG",
    rating: 4.9,
    reviewCount: 87,
    author: { name: "LangAI" },
  },
  {
    id: "4",
    slug: "ai-voice-assistant",
    titleKey: "featuredProjects.projects.voice.title",
    descriptionKey: "featuredProjects.projects.voice.description",
    price: 169,
    category: "Voice AI",
    rating: 4.7,
    reviewCount: 63,
    author: { name: "VoiceTech" },
  },
]

export function FeaturedProjects() {
  const { t } = useTranslation()

  return (
    <section className="py-20 md:py-32">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12">
          <div className="space-y-2">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
              {t('featuredProjects.title')}
            </h2>
            <p className="text-lg text-muted-foreground">
              {t('featuredProjects.subtitle')}
            </p>
          </div>
          <Button variant="outline" asChild>
            <Link href="/projects">
              {t('featuredProjects.viewAll')}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProjects.map((project) => (
            <ProjectCard
              key={project.id}
              id={project.id}
              slug={project.slug}
              title={t(project.titleKey)}
              description={t(project.descriptionKey)}
              price={project.price}
              category={project.category}
              rating={project.rating}
              reviewCount={project.reviewCount}
              author={project.author}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
