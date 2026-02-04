'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Star, Heart, ShoppingCart, ChevronLeft, Truck, Shield, RotateCcw } from 'lucide-react'

// Sample products data - same as in search page
const PRODUCTS = [
  {
    id: 125,
    title: 'Selfie Lamp with iPhone',
    description: 'Professional selfie lamp with adjustable brightness and color temperature. Perfect for content creators, makeup artists, and social media influencers. Features 360-degree rotation and sturdy phone holder.',
    price: 14.99,
    discountPercentage: 19.4,
    rating: 3.55,
    reviews: 128,
    stock: 58,
    category: 'mobile-accessories',
    thumbnail: 'https://cdn.dummyjson.com/product-images/110/thumbnail.webp',
    images: [
      'https://cdn.dummyjson.com/product-images/110/1.jpg',
      'https://cdn.dummyjson.com/product-images/110/2.jpg',
      'https://cdn.dummyjson.com/product-images/110/3.jpg',
    ],
    availabilityStatus: 'In Stock',
    brand: 'LampPro',
    sku: 'LAMP-SELF-110',
    tags: ['lighting', 'selfie', 'photography'],
  },
  {
    id: 71,
    title: 'Silver Pot With Glass Cap',
    description: 'Premium stainless steel pot with tempered glass lid. Heat-resistant handles and measuring marks inside. Suitable for cooking, steaming, and boiling. Easy to clean and maintain.',
    price: 39.99,
    discountPercentage: 5.7,
    rating: 3.22,
    reviews: 95,
    stock: 40,
    category: 'kitchen-accessories',
    thumbnail: 'https://cdn.dummyjson.com/product-images/71/thumbnail.webp',
    images: [
      'https://cdn.dummyjson.com/product-images/71/1.jpg',
      'https://cdn.dummyjson.com/product-images/71/2.jpg',
      'https://cdn.dummyjson.com/product-images/71/3.jpg',
    ],
    availabilityStatus: 'In Stock',
    brand: 'KitchenPro',
    sku: 'POT-GLASS-71',
    tags: ['kitchen', 'cooking', 'pot'],
  },
]

