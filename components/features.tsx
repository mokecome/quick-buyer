import { Bot, Zap, Shield, Brain, Cpu, Sparkles } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const features = [
  {
    icon: Brain,
    title: "優質 AI 模型與工具",
    description: "所有項目均經過審核驗證。獲取生產就緒的 AI 解決方案，包括 LLM、計算機視覺、NLP 等。",
  },
  {
    icon: Zap,
    title: "即時部署",
    description: "購買後立即下載使用。附帶完整文檔和部署指南，快速整合到您的項目中。",
  },
  {
    icon: Shield,
    title: "安全可靠",
    description: "所有交易通過安全支付處理。您的數據和 AI 模型受到完善保護。",
  },
  {
    icon: Cpu,
    title: "多元 AI 類別",
    description: "涵蓋 ChatGPT 應用、圖像生成、語音識別、自動化機器人等熱門 AI 領域。",
  },
  {
    icon: Bot,
    title: "AI 開發者友好",
    description: "低手續費、快速結算。專注於打造優秀的 AI 產品，其他交給我們處理。",
  },
  {
    icon: Sparkles,
    title: "持續更新",
    description: "一次購買，終身訪問。AI 領域快速迭代，您將獲得所有未來更新。",
  },
]

export function Features() {
  return (
    <section id="features" className="py-20 md:py-32 bg-muted/30">
      <div className="container px-4 md:px-6">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
            為什麼選擇 Quick Buyer？
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            專注於 AI 項目的優質市集。
            由 AI 開發者打造，為 AI 開發者服務。
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="bg-background hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
