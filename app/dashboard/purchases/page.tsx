import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Download, ExternalLink, Package } from "lucide-react"

// Mock purchases data
const purchases = [
  {
    id: "1",
    projectTitle: "Next.js SaaS Starter Kit",
    projectSlug: "nextjs-saas-starter",
    price: 149,
    purchasedAt: "2024-01-15",
    status: "completed",
  },
  {
    id: "2",
    projectTitle: "React Admin Dashboard",
    projectSlug: "react-admin-dashboard",
    price: 79,
    purchasedAt: "2024-01-10",
    status: "completed",
  },
]

export default function PurchasesPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 py-12">
        <div className="container px-4 md:px-6">
          <div className="space-y-8">
            {/* Header */}
            <div>
              <h1 className="text-3xl font-bold">My Purchases</h1>
              <p className="text-muted-foreground">
                Access and download your purchased projects
              </p>
            </div>

            {/* Purchases List */}
            {purchases.length > 0 ? (
              <div className="space-y-4">
                {purchases.map((purchase) => (
                  <Card key={purchase.id}>
                    <CardContent className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pt-6">
                      <div className="space-y-1">
                        <Link
                          href={`/projects/${purchase.projectSlug}`}
                          className="font-semibold hover:text-primary transition-colors"
                        >
                          {purchase.projectTitle}
                        </Link>
                        <div className="flex items-center gap-3 text-sm text-muted-foreground">
                          <span>${purchase.price}</span>
                          <span>•</span>
                          <span>
                            Purchased on{" "}
                            {new Date(purchase.purchasedAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant={
                            purchase.status === "completed" ? "default" : "secondary"
                          }
                        >
                          {purchase.status}
                        </Badge>
                        <Button size="sm">
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </Button>
                        <Button size="sm" variant="outline" asChild>
                          <Link href={`/projects/${purchase.projectSlug}`}>
                            <ExternalLink className="h-4 w-4" />
                          </Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="text-center py-12">
                  <Package className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                  <h3 className="font-semibold mb-2">No purchases yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Start by browsing our project catalog
                  </p>
                  <Button asChild>
                    <Link href="/projects">Browse Projects</Link>
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
