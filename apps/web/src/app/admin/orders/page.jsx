'use client'

import React, { useState, useMemo } from 'react'
import { Search, Eye, CheckCircle } from 'lucide-react'
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

const MOCK_ORDERS = [
  { id: 'ORD001', customer: 'John Doe', email: 'john@example.com', amount: 2499, items: 1, status: 'completed', date: '2026-02-20' },
  { id: 'ORD002', customer: 'Jane Smith', email: 'jane@example.com', amount: 1850, items: 2, status: 'processing', date: '2026-02-19' },
  { id: 'ORD003', customer: 'Mike Johnson', email: 'mike@example.com', amount: 3200, items: 3, status: 'pending', date: '2026-02-18' },
  { id: 'ORD004', customer: 'Sarah Williams', email: 'sarah@example.com', amount: 1599, items: 1, status: 'shipped', date: '2026-02-17' },
  { id: 'ORD005', customer: 'Tom Brown', email: 'tom@example.com', amount: 2150, items: 2, status: 'completed', date: '2026-02-16' },
  { id: 'ORD006', customer: 'Emma Davis', email: 'emma@example.com', amount: 4500, items: 5, status: 'paid', date: '2026-02-15' },
  { id: 'ORD007', customer: 'Robert Wilson', email: 'robert@example.com', amount: 1200, items: 1, status: 'pending', date: '2026-02-14' },
  { id: 'ORD008', customer: 'Lisa Anderson', email: 'lisa@example.com', amount: 3799, items: 3, status: 'shipped', date: '2026-02-13' },
]

const ORDER_STATUSES = ['cart', 'created', 'paid', 'processing', 'shipped', 'completed']

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState(MOCK_ORDERS)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchesSearch =
        order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.email.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesStatus = statusFilter === 'all' || order.status === statusFilter
      return matchesSearch && matchesStatus
    })
  }, [orders, searchQuery, statusFilter])

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      processing: 'bg-blue-100 text-blue-800',
      shipped: 'bg-purple-100 text-purple-800',
      completed: 'bg-green-100 text-green-800',
      paid: 'bg-cyan-100 text-cyan-800',
      cart: 'bg-gray-100 text-gray-800',
    }
    return colors[status] || 'bg-gray-100 text-gray-800'
  }

  const handleUpdateStatus = (orderId, newStatus) => {
    setOrders(orders.map((o) =>
      o.id === orderId ? { ...o, status: newStatus } : o
    ))
  }

  const statusStats = ORDER_STATUSES.map((status) => ({
    status,
    count: orders.filter((o) => o.status === status).length,
  }))

  const totalRevenue = orders.reduce((sum, o) => sum + o.amount, 0)

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Order Management</h1>
          <p className="text-muted-foreground mt-2">Monitor and manage all platform orders</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-5 mb-8">
          <Card className="border-border bg-card">
            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground">Total Orders</p>
              <p className="text-2xl font-bold text-foreground">{orders.length}</p>
            </CardContent>
          </Card>
          <Card className="border-border bg-card">
            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground">Total Revenue</p>
              <p className="text-2xl font-bold text-foreground">₹{(totalRevenue / 1000).toFixed(1)}K</p>
            </CardContent>
          </Card>
          {statusStats.slice(0, 3).map((stat) => (
            <Card key={stat.status} className="border-border bg-card">
              <CardContent className="p-6">
                <p className="text-sm text-muted-foreground capitalize">{stat.status}</p>
                <p className="text-2xl font-bold text-foreground">{stat.count}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Status Filter Tags */}
        <Card className="border-border bg-card mb-6">
          <CardContent className="p-6">
            <div className="flex flex-wrap gap-2">
              <Button
                variant={statusFilter === 'all' ? 'default' : 'outline'}
                className={statusFilter === 'all' ? 'bg-primary' : 'border-primary text-primary'}
                onClick={() => setStatusFilter('all')}
              >
                All Orders ({orders.length})
              </Button>
              {statusStats.map((stat) => (
                <Button
                  key={stat.status}
                  variant={statusFilter === stat.status ? 'default' : 'outline'}
                  className={statusFilter === stat.status ? 'bg-primary' : 'border-primary text-primary'}
                  onClick={() => setStatusFilter(stat.status)}
                >
                  {stat.status.charAt(0).toUpperCase() + stat.status.slice(1)} ({stat.count})
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Search */}
        <Card className="border-border bg-card mb-6">
          <CardContent className="p-6">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Search by order ID, customer, or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Orders Table */}
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
                    <TableHead className="text-foreground">Customer</TableHead>
                    <TableHead className="text-foreground">Amount</TableHead>
                    <TableHead className="text-foreground">Items</TableHead>
                    <TableHead className="text-foreground">Status</TableHead>
                    <TableHead className="text-foreground">Date</TableHead>
                    <TableHead className="text-foreground">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrders.map((order) => (
                    <TableRow key={order.id} className="border-border">
                      <TableCell className="font-medium text-foreground">{order.id}</TableCell>
                      <TableCell>
                        <div className="text-foreground">
                          <p className="font-medium">{order.customer}</p>
                          <p className="text-sm text-muted-foreground">{order.email}</p>
                        </div>
                      </TableCell>
                      <TableCell className="font-semibold text-foreground">₹{order.amount}</TableCell>
                      <TableCell className="text-foreground">{order.items} items</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(order.status)}>{order.status}</Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{order.date}</TableCell>
                      <TableCell>
                        <Select value={order.status} onValueChange={(newStatus) => handleUpdateStatus(order.id, newStatus)}>
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {ORDER_STATUSES.map((status) => (
                              <SelectItem key={status} value={status}>
                                {status.charAt(0).toUpperCase() + status.slice(1)}
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
