"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Check, Loader2 } from "lucide-react"

const plans = [
  {
    name: "入門版",
    nameEn: "Starter",
    description: "適合個人賣家起步",
    monthlyPrice: 0,
    yearlyPrice: 0,
    features: [
      "上架最多 5 個 AI 項目",
      "15% 平台手續費",
      "基礎數據分析",
      "Email 支援",
      "標準結算 (7 天)",
    ],
    productId: null, // Free plan - no payment needed
    popular: false,
  },
  {
    name: "專業版",
    nameEn: "Pro",
    description: "適合成長中的賣家",
    monthlyPrice: 29,
    yearlyPrice: 290,
    features: [
      "無限上架 AI 項目",
      "10% 平台手續費",
      "進階數據分析",
      "優先客服支援",
      "快速結算 (3 天)",
      "自訂賣家頁面",
      "精選推薦位置",
    ],
    // Replace with your actual Creem Product IDs from dashboard
    productId: process.env.NEXT_PUBLIC_CREEM_PRO_MONTHLY_ID || "prod_pro_monthly",
    yearlyProductId: process.env.NEXT_PUBLIC_CREEM_PRO_YEARLY_ID || "prod_pro_yearly",
    popular: true,
  },
  {
    name: "企業版",
    nameEn: "Enterprise",
    description: "適合成熟的商業團隊",
    monthlyPrice: 99,
    yearlyPrice: 990,
    features: [
      "專業版所有功能",
      "5% 平台手續費",
      "白標方案選項",
      "專屬客戶經理",
      "即時結算",
      "API 存取權限",
      "客製化合約",
    ],
    // Replace with your actual Creem Product IDs from dashboard
    productId: process.env.NEXT_PUBLIC_CREEM_ENTERPRISE_MONTHLY_ID || "prod_enterprise_monthly",
    yearlyProductId: process.env.NEXT_PUBLIC_CREEM_ENTERPRISE_YEARLY_ID || "prod_enterprise_yearly",
    popular: false,
  },
]

export function PricingCards() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly")
  const [loading, setLoading] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleSubscribe = async (plan: typeof plans[0]) => {
    setError(null)

    if (!plan.productId) {
      // Free plan - redirect to sign up
      window.location.href = "/auth/signin"
      return
    }

    const productId = billingCycle === "yearly" && plan.yearlyProductId
      ? plan.yearlyProductId
      : plan.productId

    setLoading(plan.nameEn)

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId,
          planName: plan.nameEn,
          billingCycle,
          price: billingCycle === "yearly" ? plan.yearlyPrice : plan.monthlyPrice,
        }),
      })

      const data = await response.json()

      if (data.url) {
        window.location.href = data.url
      } else if (data.error) {
        setError(data.error)
        console.error("Checkout error:", data)
      }
    } catch (error) {
      console.error("Checkout error:", error)
      setError("無法啟動結帳流程，請稍後重試。")
    } finally {
      setLoading(null)
    }
  }

  return (
    <div className="space-y-8">
      {/* Billing Toggle */}
      <div className="flex justify-center">
        <div className="inline-flex items-center gap-4 p-1 rounded-lg bg-muted">
          <button
            onClick={() => setBillingCycle("monthly")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              billingCycle === "monthly"
                ? "bg-background shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            月繳
          </button>
          <button
            onClick={() => setBillingCycle("yearly")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              billingCycle === "yearly"
                ? "bg-background shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            年繳
            <span className="ml-2 text-xs text-green-600 dark:text-green-400">省 20%</span>
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="max-w-md mx-auto p-4 bg-destructive/10 border border-destructive/20 rounded-lg text-center">
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {plans.map((plan) => (
          <Card
            key={plan.nameEn}
            className={`relative ${
              plan.popular
                ? "border-primary shadow-lg scale-105"
                : ""
            }`}
          >
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-primary text-primary-foreground text-xs font-medium rounded-full">
                最受歡迎
              </div>
            )}
            <CardHeader>
              <CardTitle>{plan.name}</CardTitle>
              <CardDescription>{plan.description}</CardDescription>
              <div className="pt-4">
                <span className="text-4xl font-bold">
                  ${billingCycle === "yearly" ? plan.yearlyPrice : plan.monthlyPrice}
                </span>
                <span className="text-muted-foreground">
                  /{billingCycle === "yearly" ? "年" : "月"}
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-green-600 dark:text-green-400 shrink-0 mt-0.5" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button
                className="w-full"
                variant={plan.popular ? "default" : "outline"}
                onClick={() => handleSubscribe(plan)}
                disabled={loading === plan.nameEn}
              >
                {loading === plan.nameEn ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    處理中...
                  </>
                ) : plan.monthlyPrice === 0 ? (
                  "免費開始"
                ) : (
                  "立即訂閱"
                )}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Additional Info */}
      <div className="text-center text-sm text-muted-foreground max-w-2xl mx-auto">
        <p>所有付費方案均包含 14 天免費試用。隨時可取消訂閱。</p>
        <p className="mt-2">需要更多功能？<a href="/contact" className="text-primary hover:underline">聯繫我們</a>獲取客製化方案。</p>
      </div>
    </div>
  )
}
