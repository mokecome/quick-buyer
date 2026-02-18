import { Header } from "@/components/header"
import { Hero } from "@/components/hero"
import { BrowserDeploy } from "@/components/browser-deploy"
import { Features } from "@/components/features"
import { FeaturedProjects } from "@/components/featured-projects"
import { FAQ } from "@/components/faq"
import { Footer } from "@/components/footer"

const organizationWebsiteSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://quick-buyer.com/#organization",
      "name": "Quick Buyer",
      "url": "https://quick-buyer.com",
      "description": "AI-focused marketplace for production-ready AI templates, ML tools, LLM apps, and intelligent automation solutions.",
      "contactPoint": {
        "@type": "ContactPoint",
        "email": "supports@quick-buyer.com",
        "contactType": "customer service"
      }
    },
    {
      "@type": "WebSite",
      "@id": "https://quick-buyer.com/#website",
      "url": "https://quick-buyer.com",
      "name": "Quick Buyer",
      "publisher": { "@id": "https://quick-buyer.com/#organization" },
      "potentialAction": {
        "@type": "SearchAction",
        "target": {
          "@type": "EntryPoint",
          "urlTemplate": "https://quick-buyer.com/projects?q={search_term_string}"
        },
        "query-input": "required name=search_term_string"
      }
    }
  ]
}

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What do I get when I purchase an AI project?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "You'll receive complete source code, detailed documentation, model files (if applicable), and all related resources. All projects include a commercial license allowing unlimited personal and commercial use."
      }
    },
    {
      "@type": "Question",
      "name": "Are updates included after purchase?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes! All purchases include lifetime updates. When sellers release new versions, you can download them free from your dashboard. This is especially important in the fast-evolving AI field."
      }
    },
    {
      "@type": "Question",
      "name": "Can I get a refund?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "We offer a 14-day money-back guarantee. If you're not satisfied with your purchase, contact our support team and we'll process your refund."
      }
    },
    {
      "@type": "Question",
      "name": "What payment methods are available?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "All payments are securely processed through our payment partner Creem. We support all major credit cards, PayPal, and various local payment methods."
      }
    },
    {
      "@type": "Question",
      "name": "Can I sell my own AI projects on Quick Buyer?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Absolutely! Register for a seller account and submit your AI projects for review. Once approved, you can start selling to our AI developer community."
      }
    },
    {
      "@type": "Question",
      "name": "What types of AI projects are available here?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "We offer a rich variety of AI project types including: LLM applications (ChatGPT clones, RAG systems), image generation, speech recognition, NLP tools, machine learning templates, AI Agent frameworks, and more."
      }
    }
  ]
}

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationWebsiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
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
