
import React from 'react'
import Link from 'next/link'
import { Users, ShoppingBag, Package, TrendingUp, AlertCircle, Settings } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

const MOCK_STATS = {
  totalUsers: 2543,
  totalSellers: 148,
  totalProducts: 8392,
  totalOrders: 15284,
  totalRevenue: 524890,
  recentOrders: [
    { id: 'ORD001', customer: 'John Doe', amount: 2499, status: 'completed' },
    { id: 'ORD002', customer: 'Jane Smith', amount: 1850, status: 'processing' },
    { id: 'ORD003', customer: 'Mike Johnson', amount: 3200, status: 'pending' },
    { id: 'ORD004', customer: 'Sarah Williams', amount: 1599, status: 'completed' },
    { id: 'ORD005', customer: 'Tom Brown', amount: 2150, status: 'shipped' },
  ],
  recentUsers: [
    { id: 'U001', name: 'Alice Johnson', email: 'alice@example.com', role: 'user', joinDate: '2026-02-20' },
    { id: 'U002', name: 'Bob Smith', email: 'bob@example.com', role: 'seller', joinDate: '2026-02-19' },
    { id: 'U003', name: 'Carol Davis', email: 'carol@example.com', role: 'user', joinDate: '2026-02-18' },
    { id: 'U004', name: 'David Lee', email: 'david@example.com', role: 'user', joinDate: '2026-02-17' },
  ],
}

export default function AdminDashboard() {
  const getStatusColor = (status) => {
    const colors = {
      completed: 'bg-green-500 text-white',
      processing: 'bg-blue-500 text-white',
      pending: 'bg-yellow-500 text-white',
      shipped: 'bg-purple-500 text-white',
    }
    return colors[status] || 'bg-gray-500 text-white'
  }

  const getRoleColor = (role) => {
    const colors = {
      admin: 'bg-red-100 text-red-800',
      seller: 'bg-blue-100 text-blue-800',
      user: 'bg-gray-100 text-gray-800',
    }
    return colors[role] || 'bg-gray-100 text-gray-800'
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground">Admin Dashboard</h1>
          <p className="text-muted-foreground mt-2">Platform overview and management</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-5 mb-8">
          <Card className="border-border bg-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Users</p>
                  <p className="text-2xl font-bold text-foreground">{MOCK_STATS.totalUsers}</p>
                </div>
                <Users className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-border bg-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Sellers</p>
                  <p className="text-2xl font-bold text-foreground">{MOCK_STATS.totalSellers}</p>
                </div>
                <ShoppingBag className="h-8 w-8 text-accent" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-border bg-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Products</p>
                  <p className="text-2xl font-bold text-foreground">{MOCK_STATS.totalProducts}</p>
                </div>
                <Package className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-border bg-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Orders</p>
                  <p className="text-2xl font-bold text-foreground">{MOCK_STATS.totalOrders}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-border bg-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Revenue</p>
                  <p className="text-2xl font-bold text-foreground">₹{(MOCK_STATS.totalRevenue / 1000).toFixed(1)}K</p>
                </div>
                <TrendingUp className="h-8 w-8 text-accent" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Orders */}
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="text-foreground">Recent Orders</CardTitle>
              <CardDescription>Latest platform orders</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {MOCK_STATS.recentOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between rounded-lg border border-border p-3">
                    <div>
                      <p className="font-medium text-foreground">{order.id}</p>
                      <p className="text-sm text-muted-foreground">{order.customer}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-foreground">₹{order.amount}</p>
                      <Badge className={getStatusColor(order.status)}>{order.status}</Badge>
                    </div>
                  </div>
                ))}
              </div>
              <Link href="/admin/orders">
                <Button className="mt-4 w-full bg-primary hover:bg-primary/90">View All Orders</Button>
              </Link>
            </CardContent>
          </Card>

          {/* Recent Users */}
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="text-foreground">Recent Users</CardTitle>
              <CardDescription>Latest user registrations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {MOCK_STATS.recentUsers.map((user) => (
                  <div key={user.id} className="flex items-center justify-between rounded-lg border border-border p-3">
                    <div>
                      <p className="font-medium text-foreground">{user.name}</p>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                    </div>
                    <Badge className={getRoleColor(user.role)}>{user.role}</Badge>
                  </div>
                ))}
              </div>
              <Link href="/admin/users">
                <Button className="mt-4 w-full bg-primary hover:bg-primary/90">Manage Users</Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="border-border bg-card mt-6">
          <CardHeader>
            <CardTitle className="text-foreground">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
              <Link href="/admin/users">
                <Button variant="outline" className="w-full border-primary text-primary hover:bg-primary/10">
                  <Users className="mr-2 h-4 w-4" />
                  Users
                </Button>
              </Link>
              <Link href="/admin/sellers">
                <Button variant="outline" className="w-full border-primary text-primary hover:bg-primary/10">
                  <ShoppingBag className="mr-2 h-4 w-4" />
                  Sellers
                </Button>
              </Link>
              <Link href="/admin/products">
                <Button variant="outline" className="w-full border-primary text-primary hover:bg-primary/10">
                  <Package className="mr-2 h-4 w-4" />
                  Products
                </Button>
              </Link>
              <Link href="/admin/settings">
                <Button variant="outline" className="w-full border-primary text-primary hover:bg-primary/10">
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
