'use client'

import React, { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  TrendingUp, ShoppingBag, Users, DollarSign,
  AlertCircle, Clock, Package, Star, Download, Loader2,
} from 'lucide-react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  Legend, ResponsiveContainer, PieChart, Pie, Cell,
} from 'recharts'
import { Card as ChartCard, CardContent as ChartContent, CardDescription as ChartDesc, CardHeader as ChartHeader, CardTitle as ChartTitle } from '@/components/ui/card'
import { axiosHandle } from '@/lib/api'

const PIE_COLORS = ['oklch(0.55 0.15 180)', 'oklch(0.65 0.12 50)', 'oklch(0.7 0.1 110)', 'oklch(0.6 0.13 300)']

const getStatusColor = (status) => {
  const colors = {
    DELIVERED: 'bg-green-500 text-white',
    SHIPPED: 'bg-blue-500 text-white',
    IN_TRANSIT: 'bg-purple-500 text-white',
    CREATED: 'bg-yellow-500 text-white',
    CANCELLED: 'bg-red-500 text-white',
  }
  return colors[status] || 'bg-gray-400 text-white'
}

const KPICard = ({ icon: Icon, title, value, sub }) => (
  <Card className="border-border bg-card hover:shadow-lg transition-shadow">
    <CardContent className="pt-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="mt-2 text-2xl font-bold text-foreground">{value}</p>
          {sub && <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground"><TrendingUp size={14} className="text-primary" />{sub}</p>}
        </div>
        <div className="rounded-lg bg-primary/10 p-3">
          <Icon size={24} className="text-primary" />
        </div>
      </div>
    </CardContent>
  </Card>
)

export default function SellerDashboard() {
  const { data: session, status } = useSession()
  const [loading, setLoading] = useState(true)
  const [products, setProducts] = useState([])
  const [orders, setOrders] = useState([])
  const [salesData, setSalesData] = useState([])
  const [categoryData, setCategoryData] = useState([])

  useEffect(() => {
    if (status === 'loading' || !session?.user?.id) return

    const fetchData = async () => {
      try {
        const [productsRes, ordersRes] = await Promise.all([
          axiosHandle.get('/products/get-products', {
            params: { sellerUserId: session.user.id, limit: 200 },
          }),
          axiosHandle.get('/orders/getUserOrders'),
        ])

        const prods = productsRes.data?.products || []
        const ords = Array.isArray(ordersRes.data) ? ordersRes.data : ordersRes.data?.orders || []

        setProducts(prods)
        setOrders(ords)

        // Build monthly sales from orders
        const monthMap = {}
        ords.forEach((o) => {
          const d = new Date(o.createdAt)
          const key = d.toLocaleString('default', { month: 'short' })
          if (!monthMap[key]) monthMap[key] = { month: key, sales: 0, orders: 0 }
          monthMap[key].sales += o.priceDetails?.total || 0
          monthMap[key].orders += 1
        })
        setSalesData(Object.values(monthMap).slice(-6))

        // Category distribution from products
        const catMap = {}
        prods.forEach((p) => {
          const cat = p.category || 'Other'
          catMap[cat] = (catMap[cat] || 0) + 1
        })
        const total = prods.length || 1
        setCategoryData(
          Object.entries(catMap).map(([name, count], i) => ({
            name,
            value: Math.round((count / total) * 100),
            fill: PIE_COLORS[i % PIE_COLORS.length],
          }))
        )
      } catch {
        // fail silently
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [session?.user?.id, status])

  if (loading || status === 'loading') {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  const totalRevenue = orders.reduce((sum, o) => sum + (o.priceDetails?.total || 0), 0)
  const activeProducts = products.filter((p) => p.availabilityStatus !== 'blocked').length
  const lowStockProducts = products.filter((p) => Number(p.stock) < 10)
  const recentOrders = orders.slice(-5).reverse()

  // Top products by appearance in orders
  const productSalesMap = {}
  orders.forEach((o) => {
    o.items?.forEach((item) => {
      const id = item.productId
      if (!productSalesMap[id]) productSalesMap[id] = { name: item.title, sales: 0, revenue: 0, rating: null }
      productSalesMap[id].sales += item.quantity || 1
      productSalesMap[id].revenue += item.itemTotal || item.totalPrice || 0
    })
  })
  const topProducts = Object.values(productSalesMap).sort((a, b) => b.revenue - a.revenue).slice(0, 3)

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border bg-card">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Welcome back, {session?.user?.name}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <KPICard icon={DollarSign} title="Total Revenue" value={`$${totalRevenue.toLocaleString()}`} />
          <KPICard icon={ShoppingBag} title="Total Orders" value={orders.length} />
          <KPICard icon={Package} title="Active Products" value={activeProducts} />
          <KPICard icon={AlertCircle} title="Low Stock" value={lowStockProducts.length} sub="products below 10 units" />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 mb-8">
          <Card className="border-border bg-card lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-foreground">Sales Overview</CardTitle>
              <CardDescription>Monthly revenue and order trends</CardDescription>
            </CardHeader>
            <CardContent>
              {salesData.length === 0 ? (
                <p className="text-muted-foreground text-sm">No order data yet</p>
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={salesData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis dataKey="month" stroke="var(--muted-foreground)" />
                    <YAxis stroke="var(--muted-foreground)" />
                    <Tooltip contentStyle={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }} />
                    <Legend />
                    <Bar dataKey="sales" fill="oklch(0.55 0.15 180)" />
                    <Bar dataKey="orders" fill="oklch(0.65 0.12 50)" />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>

          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="text-foreground">Product Distribution</CardTitle>
              <CardDescription>By category</CardDescription>
            </CardHeader>
            <CardContent>
              {categoryData.length === 0 ? (
                <p className="text-muted-foreground text-sm">No products yet</p>
              ) : (
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie data={categoryData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} dataKey="value" label={({ name, value }) => `${name} ${value}%`}>
                      {categoryData.map((entry, i) => (
                        <Cell key={i} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <Card className="border-border bg-card lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-foreground">Recent Orders</CardTitle>
              <CardDescription>Latest customer orders</CardDescription>
            </CardHeader>
            <CardContent>
              {recentOrders.length === 0 ? (
                <p className="text-muted-foreground text-sm">No orders yet</p>
              ) : (
                <div className="space-y-3">
                  {recentOrders.map((order) => (
                    <div key={order._id} className="flex items-center justify-between rounded-lg border border-border bg-muted/50 p-4">
                      <div className="flex-1">
                        <p className="font-medium text-foreground text-xs">{order.orderId || order._id}</p>
                        <p className="mt-1 text-sm text-muted-foreground">
                          {order.items?.length || 0} item(s)
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-foreground">${order.priceDetails?.total || 0}</p>
                        <Badge className={`mt-1 ${getStatusColor(order.status)}`}>{order.status}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="text-foreground">Top Products</CardTitle>
              <CardDescription>Best performing items</CardDescription>
            </CardHeader>
            <CardContent>
              {topProducts.length === 0 ? (
                <p className="text-muted-foreground text-sm">No sales data yet</p>
              ) : (
                <div className="space-y-4">
                  {topProducts.map((product, i) => (
                    <div key={i} className="rounded-lg border border-border bg-muted/50 p-3">
                      <p className="font-medium text-foreground line-clamp-2">{product.name}</p>
                      <div className="mt-2 flex items-center gap-3 text-xs">
                        <span className="flex items-center gap-1 text-muted-foreground">
                          <ShoppingBag size={14} />
                          {product.sales} sold
                        </span>
                      </div>
                      <p className="mt-2 text-sm font-semibold text-primary">
                        ${product.revenue.toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Low Stock Alerts */}
        {lowStockProducts.length > 0 && (
          <Card className="border-border bg-card mt-6">
            <CardHeader>
              <CardTitle className="text-foreground">Low Stock Alerts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {lowStockProducts.slice(0, 3).map((p) => (
                  <div key={p._id} className="flex items-start gap-3 rounded-lg border border-yellow-200 bg-yellow-50 dark:bg-yellow-900/20 dark:border-yellow-800 p-4">
                    <AlertCircle size={20} className="text-yellow-600 dark:text-yellow-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-yellow-900 dark:text-yellow-200">Low Stock: {p.title}</p>
                      <p className="mt-1 text-sm text-yellow-800 dark:text-yellow-300">
                        Only {p.stock} unit{p.stock !== 1 ? 's' : ''} remaining
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