export default function ProductDetailPage({ params }) {
  const { id } = React.use(params)
  const product = PRODUCTS.find((p) => p.id === parseInt(id))
  const [quantity, setQuantity] = useState(1)
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [selectedImage, setSelectedImage] = useState(0)

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <div className="mx-auto max-w-6xl px-4 py-12">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-foreground">Product not found</h1>
            <Link href="/search" className="mt-4 inline-block">
              <Button className="bg-primary hover:bg-primary/90">Back to Search</Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const discountedPrice = product.price - (product.price * product.discountPercentage) / 100
  const discountAmount = (product.price * product.discountPercentage) / 100

  const renderStars = (rating) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        size={16}
        className={i < Math.round(rating) ? 'fill-accent text-accent' : 'text-muted-foreground'}
      />
    ))
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-6xl px-4 py-8">
        {/* Back button */}
        <Link href="/search" className="mb-6 inline-flex items-center gap-2 text-primary hover:underline">
          <ChevronLeft size={20} />
          Back to Search
        </Link>

        {/* Product Details */}
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Image Section */}
          <div className="space-y-4">
            <div className="overflow-hidden rounded-lg border border-border bg-card">
              <img
                src={product.images[selectedImage] || "/placeholder.svg"}
                alt={product.title}
                className="h-96 w-full object-cover"
              />
            </div>
            {/* Image thumbnails */}
            <div className="flex gap-2">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={`h-20 w-20 rounded-lg border-2 overflow-hidden transition-all ${
                    selectedImage === i ? 'border-primary' : 'border-border'
                  }`}
                >
                  <img src={img || "/placeholder.svg"} alt={`${product.title} ${i + 1}`} className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info Section */}
          <div className="space-y-6">
            {/* Header */}
            <div>
              <div className="mb-2 flex items-center gap-2">
                <Badge variant="outline" className="border-border text-foreground">
                  {product.category.replace('-', ' ')}
                </Badge>
                {product.discountPercentage > 0 && (
                  <Badge className="bg-accent text-accent-foreground">
                    {product.discountPercentage}% OFF
                  </Badge>
                )}
              </div>
              <h1 className="mb-2 text-3xl font-bold text-foreground">{product.title}</h1>
              <p className="text-sm text-muted-foreground">SKU: {product.sku}</p>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-4">
              <div className="flex gap-1">{renderStars(product.rating)}</div>
              <span className="text-sm font-semibold text-foreground">{product.rating.toFixed(1)}/5</span>
              <span className="text-sm text-muted-foreground">({product.reviews} reviews)</span>
            </div>

            {/* Price */}
            <Card className="border-border bg-card">
              <CardContent className="pt-6">
                <div className="space-y-2">
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-foreground">${discountedPrice.toFixed(2)}</span>
                    <span className="line-through text-lg text-muted-foreground">${product.price.toFixed(2)}</span>
                    <span className="text-sm font-semibold text-accent">
                      Save ${discountAmount.toFixed(2)}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {product.stock > 0 ? (
                      <span className="text-green-600 dark:text-green-400">In stock ({product.stock} available)</span>
                    ) : (
                      <span className="text-destructive">Out of stock</span>
                    )}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Description */}
            <div>
              <h3 className="mb-2 font-semibold text-foreground">Description</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">{product.description}</p>
            </div>

            {/* Quantity and Actions */}
            <div className="space-y-3">
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-foreground">Quantity:</span>
                <div className="flex items-center rounded-lg border border-border bg-background">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-2 text-primary hover:bg-secondary"
                  >
                    −
                  </button>
                  <span className="min-w-8 px-3 py-2 text-center text-foreground">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className="px-3 py-2 text-primary hover:bg-secondary"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  disabled={product.stock === 0}
                  className="flex-1 gap-2 bg-primary hover:bg-primary/90 disabled:opacity-50"
                >
                  <ShoppingCart size={18} />
                  Add to Cart
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setIsWishlisted(!isWishlisted)}
                  className={`border-border ${isWishlisted ? 'bg-accent/10 text-accent' : 'text-foreground'}`}
                >
                  <Heart size={20} fill={isWishlisted ? 'currentColor' : 'none'} />
                </Button>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="space-y-3 border-t border-border pt-6">
              <div className="flex items-center gap-3">
                <Truck size={20} className="text-primary" />
                <div>
                  <p className="font-medium text-foreground">Free Delivery</p>
                  <p className="text-xs text-muted-foreground">On orders over $50</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Shield size={20} className="text-primary" />
                <div>
                  <p className="font-medium text-foreground">Secure Checkout</p>
                  <p className="text-xs text-muted-foreground">SSL encrypted payment</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <RotateCcw size={20} className="text-primary" />
                <div>
                  <p className="font-medium text-foreground">30-Day Returns</p>
                  <p className="text-xs text-muted-foreground">Hassle-free returns policy</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products Section */}
        <div className="mt-16 border-t border-border pt-12">
          <h2 className="mb-6 text-2xl font-bold text-foreground">Related Products</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {PRODUCTS.filter((p) => p.id !== product.id)
              .slice(0, 4)
              .map((relatedProduct) => (
                <Link key={relatedProduct.id} href={`/product/${relatedProduct.id}`}>
                  <Card className="border-border bg-card transition-all hover:shadow-lg">
                    <CardContent className="p-0">
                      <div className="relative overflow-hidden rounded-t-lg bg-background">
                        <img
                          src={relatedProduct.thumbnail || "/placeholder.svg"}
                          alt={relatedProduct.title}
                          className="h-48 w-full object-cover transition-transform hover:scale-110"
                        />
                        {relatedProduct.discountPercentage > 0 && (
                          <Badge className="absolute right-2 top-2 bg-accent text-accent-foreground">
                            {relatedProduct.discountPercentage}%
                          </Badge>
                        )}
                      </div>
                      <div className="p-3">
                        <p className="mb-1 line-clamp-2 text-sm font-medium text-foreground">
                          {relatedProduct.title}
                        </p>
                        <div className="mb-2 flex items-center gap-1">
                          {Array.from({ length: Math.round(relatedProduct.rating) }).map((_, i) => (
                            <Star key={i} size={12} className="fill-accent text-accent" />
                          ))}
                          <span className="text-xs text-muted-foreground">
                            {relatedProduct.rating.toFixed(1)}
                          </span>
                        </div>
                        <p className="text-sm font-bold text-foreground">
                          $
                          {(
                            relatedProduct.price -
                            (relatedProduct.price * relatedProduct.discountPercentage) / 100
                          ).toFixed(2)}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
          </div>
        </div>
      </div>
    </div>
  )
}
