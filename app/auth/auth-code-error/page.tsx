import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle } from "lucide-react"
import Link from "next/link"

export default function AuthCodeErrorPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
            <AlertCircle className="h-6 w-6 text-destructive" />
          </div>
          <CardTitle className="text-2xl">認證失敗</CardTitle>
          <CardDescription>
            登入過程中發生錯誤，請重試。
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-sm text-muted-foreground space-y-2">
            <p>可能的原因：</p>
            <ul className="list-disc list-inside space-y-1">
              <li>授權碼已過期或無效</li>
              <li>GitHub 授權被取消</li>
              <li>網絡連接問題</li>
            </ul>
          </div>
          <div className="flex flex-col gap-2">
            <Button asChild>
              <Link href="/auth/signin">重新登入</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/">返回首頁</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
