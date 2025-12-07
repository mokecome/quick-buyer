import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { CheckCircle, Download, ArrowRight, CreditCard, Sparkles } from "lucide-react"

export default async function SuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ project?: string; plan?: string; billing?: string }>
}) {
  const params = await searchParams
  const projectSlug = params.project
  const planName = params.plan
  const billingCycle = params.billing

  // Determine if this is a subscription success or project purchase
  const isSubscription = !!planName

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center py-20">
        <div className="container px-4 md:px-6 max-w-lg">
          <Card className="text-center">
            <CardHeader className="space-y-4">
              <div className="mx-auto w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
                <CheckCircle className="h-10 w-10 text-green-600 dark:text-green-400" />
              </div>
              <CardTitle className="text-2xl">
                {isSubscription ? "訂閱成功！" : "付款成功！"}
              </CardTitle>
              <CardDescription className="text-base">
                {isSubscription
                  ? `感謝您訂閱 ${planName} 方案！您的帳戶已升級。`
                  : "感謝您的購買，訂單已確認。"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {isSubscription ? (
                <>
                  {/* Subscription Success Content */}
                  <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 space-y-3">
                    <div className="flex items-center justify-center gap-2 text-primary">
                      <Sparkles className="h-5 w-5" />
                      <span className="font-semibold">{planName} 方案已啟用</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {billingCycle === "yearly" ? "年繳方案" : "月繳方案"}
                    </p>
                  </div>

                  <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                    <p className="text-sm text-muted-foreground">
                      您將收到一封確認郵件，包含訂閱詳情和發票。
                    </p>
                    <p className="text-sm text-muted-foreground">
                      現在可以開始使用所有進階功能了！
                    </p>
                  </div>

                  <div className="flex flex-col gap-3">
                    <Button size="lg" className="w-full" asChild>
                      <Link href="/dashboard">
                        <CreditCard className="mr-2 h-4 w-4" />
                        前往控制台
                      </Link>
                    </Button>
                    <Button size="lg" variant="outline" className="w-full" asChild>
                      <Link href="/projects">
                        開始上架 AI 項目
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  {/* Project Purchase Success Content */}
                  <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                    <p className="text-sm text-muted-foreground">
                      您將很快收到包含下載說明的郵件。
                    </p>
                    <p className="text-sm text-muted-foreground">
                      您也可以從控制台存取所有購買的項目。
                    </p>
                  </div>

                  <div className="flex flex-col gap-3">
                    <Button size="lg" className="w-full" asChild>
                      <Link href="/dashboard/purchases">
                        <Download className="mr-2 h-4 w-4" />
                        前往下載
                      </Link>
                    </Button>
                    <Button size="lg" variant="outline" className="w-full" asChild>
                      <Link href="/projects">
                        瀏覽更多 AI 項目
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  )
}
