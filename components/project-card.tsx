"use client"

import Image from "next/image"
import Link from "next/link"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Star, ShoppingCart, Check, Sparkles } from "lucide-react"
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
    <Card className="group overflow-hidden bg-card/60 backdrop-blur-sm hover:bg-card hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border-0 shadow-md">
      <Link href={`/projects/${slug}`}>
        <div className="relative aspect-video bg-muted overflow-hidden">
          {thumbnail ? (
            <Image
              src={thumbnail}
              alt={title}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/30 via-purple-500/20 to-pink-500/20">
              <Sparkles className="h-12 w-12 text-primary/50" />
            </div>
          )}
          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <Badge className="absolute top-3 left-3 bg-background/90 backdrop-blur-sm text-foreground border-0 shadow-sm">
            {category}
          </Badge>
        </div>
      </Link>

      <CardContent className="pt-5 pb-3">
        <Link href={`/projects/${slug}`}>
          <h3 className="font-bold text-lg line-clamp-1 group-hover:text-primary transition-colors">
            {title}
          </h3>
        </Link>
        <p className="text-sm text-muted-foreground mt-2 line-clamp-2 leading-relaxed">
          {description}
        </p>

        <div className="flex items-center justify-between mt-4">
          {author && (
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary/20 to-purple-500/20 overflow-hidden flex items-center justify-center border">
                {author.avatar ? (
                  <Image
                    src={author.avatar}
                    alt={author.name}
                    width={28}
                    height={28}
                    className="object-cover"
                  />
                ) : (
                  <span className="text-xs font-medium text-primary">
                    {author.name.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
              <span className="text-sm text-muted-foreground font-medium">{author.name}</span>
            </div>
          )}

          <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-yellow-500/10">
            <Star className="h-3.5 w-3.5 fill-yellow-500 text-yellow-500" />
            <span className="text-sm font-semibold text-yellow-600 dark:text-yellow-400">{rating.toFixed(1)}</span>
            <span className="text-xs text-muted-foreground">({reviewCount})</span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex items-center justify-between pt-0 pb-5">
        <div className="flex flex-col">
          <span className="text-2xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">${price}</span>
        </div>
        <Button
          size="sm"
          variant={inCart ? "secondary" : "default"}
          onClick={handleCartClick}
          className={inCart ? "" : "bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 shadow-md hover:shadow-lg transition-all"}
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
