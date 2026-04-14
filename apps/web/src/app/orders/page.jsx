'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Clock, ChevronLeft } from 'lucide-react'
import { axiosHandle } from '@/lib/api'

export default function OrdersPage() {
    const [orders, setOrders] = useState([])
    const getOrders = async () => {
        try {
            const res = await axiosHandle.get(`/orders/getUserOrders`)
            console.log('Fetched orders:', res.data)
            setOrders(res.data)
        } catch (err) {
            console.log('Error fetching orders:', err)
        }
    }

    useEffect(() => {
        getOrders()
    }, [])

    return (
        <main className="min-h-screen bg-background text-foreground">
            {/* Header */}
            <div className="border-b border-border bg-card">
                <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
                    <div className="flex items-center gap-4">
                        <Link href="/profile">
                            <Button variant="ghost" size="icon" className="hover:bg-secondary">
                                <ChevronLeft size={20} />
                            </Button>
                        </Link>
                        <div>
                            <h1 className="text-3xl font-bold text-foreground">All Orders</h1>
                            <p className="mt-1 text-sm text-muted-foreground">
                                {orders.length} orders total
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Orders List */}
            <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
                <div className="space-y-6">
                    {orders.map((order) => (
                        <div key={order._id} className="rounded-lg border border-border bg-card p-6">
                            {/* Order Header */}
                            <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                                <div>
                                    <p className="text-lg font-semibold text-foreground">
                                        Order ID: {order._id.slice(0, 8)}
                                    </p>
                                    <div className="mt-2 flex items-center gap-2">
                                        <Clock size={16} className="text-muted-foreground" />
                                        <span className="text-sm text-muted-foreground">
                                            {new Date(order.createdAt).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric',
                                            })}
                                        </span>
                                    </div>
                                </div>
                                <Badge
                                    className={`${order.status === 'DELIVERED'
                                            ? 'bg-green-500 text-white'
                                            : 'bg-amber-500 text-white'
                                        }`}
                                >
                                    {order.status === 'DELIVERED' ? 'Delivered' : 'Processing'}
                                </Badge>
                            </div>

                            {/* Order Items Grid */}
                            <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                                {order.items.map((item, idx) => (
                                    <div
                                        key={idx}
                                        className="group flex flex-col rounded-lg border border-border bg-muted/50 p-3 transition-all hover:border-primary hover:shadow-md"
                                    >
                                        {/* Product Image */}
                                        <div className="relative mb-3 overflow-hidden rounded bg-background">
                                            <img
                                                src={item.imageUrl || '/placeholder.svg'}
                                                alt={item.title}
                                                className="h-28 w-full object-cover transition-transform group-hover:scale-105"
                                            />
                                            {item.discountPercentage > 0 && (
                                                <div className="absolute right-1 top-1 rounded bg-accent px-1.5 py-0.5 text-xs font-semibold text-accent-foreground">
                                                    -{item.discountPercentage.toFixed(0)}%
                                                </div>
                                            )}
                                        </div>

                                        {/* Product Info */}
                                        <div className="flex flex-1 flex-col">
                                            <p className="text-xs font-semibold text-foreground line-clamp-2">
                                                {item.title}
                                            </p>
                                            <p className="mt-0.5 text-xs text-muted-foreground">{item.brand}</p>
                                            <p className="mt-1 text-xs font-medium text-primary">
                                                Qty: {item.quantity}
                                            </p>

                                            {/* Price */}
                                            <div className="mt-auto pt-2">
                                                <p className="text-xs font-bold text-foreground">
                                                    ${item.totalPrice.toFixed(2)}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Action Buttons */}
                                        <div className="mt-3 flex flex-col gap-1">
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                className="h-8 text-xs border-primary text-primary hover:bg-primary/10 bg-transparent"
                                            >
                                                View Item
                                            </Button>
                                            {order.status === 'DELIVERED' && (
                                                <Button
                                                    size="sm"
                                                    className="h-8 text-xs bg-accent hover:bg-accent/90 text-accent-foreground"
                                                >
                                                    Buy Again
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Price Summary & Payment */}
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                                {/* Price Details */}
                                <div className="rounded-lg bg-muted/30 p-4">
                                    <p className="mb-3 text-sm font-semibold text-foreground">Pricing</p>
                                    <div className="space-y-2 text-xs">
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Subtotal</span>
                                            <span className="font-medium text-foreground">
                                                ${order.priceDetails.subTotal.toFixed(2)}
                                            </span>
                                        </div>
                                        {order.priceDetails.tax > 0 && (
                                            <div className="flex justify-between">
                                                <span className="text-muted-foreground">Tax</span>
                                                <span className="font-medium text-foreground">
                                                    ${order.priceDetails.tax.toFixed(2)}
                                                </span>
                                            </div>
                                        )}
                                        {order.priceDetails.shipping > 0 && (
                                            <div className="flex justify-between">
                                                <span className="text-muted-foreground">Shipping</span>
                                                <span className="font-medium text-foreground">
                                                    ${order.priceDetails.shipping.toFixed(2)}
                                                </span>
                                            </div>
                                        )}
                                        <div className="border-t border-border pt-2 flex justify-between font-semibold">
                                            <span className="text-foreground">Total</span>
                                            <span className="text-primary">${order.priceDetails.total.toFixed(2)}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Payment Info */}
                                <div className="rounded-lg bg-muted/30 p-4">
                                    <p className="mb-3 text-sm font-semibold text-foreground">Payment</p>
                                    <div className="space-y-2 text-xs">
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Method</span>
                                            <span className="font-medium text-foreground">
                                                {order.paymentDetails.method}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Amount</span>
                                            <span className="font-medium text-foreground">
                                                ${order.paymentDetails.amount.toFixed(2)}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between pt-2 border-t border-border">
                                            <span className="text-muted-foreground">Status</span>
                                            <Badge
                                                variant="outline"
                                                className="border-primary text-primary text-xs"
                                            >
                                                {order.paymentDetails.status}
                                            </Badge>
                                        </div>
                                    </div>
                                </div>

                                {/* Order Status */}
                                <div className="rounded-lg bg-muted/30 p-4 lg:col-span-2">
                                    <p className="mb-3 text-sm font-semibold text-foreground">Order Status</p>
                                    <div className="flex items-center gap-3">
                                        <div
                                            className={`h-3 w-3 rounded-full ${order.status === 'DELIVERED'
                                                    ? 'bg-green-500'
                                                    : 'bg-amber-500'
                                                }`}
                                        />
                                        <div>
                                            <p className="text-sm font-medium text-foreground">
                                                {order.status === 'DELIVERED' ? 'Delivered' : 'In Transit'}
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                {order.status === 'DELIVERED'
                                                    ? 'Your order has been delivered'
                                                    : 'Your order is on its way'}
                                            </p>
                                        </div>
                                    </div>
                                    {order.status !== 'DELIVERED' && (
                                        <Button
                                            size="sm"
                                            className="mt-3 w-full bg-accent hover:bg-accent/90 text-accent-foreground"
                                        >
                                            Check Delivery Status
                                        </Button>
                                    )}
                                </div>
                            </div>

                            {/* Order Actions */}
                            {order.status === 'DELIVERED' && (
                                <div className="mt-4 flex gap-2">
                                    <Button
                                        size="sm"
                                        className="flex-1 bg-primary hover:bg-primary/90"
                                    >
                                        Buy All Items Again
                                    </Button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </main>
    )
}
