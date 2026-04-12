'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Heart, ShoppingCart, Star, Trash2, ChevronLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { axiosHandle } from '@/lib/api'
import customToast from '@/lib/CustomToast'

const WishlistPage = () => {
  // Wishlist is managed client-side (no backend wishlist service).
  // Items are added via the heart icon on product/search pages.
  const [items, setItems] = useState([])

  const removeFromWishlist = (id) => {
    setItems(items.filter((item) => item._id !== id))
  }

  const addToCart = async (product) => {
    try {
      await axiosHandle.post('/orders/cart/addToCart', product)
      customToast({ message: `${product.title} added to cart!`, type: 'success' })
    } catch {
      customToast({ message: 'Failed to add to cart', type: 'error' })
    }
  }

  return (
    <div className="min-h-screen bg-background">
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
            <p className="text-muted-foreground mb-6">Start adding items you love from the product pages</p>
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

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {items.map((product) => {
                const finalPrice = product.price - (product.price * (product.discountPercentage || 0)) / 100
                return (
                  <Card
                    key={product._id}
                    className="overflow-hidden hover:shadow-lg transition-shadow duration-300 border border-border bg-card"
                  >
                    <div className="relative h-64 bg-muted overflow-hidden group">
                      <img
                        src={product.thumbnail || product.image || '/placeholder.svg'}
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

                      <div className="flex items-center gap-1 mb-3">
                        <div className="flex items-center">
                          {Array.from({ length: Math.round(product.rating || 0) }).map((_, i) => (
                            <Star key={i} size={14} className="fill-accent text-accent" />
                          ))}
                        </div>
                        <span className="text-xs text-muted-foreground">{product.rating}</span>
                      </div>

                      <div className="flex items-center gap-2 mb-4">
                        <span className="text-lg font-bold text-foreground">${finalPrice.toFixed(2)}</span>
                        {product.discountPercentage > 0 && (
                          <span className="text-sm text-muted-foreground line-through">
                            ${product.price.toFixed(2)}
                          </span>
                        )}
                      </div>

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
                          onClick={() => removeFromWishlist(product._id)}
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
