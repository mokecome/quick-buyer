"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { useTranslation } from "react-i18next"

export default function RefundPage() {
  const { i18n } = useTranslation()
  const isZh = i18n.language?.startsWith('zh') || i18n.language === 'ch'

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 py-12">
        <div className="container px-4 md:px-6 max-w-4xl">
          <h1 className="text-3xl font-bold mb-8">
            {isZh ? "退款政策" : "Refund Policy"}
          </h1>

          <div className="prose prose-neutral dark:prose-invert max-w-none space-y-6">
            <p className="text-muted-foreground">
              {isZh ? "最後更新日期：2024 年 12 月" : "Last updated: December 2024"}
            </p>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold">
                {isZh ? "退款保證" : "Money-Back Guarantee"}
              </h2>
              <p>
                {isZh
                  ? "我們提供 14 天退款保證。如果您對購買的項目不滿意，可以在購買後 14 天內申請全額退款。"
                  : "We offer a 14-day money-back guarantee. If you are not satisfied with your purchase, you can request a full refund within 14 days of purchase."}
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold">
                {isZh ? "退款條件" : "Refund Eligibility"}
              </h2>
              <p>
                {isZh ? "以下情況可申請退款：" : "You may request a refund if:"}
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>{isZh ? "項目與描述嚴重不符" : "The project significantly differs from its description"}</li>
                <li>{isZh ? "項目無法正常運作且賣家未能提供解決方案" : "The project does not work and the seller cannot provide a solution"}</li>
                <li>{isZh ? "項目缺少描述中承諾的關鍵功能" : "The project is missing key features promised in the description"}</li>
                <li>{isZh ? "技術問題導致無法使用" : "Technical issues prevent usage"}</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold">
                {isZh ? "不適用退款的情況" : "Non-Refundable Situations"}
              </h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>{isZh ? "購買超過 14 天" : "Purchase was made more than 14 days ago"}</li>
                <li>{isZh ? "您已下載並使用項目於商業用途" : "You have downloaded and used the project for commercial purposes"}</li>
                <li>{isZh ? "因您自身環境或技術能力問題導致無法使用" : "Issues caused by your own environment or technical limitations"}</li>
                <li>{isZh ? "訂閱服務（僅適用於取消後不再續費）" : "Subscription services (only applicable to stop future renewals)"}</li>
                <li>{isZh ? "您違反了服務條款" : "You have violated the terms of service"}</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold">
                {isZh ? "如何申請退款" : "How to Request a Refund"}
              </h2>
              <ol className="list-decimal pl-6 space-y-2">
                <li>
                  {isZh
                    ? "發送電子郵件至 support@quickbuyer.ai"
                    : "Send an email to support@quickbuyer.ai"}
                </li>
                <li>
                  {isZh
                    ? "在郵件中提供：訂單編號、購買日期、退款原因"
                    : "Include in your email: Order ID, purchase date, reason for refund"}
                </li>
                <li>
                  {isZh
                    ? "我們將在 2-3 個工作日內審核您的申請"
                    : "We will review your request within 2-3 business days"}
                </li>
                <li>
                  {isZh
                    ? "審核通過後，退款將在 5-10 個工作日內處理"
                    : "Once approved, refunds will be processed within 5-10 business days"}
                </li>
              </ol>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold">
                {isZh ? "退款處理" : "Refund Processing"}
              </h2>
              <p>
                {isZh
                  ? "退款將退回至您原始付款方式。根據您的銀行或支付服務商，退款可能需要額外時間才能顯示在您的帳戶中。"
                  : "Refunds will be returned to your original payment method. Depending on your bank or payment provider, it may take additional time for the refund to appear in your account."}
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold">
                {isZh ? "訂閱取消" : "Subscription Cancellation"}
              </h2>
              <p>
                {isZh
                  ? "訂閱可隨時取消。取消後，您將繼續享有服務直到當前計費週期結束。已支付的訂閱費用不予退還，但不會再收取後續費用。"
                  : "Subscriptions can be cancelled at any time. After cancellation, you will continue to have access until the end of the current billing period. Paid subscription fees are non-refundable, but no future charges will be made."}
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold">
                {isZh ? "爭議解決" : "Dispute Resolution"}
              </h2>
              <p>
                {isZh
                  ? "如果您對退款決定有異議，請聯繫我們的客服團隊。我們將盡力公平解決所有爭議。"
                  : "If you disagree with a refund decision, please contact our support team. We will do our best to resolve all disputes fairly."}
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold">
                {isZh ? "聯繫我們" : "Contact Us"}
              </h2>
              <p>
                {isZh
                  ? "退款相關問題請聯繫：support@quickbuyer.ai"
                  : "For refund-related questions, please contact: support@quickbuyer.ai"}
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
