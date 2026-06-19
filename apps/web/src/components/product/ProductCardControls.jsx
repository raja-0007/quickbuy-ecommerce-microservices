"use client"

import React, { useState } from 'react'
import dynamic from 'next/dynamic'
const Heart = dynamic(() => import('lucide-react').then((mod) => mod.Heart), { ssr: false })
import { Button } from '@/components/ui/button'
import { axiosHandle } from '@/lib/api'
import customToast from '@/lib/CustomToast'

export default function ProductCardControls({ product }) {
  const [isFavorited, setIsFavorited] = useState(false)

  const toggleWishlist = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsFavorited((s) => !s)
    // optionally: call an API to persist wishlist
  }

  const addToCart = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    try {
      await axiosHandle.post('/orders/cart/addToCart', product)
      customToast({ message: 'Product added to cart!', type: 'success' })
    } catch (err) {
      console.error('Add to cart failed', err)
      customToast({ message: 'Failed to add product to cart!', type: 'error' })
    }
  }

  return (
    <div className="mt-3 flex flex-col gap-2">
      <Button
        onClick={addToCart}
        aria-label={`Add ${product.title || 'product'} to cart`}
        className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
      >
        Add to Cart
      </Button>

      <button
        onClick={toggleWishlist}
        aria-pressed={isFavorited}
        aria-label={isFavorited ? `Remove ${product.title || 'product'} from wishlist` : `Add ${product.title || 'product'} to wishlist`}
        className="self-end rounded-full bg-card p-2 shadow-md hover:bg-primary hover:text-primary-foreground transition-colors"
        type="button"
      >
        <Heart size={18} className={isFavorited ? 'fill-current text-accent' : 'text-foreground'} />
      </button>
    </div>
  )
}
