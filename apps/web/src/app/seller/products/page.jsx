'use client'

import React, { useState, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Edit2, Eye, Trash2, Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const MOCK_SELLER_ORDERS = [
  {
    _id: '69845d8b5510f78c0d30b16e',
    orderId: 'ORD-001',
    customer: 'John Doe',
    email: 'john@example.com',
    items: [
      {
        productId: '696f488435b4699c2f11f515',
        title: 'Oppo A57',
        quantity: 2,
        price: 249.99,
        image: 'https://cdn.dummyjson.com/product-images/smartphones/oppo-a57/1.webp',
      },
    ],
    totalAmount: 499.98,
    status: 'pending',
    createdAt: '2026-02-05T09:06:19.339Z',
  },
  {
    _id: '69845d8b5510f78c0d30b17e',
    orderId: 'ORD-002',
    customer: 'Jane Smith',
    email: 'jane@example.com',
    items: [
      {
        productId: '696f488435b4699c2f11f516',
        title: 'Samsung Galaxy A50',
        quantity: 1,
        price: 349.99,
        image: 'https://cdn.dummyjson.com/product-images/smartphones/samsung-a50/1.webp',
      },
      {
        productId: '696f488435b4699c2f11f520',
        title: 'Samsung Galaxy Buds Pro',
        quantity: 2,
        price: 149.99,
        image: 'https://cdn.dummyjson.com/product-images/accessories/galaxy-buds/1.webp',
      },
    ],
    totalAmount: 649.97,
    status: 'processing',
    createdAt: '2026-01-28T14:22:10.123Z',
  },
  {
    _id: '69845d8b5510f78c0d30b18e',
    orderId: 'ORD-003',
    customer: 'Mike Johnson',
    email: 'mike@example.com',
    items: [
      {
        productId: '696f488435b4699c2f11f517',
        title: 'iPhone 14 Pro',
        quantity: 1,
        price: 999.99,
        image: 'https://cdn.dummyjson.com/product-images/smartphones/iphone-14/1.webp',
      },
    ],
    totalAmount: 999.99,
    status: 'shipped',
    createdAt: '2026-01-15T10:45:33.456Z',
  },
  {
    _id: '69845d8b5510f78c0d30b19e',
    orderId: 'ORD-004',
    customer: 'Sarah Williams',
    email: 'sarah@example.com',
    items: [
      {
        productId: '696f488435b4699c2f11f515',
        title: 'Oppo A57',
        quantity: 1,
        price: 249.99,
        image: 'https://cdn.dummyjson.com/product-images/smartphones/oppo-a57/1.webp',
      },
    ],
    totalAmount: 249.99,
    status: 'delivered',
    createdAt: '2026-01-05T08:30:45.789Z',
  },
  {
    _id: '69845d8b5510f78c0d30b20e',
    orderId: 'ORD-005',
    customer: 'Robert Brown',
    email: 'robert@example.com',
    items: [
      {
        productId: '696f488435b4699c2f11f516',
        title: 'Samsung Galaxy A50',
        quantity: 3,
        price: 349.99,
        image: 'https://cdn.dummyjson.com/product-images/smartphones/samsung-a50/1.webp',
      },
    ],
    totalAmount: 1049.97,
    status: 'delivered',
    createdAt: '2025-12-28T12:15:22.456Z',
  },
]

const ORDER_STATUSES = {
  pending: { label: 'Pending', color: 'bg-yellow-500/20 text-yellow-700 dark:text-yellow-400' },
  processing: { label: 'Processing', color: 'bg-blue-500/20 text-blue-700 dark:text-blue-400' },
  shipped: { label: 'Shipped', color: 'bg-purple-500/20 text-purple-700 dark:text-purple-400' },
  delivered: { label: 'Delivered', color: 'bg-green-500/20 text-green-700 dark:text-green-400' },
}

const NEXT_STATUS = {
  pending: 'processing',
  processing: 'shipped',
  shipped: 'delivered',
  delivered: null,
}

export default function SellerOrdersPage() {
  const [orders, setOrders] = useState(MOCK_SELLER_ORDERS)
  const [filterStatus, setFilterStatus] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [showStatusDialog, setShowStatusDialog] = useState(false)

  const filteredOrders = useMemo(() => {
    let filtered = orders
    
    if (filterStatus !== 'all') {
      filtered = filtered.filter((order) => order.status === filterStatus)
    }
    
    if (searchQuery) {
      filtered = filtered.filter(
        (order) =>
          order.orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
          order.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
          order.email.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }
    
    return filtered
  }, [orders, filterStatus, searchQuery])

  const handleUpdateStatus = (orderId, newStatus) => {
    setOrders(
      orders.map((order) =>
        order._id === orderId ? { ...order, status: newStatus } : order
      )
    )
    setShowStatusDialog(false)
    setSelectedOrder(null)
  }

  const stats = {
    totalOrders: orders.length,
    pending: orders.filter((o) => o.status === 'pending').length,
    processing: orders.filter((o) => o.status === 'processing').length,
    shipped: orders.filter((o) => o.status === 'shipped').length,
    delivered: orders.filter((o) => o.status === 'delivered').length,
    totalRevenue: orders.reduce((sum, o) => sum + o.totalAmount, 0),
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-foreground">Orders</h1>
          <p className="mt-1 text-sm text-muted-foreground">Manage your orders and update statuses</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Stats Cards */}
        <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          <Card
            className="border-border bg-card cursor-pointer hover:shadow-md transition"
            onClick={() => setFilterStatus('all')}
          >
            <CardContent className="p-4">
              <p className="text-xs text-muted-foreground">Total Orders</p>
              <p className="mt-2 text-2xl font-bold text-primary">{stats.totalOrders}</p>
            </CardContent>
          </Card>
          <Card
            className="border-border bg-card cursor-pointer hover:shadow-md transition"
            onClick={() => setFilterStatus('pending')}
          >
            <CardContent className="p-4">
              <p className="text-xs text-muted-foreground">Pending</p>
              <p className="mt-2 text-2xl font-bold text-yellow-500">{stats.pending}</p>
            </CardContent>
          </Card>
          <Card
            className="border-border bg-card cursor-pointer hover:shadow-md transition"
            onClick={() => setFilterStatus('processing')}
          >
            <CardContent className="p-4">
              <p className="text-xs text-muted-foreground">Processing</p>
              <p className="mt-2 text-2xl font-bold text-blue-500">{stats.processing}</p>
            </CardContent>
          </Card>
          <Card
            className="border-border bg-card cursor-pointer hover:shadow-md transition"
            onClick={() => setFilterStatus('shipped')}
          >
            <CardContent className="p-4">
              <p className="text-xs text-muted-foreground">Shipped</p>
              <p className="mt-2 text-2xl font-bold text-purple-500">{stats.shipped}</p>
            </CardContent>
          </Card>
          <Card
            className="border-border bg-card cursor-pointer hover:shadow-md transition"
            onClick={() => setFilterStatus('delivered')}
          >
            <CardContent className="p-4">
              <p className="text-xs text-muted-foreground">Delivered</p>
              <p className="mt-2 text-2xl font-bold text-green-500">{stats.delivered}</p>
            </CardContent>
          </Card>
          <Card className="border-border bg-card">
            <CardContent className="p-4">
              <p className="text-xs text-muted-foreground">Revenue</p>
              <p className="mt-2 text-2xl font-bold text-accent">₹{stats.totalRevenue.toFixed(0)}</p>
            </CardContent>
          </Card>
        </div>

        {/* Search & Filter */}
        <Card className="mb-6 border-border bg-card">
          <CardContent className="p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
              <div className="flex-1">
                <Label className="text-foreground">Search Orders</Label>
                <div className="relative mt-2">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by order ID, customer, or email..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 border-border bg-background text-foreground"
                  />
                </div>
              </div>
              <div>
                <Label className="text-foreground">Status</Label>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="mt-2 rounded-md border border-border bg-background px-3 py-2 text-foreground"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Orders Table */}
        <Card className="border-border bg-card overflow-hidden">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-border bg-muted/50">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                      Order ID
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                      Customer
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                      Items
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                      Status
                    </th>
                    <th className="px-6 py-3 text-right text-sm font-semibold text-foreground">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="px-6 py-8 text-center">
                        <p className="text-muted-foreground">No orders found</p>
                      </td>
                    </tr>
                  ) : (
                    filteredOrders.map((order) => {
                      const statusInfo = ORDER_STATUSES[order.status]
                      const nextStatus = NEXT_STATUS[order.status]
                      
                      return (
                        <tr
                          key={order._id}
                          className="border-t border-border hover:bg-muted/50 transition"
                        >
                          <td className="px-6 py-4">
                            <p className="font-semibold text-foreground">{order.orderId}</p>
                          </td>
                          <td className="px-6 py-4">
                            <div>
                              <p className="font-medium text-foreground">{order.customer}</p>
                              <p className="text-xs text-muted-foreground">{order.email}</p>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div>
                              <p className="text-sm text-foreground font-medium">
                                {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {order.items.map((item) => item.title).join(', ')}
                              </p>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <p className="font-semibold text-foreground">
                              ₹{order.totalAmount.toFixed(2)}
                            </p>
                          </td>
                          <td className="px-6 py-4">
                            <p className="text-sm text-muted-foreground">
                              {new Date(order.createdAt).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                              })}
                            </p>
                          </td>
                          <td className="px-6 py-4">
                            <Badge className={statusInfo.color}>
                              {statusInfo.label}
                            </Badge>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setSelectedOrder(order)}
                                className="text-primary hover:bg-primary/10"
                              >
                                <Eye size={18} />
                              </Button>
                              {nextStatus && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {
                                    setSelectedOrder(order)
                                    setShowStatusDialog(true)
                                  }}
                                  className="text-primary hover:bg-primary/10"
                                >
                                  <Edit2 size={18} />
                                </Button>
                              )}
                            </div>
                          </td>
                        </tr>
                      )
                    })
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Order Details Dialog */}
      {selectedOrder && !showStatusDialog && (
        <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
          <DialogContent className="border-border bg-card max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-foreground">{selectedOrder.orderId}</DialogTitle>
              <DialogDescription>Order details and items</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              {/* Customer Info */}
              <div className="rounded-lg bg-muted/50 p-4">
                <h4 className="text-sm font-semibold text-foreground mb-2">Customer Information</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Name</p>
                    <p className="font-medium text-foreground">{selectedOrder.customer}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Email</p>
                    <p className="font-medium text-foreground">{selectedOrder.email}</p>
                  </div>
                </div>
              </div>

              {/* Items */}
              <div className="rounded-lg bg-muted/50 p-4">
                <h4 className="text-sm font-semibold text-foreground mb-3">Order Items</h4>
                <div className="space-y-2">
                  {selectedOrder.items.map((item, idx) => (
                    <div key={idx} className="flex gap-3 items-start">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="h-12 w-12 rounded object-cover"
                      />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-foreground">{item.title}</p>
                        <p className="text-xs text-muted-foreground">
                          Qty: {item.quantity} × ₹{item.price.toFixed(2)}
                        </p>
                      </div>
                      <p className="text-sm font-semibold text-foreground">
                        ₹{(item.quantity * item.price).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Total */}
              <div className="flex justify-end">
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Total Amount</p>
                  <p className="text-lg font-bold text-primary">₹{selectedOrder.totalAmount.toFixed(2)}</p>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Status Update Dialog */}
      {selectedOrder && showStatusDialog && (
        <Dialog open={showStatusDialog} onOpenChange={setShowStatusDialog}>
          <DialogContent className="border-border bg-card">
            <DialogHeader>
              <DialogTitle className="text-foreground">Update Order Status</DialogTitle>
              <DialogDescription>
                Update the status for order {selectedOrder.orderId}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="rounded-lg bg-muted/50 p-4">
                <p className="text-sm text-muted-foreground mb-2">Current Status</p>
                <Badge className={ORDER_STATUSES[selectedOrder.status].color}>
                  {ORDER_STATUSES[selectedOrder.status].label}
                </Badge>
              </div>

              {NEXT_STATUS[selectedOrder.status] && (
                <div className="rounded-lg bg-muted/50 p-4">
                  <p className="text-sm text-muted-foreground mb-2">Update To</p>
                  <Badge className={ORDER_STATUSES[NEXT_STATUS[selectedOrder.status]].color}>
                    {ORDER_STATUSES[NEXT_STATUS[selectedOrder.status]].label}
                  </Badge>
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <Button
                  onClick={() => {
                    handleUpdateStatus(selectedOrder._id, NEXT_STATUS[selectedOrder.status])
                  }}
                  className="flex-1 bg-primary hover:bg-primary/90"
                >
                  Confirm Update
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowStatusDialog(false)
                    setSelectedOrder(null)
                  }}
                  className="flex-1 border-border text-foreground hover:bg-secondary"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
