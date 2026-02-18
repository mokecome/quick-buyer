"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { useLocale } from "next-intl"

export default function PrivacyClient() {
  const locale = useLocale()
  const isZh = locale.startsWith('zh') || locale === 'ch'

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 py-12">
        <div className="container px-4 md:px-6 max-w-4xl">
          <h1 className="text-3xl font-bold mb-8">
            {isZh ? "隱私政策" : "Privacy Policy"}
          </h1>

          <div className="prose prose-neutral dark:prose-invert max-w-none space-y-6">
            <p className="text-muted-foreground">
              {isZh ? "最後更新日期：2024 年 12 月" : "Last updated: December 2024"}
            </p>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold">
                {isZh ? "1. 資料收集" : "1. Information We Collect"}
              </h2>
              <p>
                {isZh
                  ? "我們收集您在使用 Quick Buyer 服務時提供的資訊，包括："
                  : "We collect information you provide when using Quick Buyer services, including:"}
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>{isZh ? "帳戶資訊（電子郵件、用戶名稱）" : "Account information (email, username)"}</li>
                <li>{isZh ? "付款資訊（由第三方支付處理商處理）" : "Payment information (processed by third-party payment processors)"}</li>
                <li>{isZh ? "使用數據（瀏覽記錄、購買記錄）" : "Usage data (browsing history, purchase history)"}</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold">
                {isZh ? "2. 資料使用" : "2. How We Use Your Information"}
              </h2>
              <p>
                {isZh ? "我們使用收集的資訊來：" : "We use the collected information to:"}
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>{isZh ? "提供和維護我們的服務" : "Provide and maintain our services"}</li>
                <li>{isZh ? "處理交易和發送相關通知" : "Process transactions and send related notifications"}</li>
                <li>{isZh ? "改善用戶體驗" : "Improve user experience"}</li>
                <li>{isZh ? "發送服務更新和行銷資訊（可選擇退出）" : "Send service updates and marketing communications (opt-out available)"}</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold">
                {isZh ? "3. 資料保護" : "3. Data Protection"}
              </h2>
              <p>
                {isZh
                  ? "我們採取適當的技術和組織措施來保護您的個人資料，防止未經授權的存取、更改、披露或銷毀。"
                  : "We implement appropriate technical and organizational measures to protect your personal data against unauthorized access, alteration, disclosure, or destruction."}
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold">
                {isZh ? "4. 第三方服務" : "4. Third-Party Services"}
              </h2>
              <p>
                {isZh
                  ? "我們使用第三方服務來處理付款（Creem）和進行分析（Vercel Analytics）。這些服務有各自的隱私政策。"
                  : "We use third-party services for payment processing (Creem) and analytics (Vercel Analytics). These services have their own privacy policies."}
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold">
                {isZh ? "5. Cookie 使用" : "5. Cookies"}
              </h2>
              <p>
                {isZh
                  ? "我們使用 Cookie 來維持您的登入狀態和改善網站體驗。您可以在瀏覽器設定中管理 Cookie 偏好。"
                  : "We use cookies to maintain your login session and improve website experience. You can manage cookie preferences in your browser settings."}
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold">
                {isZh ? "6. 您的權利" : "6. Your Rights"}
              </h2>
              <p>
                {isZh ? "您有權：" : "You have the right to:"}
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>{isZh ? "存取您的個人資料" : "Access your personal data"}</li>
                <li>{isZh ? "更正不準確的資料" : "Correct inaccurate data"}</li>
                <li>{isZh ? "要求刪除您的資料" : "Request deletion of your data"}</li>
                <li>{isZh ? "退出行銷通訊" : "Opt-out of marketing communications"}</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold">
                {isZh ? "7. 聯繫我們" : "7. Contact Us"}
              </h2>
              <p>
                {isZh
                  ? "如有任何隱私相關問題，請聯繫：supports@quick-buyer.com"
                  : "For any privacy-related questions, please contact: supports@quick-buyer.com"}
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
