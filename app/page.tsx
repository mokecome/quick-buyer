import { Header } from "@/components/header"
import { Hero } from "@/components/hero"
import { BrowserDeploy } from "@/components/browser-deploy"
import { Features } from "@/components/features"
import { FeaturedProjects } from "@/components/featured-projects"
import { FAQ } from "@/components/faq"
import { Footer } from "@/components/footer"

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Hero />
        <BrowserDeploy />
        <FeaturedProjects />
        <Features />
        <FAQ />
      </main>
      <Footer />
    </div>
  )
}
