"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Check } from "lucide-react"

const plans = [
  {
    name: "Starter",
    description: "Perfect for individual sellers",
    monthlyPrice: 0,
    yearlyPrice: 0,
    features: [
      "List up to 5 projects",
      "15% platform fee",
      "Basic analytics",
      "Email support",
      "Standard payouts (7 days)",
    ],
    productId: null, // Free plan
    popular: false,
  },
  {
    name: "Pro",
    description: "For growing sellers",
    monthlyPrice: 29,
    yearlyPrice: 290,
    features: [
      "Unlimited projects",
      "10% platform fee",
      "Advanced analytics",
      "Priority support",
      "Fast payouts (3 days)",
      "Custom seller profile",
      "Featured listings",
    ],
    productId: "prod_pro_monthly", // Replace with actual Creem product ID
    yearlyProductId: "prod_pro_yearly",
    popular: true,
  },
  {
    name: "Enterprise",
    description: "For established businesses",
    monthlyPrice: 99,
    yearlyPrice: 990,
    features: [
      "Everything in Pro",
      "5% platform fee",
      "White-label options",
      "Dedicated account manager",
      "Instant payouts",
      "API access",
      "Custom contracts",
    ],
    productId: "prod_enterprise_monthly", // Replace with actual Creem product ID
    yearlyProductId: "prod_enterprise_yearly",
    popular: false,
  },
]

export function PricingCards() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly")
  const [loading, setLoading] = useState<string | null>(null)

  const handleSubscribe = async (plan: typeof plans[0]) => {
    if (!plan.productId) {
      // Free plan - redirect to sign up
      window.location.href = "/auth/signin"
      return
    }

    const productId = billingCycle === "yearly" && plan.yearlyProductId
      ? plan.yearlyProductId
      : plan.productId

    setLoading(plan.name)

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId,
          planName: plan.name,
          billingCycle,
          price: billingCycle === "yearly" ? plan.yearlyPrice : plan.monthlyPrice,
        }),
      })

      const data = await response.json()

      if (data.url) {
        window.location.href = data.url
      } else if (data.error) {
        alert(`Error: ${data.error}`)
      }
    } catch (error) {
      console.error("Checkout error:", error)
      alert("Failed to start checkout. Please try again.")
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
            Monthly
          </button>
          <button
            onClick={() => setBillingCycle("yearly")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              billingCycle === "yearly"
                ? "bg-background shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Yearly
            <span className="ml-2 text-xs text-green-600 dark:text-green-400">Save 20%</span>
          </button>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {plans.map((plan) => (
          <Card
            key={plan.name}
            className={`relative ${
              plan.popular
                ? "border-primary shadow-lg scale-105"
                : ""
            }`}
          >
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-primary text-primary-foreground text-xs font-medium rounded-full">
                Most Popular
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
                  /{billingCycle === "yearly" ? "year" : "month"}
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
                disabled={loading === plan.name}
              >
                {loading === plan.name
                  ? "Processing..."
                  : plan.monthlyPrice === 0
                  ? "Get Started Free"
                  : "Subscribe"}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}
