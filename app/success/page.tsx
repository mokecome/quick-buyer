import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { CheckCircle, Download, ArrowRight } from "lucide-react"

export default function SuccessPage({
  searchParams,
}: {
  searchParams: { project?: string }
}) {
  const projectSlug = searchParams.project

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
              <CardTitle className="text-2xl">Payment Successful!</CardTitle>
              <CardDescription className="text-base">
                Thank you for your purchase. Your order has been confirmed.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                <p className="text-sm text-muted-foreground">
                  You will receive an email with download instructions shortly.
                </p>
                <p className="text-sm text-muted-foreground">
                  You can also access your purchases from your dashboard.
                </p>
              </div>

              <div className="flex flex-col gap-3">
                <Button size="lg" className="w-full" asChild>
                  <Link href="/dashboard/purchases">
                    <Download className="mr-2 h-4 w-4" />
                    Go to Downloads
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="w-full" asChild>
                  <Link href="/projects">
                    Browse More Projects
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  )
}
