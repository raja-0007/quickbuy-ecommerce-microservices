'use client'

import React, { useState, useMemo } from 'react'
import Link from 'next/link'
import { Trash2, Plus, Minus, ChevronLeft, Lock, Truck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

const CART_ITEMS = [
  {
    id: 1,
    title: 'Premium Wireless Headphones',
    price: 199.99,
    discountPercentage: 20,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=300&fit=crop',
    quantity: 1,
  },
  {
    id: 2,
    title: 'USB-C Cable 2M',
    price: 19.99,
    discountPercentage: 0,
    image: 'https://images.unsplash.com/photo-1625948515291-69613efd103f?w=300&h=300&fit=crop',
    quantity: 2,
  },
  {
    id: 3,
    title: 'Stainless Steel Watch',
    price: 299.99,
    discountPercentage: 15,
    image: 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=300&h=300&fit=crop',
    quantity: 1,
  },
]

const CartPage = () => {
  const [cartItems, setCartItems] = useState(CART_ITEMS)

  const { subtotal, discount, tax, total } = useMemo(() => {
    const subtotal = cartItems.reduce((sum, item) => {
      return sum + item.price * item.quantity
    }, 0)

    const discount = cartItems.reduce((sum, item) => {
      const discountAmount = (item.price * item.discountPercentage) / 100 * item.quantity
      return sum + discountAmount
    }, 0)

    const tax = (subtotal - discount) * 0.1
    const total = subtotal - discount + tax

    return { subtotal, discount, tax, total }
  }, [cartItems])

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity === 0) {
      removeItem(id)
    } else {
      setCartItems(
        cartItems.map((item) => (item.id === id ? { ...item, quantity: newQuantity } : item))
      )
    }
  }

  const removeItem = (id) => {
    setCartItems(cartItems.filter((item) => item.id !== id))
  }

  const handleCheckout = () => {
    console.log('Proceeding to checkout with total:', total)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link href="/search" className="flex items-center gap-2 text-primary hover:opacity-80 transition">
            <ChevronLeft size={20} />
            <span className="text-sm font-medium">Continue Shopping</span>
          </Link>
          <h1 className="text-2xl font-bold text-foreground">Shopping Cart</h1>
          <div className="w-32"></div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {cartItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-4">
              <svg className="w-10 h-10 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-foreground mb-2">Your cart is empty</h2>
            <p className="text-muted-foreground mb-6">Add items to get started</p>
            <Link href="/search">
              <Button className="bg-primary hover:bg-primary/90">Start Shopping</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <h2 className="text-lg font-semibold text-foreground mb-4">
                {cartItems.length} item{cartItems.length !== 1 ? 's' : ''} in your cart
              </h2>

              <div className="space-y-4">
                {cartItems.map((item) => {
                  const finalPrice = item.price - (item.price * item.discountPercentage) / 100
                  const itemTotal = finalPrice * item.quantity

                  return (
                    <div key={item.id}>
                      <Card className="border border-border bg-card overflow-hidden">
                        <CardContent className="p-4">
                          <div className="flex gap-4">
                            {/* Product Image */}
                            <div className="flex-shrink-0 w-24 h-24 bg-muted rounded-lg overflow-hidden">
                              <img
                                src={item.image || "/placeholder.svg"}
                                alt={item.title}
                                className="w-full h-full object-cover"
                              />
                            </div>

                            {/* Product Details */}
                            <div className="flex-1 min-w-0">
                              <h3 className="font-semibold text-foreground mb-1">{item.title}</h3>

                              {/* Pricing */}
                              <div className="flex items-center gap-2 mb-3">
                                <span className="font-bold text-primary">${finalPrice.toFixed(2)}</span>
                                {item.discountPercentage > 0 && (
                                  <>
                                    <span className="text-sm text-muted-foreground line-through">
                                      ${item.price.toFixed(2)}
                                    </span>
                                    <span className="text-xs font-semibold text-accent">
                                      Save {item.discountPercentage}%
                                    </span>
                                  </>
                                )}
                              </div>

                              {/* Quantity Controls */}
                              <div className="flex items-center gap-2">
                                <Button
                                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                  variant="outline"
                                  size="sm"
                                  className="w-8 h-8 p-0 border-border hover:bg-muted"
                                >
                                  <Minus size={14} />
                                </Button>
                                <span className="w-8 text-center font-medium text-foreground">
                                  {item.quantity}
                                </span>
                                <Button
                                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                  variant="outline"
                                  size="sm"
                                  className="w-8 h-8 p-0 border-border hover:bg-muted"
                                >
                                  <Plus size={14} />
                                </Button>
                              </div>
                            </div>

                            {/* Item Total & Remove */}
                            <div className="flex flex-col items-end gap-4">
                              <div className="text-right">
                                <p className="text-sm text-muted-foreground mb-1">Item total</p>
                                <p className="text-lg font-bold text-foreground">${itemTotal.toFixed(2)}</p>
                              </div>
                              <Button
                                onClick={() => removeItem(item.id)}
                                variant="ghost"
                                size="sm"
                                className="text-destructive hover:bg-destructive/10"
                              >
                                <Trash2 size={16} />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="border border-border bg-card sticky top-24">
                <CardHeader>
                  <CardTitle className="text-foreground">Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Summary Items */}
                  <div className="space-y-3">
                    <div className="flex justify-between text-foreground">
                      <span>Subtotal</span>
                      <span>${subtotal.toFixed(2)}</span>
                    </div>
                    {discount > 0 && (
                      <div className="flex justify-between text-accent font-semibold">
                        <span>Discount</span>
                        <span>-${discount.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-foreground">
                      <span>Tax (10%)</span>
                      <span>${tax.toFixed(2)}</span>
                    </div>
                  </div>

                  <Separator className="bg-border" />

                  {/* Total */}
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold text-foreground">Total</span>
                    <span className="text-2xl font-bold text-primary">${total.toFixed(2)}</span>
                  </div>

                  {/* Trust Badges */}
                  <div className="space-y-2 pt-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Lock size={16} className="text-primary" />
                      <span>Secure checkout</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Truck size={16} className="text-primary" />
                      <span>Free shipping on orders over $100</span>
                    </div>
                  </div>

                  {/* Checkout Button */}
                  <Button
                    onClick={handleCheckout}
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-6 mt-4"
                  >
                    Proceed to Checkout
                  </Button>

                  {/* Continue Shopping */}
                  <Button
                    asChild
                    variant="outline"
                    className="w-full border-border hover:bg-muted bg-transparent"
                  >
                    <Link href="/search">Continue Shopping</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default CartPage
