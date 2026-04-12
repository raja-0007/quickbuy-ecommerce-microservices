'use client'

import React, { useState, useMemo, useEffect } from 'react'
import { Search, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { axiosHandle } from '@/lib/api'

const ORDER_STATUSES = ['CREATED', 'SHIPPED', 'IN_TRANSIT', 'DELIVERED', 'CANCELLED']

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      setLoading(true)
      const res = await axiosHandle.get('/orders/getAllOrders')
      const data = Array.isArray(res.data) ? res.data : res.data.orders || []
      setOrders(data)
    } catch {
      setError('Failed to load orders')
    } finally {
      setLoading(false)
    }
  }

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const id = order._id || order.orderId || ''
      const userId = order.authUserId || ''
      const matchesSearch =
        id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        userId.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesStatus = statusFilter === 'all' || order.status === statusFilter
      return matchesSearch && matchesStatus
    })
  }, [orders, searchQuery, statusFilter])

  const getStatusColor = (status) => {
    const colors = {
      CREATED: 'bg-yellow-100 text-yellow-800',
      SHIPPED: 'bg-purple-100 text-purple-800',
      IN_TRANSIT: 'bg-blue-100 text-blue-800',
      DELIVERED: 'bg-green-100 text-green-800',
      CANCELLED: 'bg-red-100 text-red-800',
    }
    return colors[status] || 'bg-gray-100 text-gray-800'
  }

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      await axiosHandle.put(`/orders/updateOrder/${orderId}`, { status: newStatus })
      setOrders(orders.map((o) => (o._id === orderId ? { ...o, status: newStatus } : o)))
    } catch {
      alert('Failed to update order status')
    }
  }

  const statusStats = ORDER_STATUSES.map((status) => ({
    status,
    count: orders.filter((o) => o.status === status).length,
  }))

  const totalRevenue = orders.reduce((sum, o) => sum + (o.priceDetails?.total || 0), 0)

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-red-500">{error}</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Order Management</h1>
          <p className="text-muted-foreground mt-2">Monitor and manage all platform orders</p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-4 mb-8">
          <Card className="border-border bg-card">
            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground">Total Orders</p>
              <p className="text-2xl font-bold text-foreground">{orders.length}</p>
            </CardContent>
          </Card>
          <Card className="border-border bg-card">
            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground">Total Revenue</p>
              <p className="text-2xl font-bold text-foreground">
                ${(totalRevenue / 1000).toFixed(1)}K
              </p>
            </CardContent>
          </Card>
          {statusStats.slice(0, 2).map((stat) => (
            <Card key={stat.status} className="border-border bg-card">
              <CardContent className="p-6">
                <p className="text-sm text-muted-foreground capitalize">{stat.status}</p>
                <p className="text-2xl font-bold text-foreground">{stat.count}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="border-border bg-card mb-6">
          <CardContent className="p-6">
            <div className="flex flex-wrap gap-2">
              <Button
                variant={statusFilter === 'all' ? 'default' : 'outline'}
                className={statusFilter === 'all' ? 'bg-primary' : 'border-primary text-primary'}
                onClick={() => setStatusFilter('all')}
              >
                All ({orders.length})
              </Button>
              {statusStats.map((stat) => (
                <Button
                  key={stat.status}
                  variant={statusFilter === stat.status ? 'default' : 'outline'}
                  className={statusFilter === stat.status ? 'bg-primary' : 'border-primary text-primary'}
                  onClick={() => setStatusFilter(stat.status)}
                >
                  {stat.status} ({stat.count})
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-border bg-card mb-6">
          <CardContent className="p-6">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Search by order ID or user ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="text-foreground">All Orders</CardTitle>
            <CardDescription>{filteredOrders.length} orders found</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-foreground">Order ID</TableHead>
                    <TableHead className="text-foreground">User</TableHead>
                    <TableHead className="text-foreground">Amount</TableHead>
                    <TableHead className="text-foreground">Items</TableHead>
                    <TableHead className="text-foreground">Status</TableHead>
                    <TableHead className="text-foreground">Date</TableHead>
                    <TableHead className="text-foreground">Update</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrders.map((order) => (
                    <TableRow key={order._id} className="border-border">
                      <TableCell className="font-medium text-foreground text-xs">
                        {order.orderId || order._id}
                      </TableCell>
                      <TableCell className="text-muted-foreground text-xs">
                        {order.authUserId}
                      </TableCell>
                      <TableCell className="font-semibold text-foreground">
                        ${order.priceDetails?.total || 0}
                      </TableCell>
                      <TableCell className="text-foreground">
                        {order.items?.length || 0} items
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(order.status)}>{order.status}</Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : '—'}
                      </TableCell>
                      <TableCell>
                        <Select
                          value={order.status}
                          onValueChange={(newStatus) => handleUpdateStatus(order._id, newStatus)}
                        >
                          <SelectTrigger className="w-36">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {ORDER_STATUSES.map((status) => (
                              <SelectItem key={status} value={status}>
                                {status}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
