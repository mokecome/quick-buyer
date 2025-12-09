import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { ThemeProvider } from "@/components/theme-provider"
import { I18nProvider } from "@/components/i18n-provider"
import { CartProvider } from "@/lib/cart-context"
import { SubscriptionProvider } from "@/lib/subscription-context"
import "@/styles/globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Quick Buyer - AI 項目市集",
  description:
    "專注於 AI 的交易市集。發現生產就緒的 AI 模板、機器學習工具、LLM 應用和智能自動化解決方案。",
  keywords: ["AI marketplace", "AI projects", "LLM", "machine learning", "ChatGPT", "AI tools", "AI 市集", "AI 項目"],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} font-sans antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <I18nProvider>
            <SubscriptionProvider>
              <CartProvider>
                {children}
              </CartProvider>
            </SubscriptionProvider>
          </I18nProvider>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}
