'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { Users, ShoppingBag, Package, TrendingUp, Settings, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { axiosHandle } from '@/lib/api'

export default function AdminDashboard() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [usersRes, productsRes, ordersRes] = await Promise.all([
          axiosHandle.get('/users/getAllUsers'),
          axiosHandle.get('/products/get-products'),
          axiosHandle.get('/orders/getAllOrders'),
        ])

        const users = Array.isArray(usersRes.data) ? usersRes.data : usersRes.data.users || []
        const products = productsRes.data?.products || productsRes.data || []
        const orders = Array.isArray(ordersRes.data) ? ordersRes.data : ordersRes.data.orders || []

        const totalRevenue = orders.reduce((sum, o) => sum + (o.priceDetails?.total || 0), 0)

        setStats({
          totalUsers: users.length,
          totalSellers: users.filter((u) => u.role === 'seller').length,
          totalProducts: products.length,
          totalOrders: orders.length,
          totalRevenue,
          recentOrders: orders.slice(-5).reverse(),
          recentUsers: users.slice(-4).reverse(),
        })
      } catch {
        // fail silently, show zeros
        setStats({ totalUsers: 0, totalSellers: 0, totalProducts: 0, totalOrders: 0, totalRevenue: 0, recentOrders: [], recentUsers: [] })
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [])

  const getStatusColor = (status) => {
    const colors = {
      CREATED: 'bg-yellow-500 text-white',
      SHIPPED: 'bg-purple-500 text-white',
      IN_TRANSIT: 'bg-blue-500 text-white',
      DELIVERED: 'bg-green-500 text-white',
      CANCELLED: 'bg-red-500 text-white',
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

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground">Admin Dashboard</h1>
          <p className="text-muted-foreground mt-2">Platform overview and management</p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-5 mb-8">
          <Card className="border-border bg-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Users</p>
                  <p className="text-2xl font-bold text-foreground">{stats.totalUsers}</p>
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
                  <p className="text-2xl font-bold text-foreground">{stats.totalSellers}</p>
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
                  <p className="text-2xl font-bold text-foreground">{stats.totalProducts}</p>
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
                  <p className="text-2xl font-bold text-foreground">{stats.totalOrders}</p>
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
                  <p className="text-2xl font-bold text-foreground">
                    ${(stats.totalRevenue / 1000).toFixed(1)}K
                  </p>
                </div>
                <TrendingUp className="h-8 w-8 text-accent" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="text-foreground">Recent Orders</CardTitle>
              <CardDescription>Latest platform orders</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {stats.recentOrders.length === 0 && (
                  <p className="text-muted-foreground text-sm">No orders yet</p>
                )}
                {stats.recentOrders.map((order) => (
                  <div key={order._id} className="flex items-center justify-between rounded-lg border border-border p-3">
                    <div>
                      <p className="font-medium text-foreground text-xs">{order.orderId || order._id}</p>
                      <p className="text-sm text-muted-foreground">{order.authUserId}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-foreground">${order.priceDetails?.total || 0}</p>
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

          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="text-foreground">Recent Users</CardTitle>
              <CardDescription>Latest user registrations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {stats.recentUsers.length === 0 && (
                  <p className="text-muted-foreground text-sm">No users yet</p>
                )}
                {stats.recentUsers.map((user) => (
                  <div key={user._id} className="flex items-center justify-between rounded-lg border border-border p-3">
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
