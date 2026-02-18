"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Check, Loader2 } from "lucide-react"
import { useTranslations } from "next-intl"

const planKeys = ['starter', 'pro', 'enterprise'] as const

const planConfigs = {
  starter: {
    monthlyPrice: 0,
    yearlyPrice: 0,
    productId: null,
    yearlyProductId: null,
    popular: false,
  },
  pro: {
    monthlyPrice: 29,
    yearlyPrice: 290,
    productId: process.env.NEXT_PUBLIC_CREEM_PRO_MONTHLY_ID || "prod_pro_monthly",
    yearlyProductId: process.env.NEXT_PUBLIC_CREEM_PRO_YEARLY_ID || "prod_pro_yearly",
    popular: true,
  },
  enterprise: {
    monthlyPrice: 99,
    yearlyPrice: 990,
    productId: process.env.NEXT_PUBLIC_CREEM_ENTERPRISE_MONTHLY_ID || "prod_enterprise_monthly",
    yearlyProductId: process.env.NEXT_PUBLIC_CREEM_ENTERPRISE_YEARLY_ID || "prod_enterprise_yearly",
    popular: false,
  },
}

export function PricingCards() {
  const t = useTranslations()
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly")
  const [loading, setLoading] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleSubscribe = async (planKey: typeof planKeys[number]) => {
    setError(null)
    const config = planConfigs[planKey]

    if (!config.productId) {
      // Free plan - redirect to sign up
      window.location.href = "/auth/signin"
      return
    }

    const productId = billingCycle === "yearly" && config.yearlyProductId
      ? config.yearlyProductId
      : config.productId

    setLoading(planKey)

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId,
          planName: planKey,
          billingCycle,
          price: billingCycle === "yearly" ? config.yearlyPrice : config.monthlyPrice,
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
      setError(t('common.error'))
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
            {t('pricing.monthly')}
          </button>
          <button
            onClick={() => setBillingCycle("yearly")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              billingCycle === "yearly"
                ? "bg-background shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {t('pricing.yearly')}
            <span className="ml-2 text-xs text-green-600 dark:text-green-400">{t('pricing.save')}</span>
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
        {planKeys.map((planKey) => {
          const config = planConfigs[planKey]
          // next-intl returns arrays natively - no returnObjects needed
          const features = t.raw(`pricing.plans.${planKey}.features`) as string[]

          return (
            <Card
              key={planKey}
              className={`relative ${
                config.popular
                  ? "border-primary shadow-lg scale-105"
                  : ""
              }`}
            >
              {config.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-primary text-primary-foreground text-xs font-medium rounded-full">
                  {t('pricing.mostPopular')}
                </div>
              )}
              <CardHeader>
                <CardTitle>{t(`pricing.plans.${planKey}.name`)}</CardTitle>
                <CardDescription>{t(`pricing.plans.${planKey}.description`)}</CardDescription>
                <div className="pt-4">
                  <span className="text-4xl font-bold">
                    ${billingCycle === "yearly" ? config.yearlyPrice : config.monthlyPrice}
                  </span>
                  <span className="text-muted-foreground">
                    {billingCycle === "yearly" ? t('pricing.perYear') : t('pricing.perMonth')}
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {Array.isArray(features) && features.map((feature, index) => (
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
                  variant={config.popular ? "default" : "outline"}
                  onClick={() => handleSubscribe(planKey)}
                  disabled={loading === planKey}
                >
                  {loading === planKey ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {t('common.processing')}
                    </>
                  ) : config.monthlyPrice === 0 ? (
                    t('pricing.getStartedFree')
                  ) : (
                    t('pricing.subscribe')
                  )}
                </Button>
              </CardFooter>
            </Card>
          )
        })}
      </div>

      {/* Additional Info */}
      <div className="text-center text-sm text-muted-foreground max-w-2xl mx-auto">
        <p>{t('pricing.trialInfo')}</p>
        <p className="mt-2">
          {t('pricing.customPlan')}{' '}
          <a href="/contact" className="text-primary hover:underline">
            {t('pricing.customPlanLink')}
          </a>
        </p>
      </div>
    </div>
  )
}
