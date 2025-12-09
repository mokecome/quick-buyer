"use client"

import Image from "next/image"
import Link from "next/link"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Star, ShoppingCart, Check } from "lucide-react"
import { useCart } from "@/lib/cart-context"
import { useTranslation } from "react-i18next"

interface ProjectCardProps {
  id: string
  slug: string
  title: string
  description: string
  price: number
  thumbnail?: string
  category: string
  rating?: number
  reviewCount?: number
  author?: {
    name: string
    avatar?: string
  }
}

export function ProjectCard({
  id,
  slug,
  title,
  description,
  price,
  thumbnail,
  category,
  rating = 4.5,
  reviewCount = 0,
  author,
}: ProjectCardProps) {
  const { t } = useTranslation()
  const { addItem, removeItem, isInCart } = useCart()
  const inCart = isInCart(id)

  const handleCartClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (inCart) {
      removeItem(id)
    } else {
      addItem({ id, slug, title, price, thumbnail })
    }
  }

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-all group">
      <Link href={`/projects/${slug}`}>
        <div className="relative aspect-video bg-muted overflow-hidden">
          {thumbnail ? (
            <Image
              src={thumbnail}
              alt={title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-primary/5">
              <span className="text-4xl">📦</span>
            </div>
          )}
          <Badge className="absolute top-3 left-3" variant="secondary">
            {category}
          </Badge>
        </div>
      </Link>

      <CardContent className="pt-4">
        <Link href={`/projects/${slug}`}>
          <h3 className="font-semibold text-lg line-clamp-1 hover:text-primary transition-colors">
            {title}
          </h3>
        </Link>
        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
          {description}
        </p>

        {author && (
          <div className="flex items-center gap-2 mt-3">
            <div className="w-6 h-6 rounded-full bg-muted overflow-hidden">
              {author.avatar ? (
                <Image
                  src={author.avatar}
                  alt={author.name}
                  width={24}
                  height={24}
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-xs">
                  {author.name.charAt(0)}
                </div>
              )}
            </div>
            <span className="text-sm text-muted-foreground">{author.name}</span>
          </div>
        )}

        <div className="flex items-center gap-1 mt-3">
          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
          <span className="text-sm font-medium">{rating.toFixed(1)}</span>
          <span className="text-sm text-muted-foreground">({reviewCount})</span>
        </div>
      </CardContent>

      <CardFooter className="flex items-center justify-between pt-0">
        <span className="text-xl font-bold">${price}</span>
        <Button
          size="sm"
          variant={inCart ? "secondary" : "default"}
          onClick={handleCartClick}
        >
          {inCart ? (
            <>
              <Check className="h-4 w-4 mr-2" />
              {t('cart.inCart', 'In Cart')}
            </>
          ) : (
            <>
              <ShoppingCart className="h-4 w-4 mr-2" />
              {t('cart.addToCart', 'Add to Cart')}
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}
