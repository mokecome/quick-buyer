"use client"

import { ShoppingCart, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCart } from "@/lib/cart-context"

interface AddToCartButtonProps {
  id: string
  slug: string
  title: string
  price: number
  thumbnail?: string | null
}

export function AddToCartButton({ id, slug, title, price, thumbnail }: AddToCartButtonProps) {
  const { addItem, isInCart } = useCart()
  const inCart = isInCart(id)

  return (
    <Button
      size="lg"
      className="w-full"
      variant={inCart ? "secondary" : "default"}
      onClick={() => addItem({ id, slug, title, price, thumbnail: thumbnail ?? undefined })}
      disabled={inCart}
    >
      {inCart ? <Check className="mr-2 h-4 w-4" /> : <ShoppingCart className="mr-2 h-4 w-4" />}
      {inCart ? "Added to Cart" : "Add to Cart"}
    </Button>
  )
}
