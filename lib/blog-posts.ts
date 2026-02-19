export type Locale = 'en' | 'zh' | 'ch'

interface LocaleString {
  en: string
  zh: string
  ch: string
}

export interface BlogPost {
  slug: string
  title: LocaleString
  description: LocaleString
  date: string
  readTime: LocaleString
  category: LocaleString
}

export const blogPosts: BlogPost[] = [
  {
    slug: "getting-started-with-ai-development",
    title: {
      en: "Getting Started with AI Development: Build Your First AI App",
      zh: "AI 開發入門指南：從零開始構建你的第一個 AI 應用",
      ch: "AI 开发入门指南：从零开始构建你的第一个 AI 应用",
    },
    description: {
      en: "This guide covers AI development basics, including choosing the right framework, setting up your environment, and building a simple AI application.",
      zh: "本文將帶你了解 AI 開發的基礎知識，包括選擇合適的框架、設置開發環境，以及構建一個簡單的 AI 應用。",
      ch: "本文将带你了解 AI 开发的基础知识，包括选择合适的框架、设置开发环境，以及构建一个简单的 AI 应用。",
    },
    date: "2024-12-15",
    readTime: { en: "8 min read", zh: "8 分鐘", ch: "8 分钟" },
    category: { en: "Tutorial", zh: "教學", ch: "教学" },
  },
  {
    slug: "top-ai-trends-2024",
    title: {
      en: "Top AI Trends 2024: 5 Directions Every Developer Should Know",
      zh: "2024 年 AI 技術趨勢：開發者必須知道的 5 個方向",
      ch: "2024 年 AI 技术趋势：开发者必须知道的 5 个方向",
    },
    description: {
      en: "From large language models to multimodal AI, discover the most important AI trends of 2024 and how to apply them to your projects.",
      zh: "從大型語言模型到多模態 AI，了解 2024 年最重要的 AI 技術趨勢，以及如何將它們應用到你的項目中。",
      ch: "从大型语言模型到多模态 AI，了解 2024 年最重要的 AI 技术趋势，以及如何将它们应用到你的项目中。",
    },
    date: "2024-12-10",
    readTime: { en: "6 min read", zh: "6 分鐘", ch: "6 分钟" },
    category: { en: "Trends", zh: "趨勢", ch: "趋势" },
  },
  {
    slug: "chatgpt-api-best-practices",
    title: {
      en: "ChatGPT API Best Practices: Building High-Performance AI Apps",
      zh: "ChatGPT API 最佳實踐：打造高效能 AI 應用",
      ch: "ChatGPT API 最佳实践：打造高效能 AI 应用",
    },
    description: {
      en: "Deep dive into effectively using the ChatGPT API, including prompt engineering, error handling, and cost optimization techniques.",
      zh: "深入了解如何有效使用 ChatGPT API，包括提示工程、錯誤處理、成本優化等關鍵技巧。",
      ch: "深入了解如何有效使用 ChatGPT API，包括提示工程、错误处理、成本优化等关键技巧。",
    },
    date: "2024-12-05",
    readTime: { en: "10 min read", zh: "10 分鐘", ch: "10 分钟" },
    category: { en: "Technical", zh: "技術", ch: "技术" },
  },
  {
    slug: "monetize-your-ai-projects",
    title: {
      en: "How to Monetize Your AI Projects: A Complete Guide",
      zh: "如何將你的 AI 項目變現：完整指南",
      ch: "如何将你的 AI 项目变现：完整指南",
    },
    description: {
      en: "Explore various ways to commercialize AI projects, from SaaS models to marketplace sales, and find the best monetization strategy for you.",
      zh: "了解將 AI 項目商業化的各種方式，從 SaaS 模式到市集銷售，找到最適合你的變現策略。",
      ch: "了解将 AI 项目商业化的各种方式，从 SaaS 模式到市集销售，找到最适合你的变现策略。",
    },
    date: "2024-11-28",
    readTime: { en: "7 min read", zh: "7 分鐘", ch: "7 分钟" },
    category: { en: "Business", zh: "商業", ch: "商业" },
  },
  {
    slug: "rag-system-tutorial",
    title: {
      en: "RAG System Tutorial: Building Enterprise Knowledge Bases",
      zh: "RAG 系統實戰教學：構建企業級知識庫",
      ch: "RAG 系统实战教学：构建企业级知识库",
    },
    description: {
      en: "Step-by-step guide to building a production-ready RAG system using LangChain and vector databases for intelligent document Q&A.",
      zh: "手把手教你使用 LangChain 和向量數據庫構建一個生產就緒的 RAG 系統，實現智能文檔問答。",
      ch: "手把手教你使用 LangChain 和向量数据库构建一个生产就绪的 RAG 系统，实现智能文档问答。",
    },
    date: "2024-11-20",
    readTime: { en: "12 min read", zh: "12 分鐘", ch: "12 分钟" },
    category: { en: "Tutorial", zh: "教學", ch: "教学" },
  },
  {
    slug: "ai-image-generation-guide",
    title: {
      en: "Complete Guide to AI Image Generation: From DALL-E to Stable Diffusion",
      zh: "AI 圖像生成完全指南：從 DALL-E 到 Stable Diffusion",
      ch: "AI 图像生成完全指南：从 DALL-E 到 Stable Diffusion",
    },
    description: {
      en: "Compare different AI image generation models, understand their pros and cons, and learn how to integrate them into your applications.",
      zh: "比較不同的 AI 圖像生成模型，了解它們的優缺點，以及如何在你的應用中整合它們。",
      ch: "比较不同的 AI 图像生成模型，了解它们的优缺点，以及如何在你的应用中整合它们。",
    },
    date: "2024-11-15",
    readTime: { en: "9 min read", zh: "9 分鐘", ch: "9 分钟" },
    category: { en: "Technical", zh: "技術", ch: "技术" },
  },
]

export function getPost(slug: string): BlogPost | undefined {
  return blogPosts.find(p => p.slug === slug)
}

export const categoryColorMap: Record<string, string> = {
  Tutorial: "bg-blue-500/10 text-blue-500",
  Trends: "bg-purple-500/10 text-purple-500",
  Technical: "bg-green-500/10 text-green-500",
  Business: "bg-orange-500/10 text-orange-500",
}

export function t(obj: LocaleString, locale: string): string {
  return (obj as unknown as Record<string, string>)[locale] ?? obj.en
}
