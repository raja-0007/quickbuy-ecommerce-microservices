import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Image from 'next/image'
import Link from 'next/link'
import { Star } from 'lucide-react'
import ProductCardControls from '@/components/product/ProductCardControls'

const getDiscountedPrice = (price, discount) => price - (price * discount) / 100

export default function ProductCard({ product }) {
  const discountedPrice = getDiscountedPrice(product.price, product.discountPercentage)

  return (
    <article>
      <Card className="group overflow-hidden border-border hover:border-primary transition-all hover:shadow-lg py-0">
        <CardContent className="p-0">
          <div className="relative overflow-hidden bg-secondary h-48">
            <Link href={`/product/${product._id}`} className="block w-full h-full">
              <Image
                fill
                src={product.thumbnail || '/placeholder.svg'}
                alt={product.title}
                className="h-full w-full object-contain group-hover:scale-110 transition-transform duration-300"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                quality={75}
                loading="lazy"
              />
            </Link>
            {product.discountPercentage > 0 && (
              <Badge className="absolute top-3 left-3 bg-accent text-accent-foreground hover:bg-accent">-{product.discountPercentage.toFixed(0)}%</Badge>
            )}
            {product.stock < 10 && (
              <div className="absolute bottom-3 left-3">
                <Badge variant="outline" className="bg-background/80">Only {product.stock} left</Badge>
              </div>
            )}
          </div>

          <div className="p-4">
            <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wide">{product.category.replace('-', ' ')}</p>
            <h3 className="text-sm font-semibold text-foreground line-clamp-2 mb-2 group-hover:text-primary transition-colors">
              <Link href={`/product/${product._id}`} className="inline-block">{product.title}</Link>
            </h3>
            <div className="mb-3 flex items-center gap-2">
              <div className="flex items-center gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={14}
                    className={`${i < Math.round(product.rating) ? 'fill-accent text-accent' : 'text-border'}`}
                  />
                ))}
              </div>
              <span className="text-xs text-muted-foreground">({product.rating})</span>
            </div>
            <div className="mb-4 flex items-baseline gap-2">
              <span className="text-lg font-bold text-primary">${discountedPrice.toFixed(2)}</span>
              {product.discountPercentage > 0 && (
                <span className="text-xs text-muted-foreground line-through">${product.price.toFixed(2)}</span>
              )}
            </div>
            <ProductCardControls product={product} />
          </div>
        </CardContent>
      </Card>
    </article>
  )
}
