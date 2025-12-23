"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { useTranslation } from "react-i18next"

export default function TermsPage() {
  const { i18n } = useTranslation()
  const isZh = i18n.language?.startsWith('zh') || i18n.language === 'ch'

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 py-12">
        <div className="container px-4 md:px-6 max-w-4xl">
          <h1 className="text-3xl font-bold mb-8">
            {isZh ? "服務條款" : "Terms of Service"}
          </h1>

          <div className="prose prose-neutral dark:prose-invert max-w-none space-y-6">
            <p className="text-muted-foreground">
              {isZh ? "最後更新日期：2024 年 12 月" : "Last updated: December 2024"}
            </p>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold">
                {isZh ? "1. 服務說明" : "1. Service Description"}
              </h2>
              <p>
                {isZh
                  ? "Quick Buyer 是一個 AI 項目交易市集，提供數位產品的買賣平台。使用我們的服務即表示您同意這些條款。"
                  : "Quick Buyer is an AI project marketplace that provides a platform for buying and selling digital products. By using our services, you agree to these terms."}
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold">
                {isZh ? "2. 用戶帳戶" : "2. User Accounts"}
              </h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>{isZh ? "您必須提供準確的註冊資訊" : "You must provide accurate registration information"}</li>
                <li>{isZh ? "您有責任保護您的帳戶安全" : "You are responsible for maintaining account security"}</li>
                <li>{isZh ? "禁止分享帳戶或轉讓帳戶" : "Account sharing or transfer is prohibited"}</li>
                <li>{isZh ? "我們保留暫停或終止違規帳戶的權利" : "We reserve the right to suspend or terminate accounts that violate terms"}</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold">
                {isZh ? "3. 購買與授權" : "3. Purchases and Licensing"}
              </h2>
              <p>
                {isZh ? "購買項目後，您將獲得：" : "Upon purchase, you receive:"}
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>{isZh ? "項目源代碼的完整存取權" : "Full access to the project source code"}</li>
                <li>{isZh ? "商業使用授權（除非另有說明）" : "Commercial use license (unless otherwise stated)"}</li>
                <li>{isZh ? "終身更新（如適用）" : "Lifetime updates (where applicable)"}</li>
              </ul>
              <p>
                {isZh
                  ? "您不得轉售、重新分發或公開分享購買的項目源代碼。"
                  : "You may not resell, redistribute, or publicly share purchased project source code."}
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold">
                {isZh ? "4. 賣家責任" : "4. Seller Responsibilities"}
              </h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>{isZh ? "確保上架項目為原創或擁有合法授權" : "Ensure listed projects are original or properly licensed"}</li>
                <li>{isZh ? "提供準確的項目描述" : "Provide accurate project descriptions"}</li>
                <li>{isZh ? "不得上架含有惡意代碼的項目" : "Do not list projects containing malicious code"}</li>
                <li>{isZh ? "遵守所有適用法律法規" : "Comply with all applicable laws and regulations"}</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold">
                {isZh ? "5. 禁止行為" : "5. Prohibited Activities"}
              </h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>{isZh ? "上傳惡意軟體或有害內容" : "Uploading malware or harmful content"}</li>
                <li>{isZh ? "侵犯他人知識產權" : "Infringing on others' intellectual property"}</li>
                <li>{isZh ? "欺詐或虛假陳述" : "Fraud or misrepresentation"}</li>
                <li>{isZh ? "濫用平台或干擾服務" : "Abusing the platform or interfering with services"}</li>
                <li>{isZh ? "規避安全措施" : "Circumventing security measures"}</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold">
                {isZh ? "6. 智慧財產權" : "6. Intellectual Property"}
              </h2>
              <p>
                {isZh
                  ? "Quick Buyer 平台及其原創內容、功能和設計受知識產權法保護。賣家保留其上架項目的所有權，買家獲得使用授權。"
                  : "The Quick Buyer platform and its original content, features, and design are protected by intellectual property laws. Sellers retain ownership of their listed projects, while buyers receive a usage license."}
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold">
                {isZh ? "7. 免責聲明" : "7. Disclaimer"}
              </h2>
              <p>
                {isZh
                  ? "服務按「現狀」提供。我們不保證服務不會中斷或沒有錯誤。我們不對第三方項目的品質或適用性負責。"
                  : "Services are provided \"as is\". We do not guarantee that services will be uninterrupted or error-free. We are not responsible for the quality or suitability of third-party projects."}
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold">
                {isZh ? "8. 責任限制" : "8. Limitation of Liability"}
              </h2>
              <p>
                {isZh
                  ? "在法律允許的最大範圍內，Quick Buyer 不對任何間接、偶發、特殊或後果性損害負責。"
                  : "To the maximum extent permitted by law, Quick Buyer shall not be liable for any indirect, incidental, special, or consequential damages."}
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold">
                {isZh ? "9. 條款修改" : "9. Changes to Terms"}
              </h2>
              <p>
                {isZh
                  ? "我們保留隨時修改這些條款的權利。重大變更將通過電子郵件或網站公告通知。繼續使用服務即表示接受修改後的條款。"
                  : "We reserve the right to modify these terms at any time. Significant changes will be notified via email or website announcement. Continued use of services constitutes acceptance of modified terms."}
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold">
                {isZh ? "10. 聯繫方式" : "10. Contact"}
              </h2>
              <p>
                {isZh
                  ? "如有任何問題，請聯繫：support@quickbuyer.ai"
                  : "For any questions, please contact: support@quickbuyer.ai"}
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
