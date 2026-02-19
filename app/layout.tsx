import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { ThemeProvider } from "@/components/theme-provider"
import { NextIntlClientProvider } from 'next-intl'
import { getMessages, getLocale } from 'next-intl/server'
import { CartProvider } from "@/lib/cart-context"
import { SubscriptionProvider } from "@/lib/subscription-context"
import "@/styles/globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  metadataBase: new URL('https://quick-buyer.com'),
  title: "Quick Buyer - AI 項目市集",
  description:
    "專注於 AI 的交易市集。發現生產就緒的 AI 模板、機器學習工具、LLM 應用和智能自動化解決方案。",
  keywords: ["AI marketplace", "AI projects", "LLM", "machine learning", "ChatGPT", "AI tools", "AI 市集", "AI 項目"],
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "Quick Buyer - AI Project Marketplace",
    description:
      "The AI-focused marketplace. Discover production-ready AI templates, machine learning tools, LLM applications, and intelligent automation solutions.",
    type: "website",
    url: "https://quick-buyer.com",
    siteName: "Quick Buyer",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Quick Buyer - AI Project Marketplace",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Quick Buyer - AI Project Marketplace",
    description:
      "The AI-focused marketplace. Discover production-ready AI templates, machine learning tools, LLM applications, and intelligent automation solutions.",
    images: ["/og-image.png"],
  },
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [messages, locale] = await Promise.all([getMessages(), getLocale()])

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={`${inter.className} font-sans antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <NextIntlClientProvider messages={messages}>
            <SubscriptionProvider>
              <CartProvider>
                {children}
              </CartProvider>
            </SubscriptionProvider>
          </NextIntlClientProvider>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}
