'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Heart, ShoppingCart, Star, Trash2, ChevronLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

const PRODUCTS = [
  {
    id: 1,
    title: 'Premium Wireless Headphones',
    category: 'Electronics',
    price: 199.99,
    discountPercentage: 20,
    rating: 4.5,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=300&fit=crop',
    stock: 5,
  },
  {
    id: 3,
    title: 'Stainless Steel Watch',
    category: 'Accessories',
    price: 299.99,
    discountPercentage: 15,
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=300&h=300&fit=crop',
    stock: 0,
  },
  {
    id: 5,
    title: 'Portable SSD 1TB',
    category: 'Electronics',
    price: 129.99,
    discountPercentage: 10,
    rating: 4.6,
    image: 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=300&h=300&fit=crop',
    stock: 12,
  },
]

const WishlistPage = () => {
  const [items, setItems] = useState(PRODUCTS)

  const removeFromWishlist = (id) => {
    setItems(items.filter((item) => item.id !== id))
  }

  const addToCart = (product) => {
    console.log('Added to cart:', product.title)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-primary hover:opacity-80 transition">
            <ChevronLeft size={20} />
            <span className="text-sm font-medium">Back to Shopping</span>
          </Link>
          <h1 className="text-2xl font-bold text-foreground">My Wishlist</h1>
          <div className="w-32"></div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <Heart size={48} className="text-muted-foreground mb-4 opacity-50" />
            <h2 className="text-xl font-semibold text-foreground mb-2">Your wishlist is empty</h2>
            <p className="text-muted-foreground mb-6">Start adding items you love</p>
            <Link href="/search">
              <Button className="bg-primary hover:bg-primary/90">Continue Shopping</Button>
            </Link>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-foreground">
                {items.length} item{items.length !== 1 ? 's' : ''} in your wishlist
              </h2>
            </div>

            {/* Wishlist Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {items.map((product) => {
                const finalPrice = product.price - (product.price * product.discountPercentage) / 100
                return (
                  <Card
                    key={product.id}
                    className="overflow-hidden hover:shadow-lg transition-shadow duration-300 border border-border bg-card"
                  >
                    <div className="relative h-64 bg-muted overflow-hidden group">
                      <img
                        src={product.image || "/placeholder.svg"}
                        alt={product.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      {product.stock === 0 && (
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                          <span className="text-white font-semibold">Out of Stock</span>
                        </div>
                      )}
                      {product.discountPercentage > 0 && (
                        <Badge className="absolute top-3 right-3 bg-accent text-accent-foreground">
                          -{product.discountPercentage}%
                        </Badge>
                      )}
                    </div>

                    <CardContent className="p-4">
                      <p className="text-xs text-muted-foreground mb-2">{product.category}</p>
                      <h3 className="font-semibold text-foreground mb-2 line-clamp-2">{product.title}</h3>

                      {/* Rating */}
                      <div className="flex items-center gap-1 mb-3">
                        <div className="flex items-center">
                          {Array.from({ length: Math.round(product.rating) }).map((_, i) => (
                            <Star key={i} size={14} className="fill-accent text-accent" />
                          ))}
                        </div>
                        <span className="text-xs text-muted-foreground">{product.rating}</span>
                      </div>

                      {/* Pricing */}
                      <div className="flex items-center gap-2 mb-4">
                        <span className="text-lg font-bold text-foreground">${finalPrice.toFixed(2)}</span>
                        {product.discountPercentage > 0 && (
                          <span className="text-sm text-muted-foreground line-through">
                            ${product.price.toFixed(2)}
                          </span>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2">
                        <Button
                          onClick={() => addToCart(product)}
                          disabled={product.stock === 0}
                          className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
                        >
                          <ShoppingCart size={16} className="mr-2" />
                          Add to Cart
                        </Button>
                        <Button
                          onClick={() => removeFromWishlist(product.id)}
                          variant="outline"
                          className="px-3 border-border hover:bg-muted"
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </>
        )}
      </main>
    </div>
  )
}

export default WishlistPage
