"use client"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

const faqs = [
  {
    question: "購買 AI 項目後我會獲得什麼？",
    answer: "您將獲得完整的源代碼、詳細的文檔、模型文件（如適用）以及所有相關資源。所有項目均附帶商業授權，允許您在無限個人和商業項目中使用。",
  },
  {
    question: "購買後是否包含更新？",
    answer: "是的！所有購買均包含終身更新。當賣家發布新版本時，您可以從儀表板免費下載。這對於快速迭代的 AI 領域尤為重要。",
  },
  {
    question: "可以申請退款嗎？",
    answer: "我們提供 14 天無條件退款保證。如果您對購買不滿意，請聯繫我們的支援團隊，我們將為您處理退款。",
  },
  {
    question: "支付方式有哪些？",
    answer: "所有支付均通過我們的支付合作夥伴 Creem 安全處理。我們支持所有主要信用卡、PayPal 以及多種本地支付方式。",
  },
  {
    question: "我可以在 Quick Buyer 上架自己的 AI 項目嗎？",
    answer: "當然可以！註冊賣家帳戶並提交您的 AI 項目進行審核。審核通過後，您就可以開始向我們的 AI 開發者社區銷售。",
  },
  {
    question: "這裡有哪些類型的 AI 項目？",
    answer: "我們提供豐富的 AI 項目類型，包括：LLM 應用（ChatGPT 克隆、RAG 系統）、圖像生成、語音識別、NLP 工具、機器學習模板、AI Agent 框架等。",
  },
]

export function FAQ() {
  return (
    <section id="faq" className="py-20 md:py-32">
      <div className="container px-4 md:px-6 max-w-3xl mx-auto">
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
            常見問題
          </h2>
          <p className="text-lg text-muted-foreground">
            關於 Quick Buyer AI 市集您需要知道的一切
          </p>
        </div>

        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className="text-left">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  )
}
