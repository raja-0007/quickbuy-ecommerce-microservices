'use client'

import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2 } from 'lucide-react'
import {
  LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts'
import { axiosHandle } from '@/lib/api'

const PIE_COLORS = ['#06b6d4', '#f59e0b', '#10b981', '#8b5cf6', '#ef4444', '#f97316']

export default function AdminReportsPage() {
  const [revenueData, setRevenueData] = useState([])
  const [topProducts, setTopProducts] = useState([])
  const [categoryData, setCategoryData] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ordersRes, productsRes] = await Promise.all([
          axiosHandle.get('/orders/getAllOrders'),
          axiosHandle.get('/products/get-products'),
        ])

        const orders = Array.isArray(ordersRes.data) ? ordersRes.data : ordersRes.data.orders || []
        const products = productsRes.data?.products || productsRes.data || []

        // Revenue by month
        const monthMap = {}
        orders.forEach((o) => {
          const date = new Date(o.createdAt)
          const key = date.toLocaleString('default', { month: 'short', year: '2-digit' })
          if (!monthMap[key]) monthMap[key] = { date: key, revenue: 0, orders: 0 }
          monthMap[key].revenue += o.priceDetails?.total || 0
          monthMap[key].orders += 1
        })
        setRevenueData(Object.values(monthMap).slice(-6))

        // Top products by sales count from order items
        const productSalesMap = {}
        orders.forEach((o) => {
          o.items?.forEach((item) => {
            const id = item.productId
            if (!productSalesMap[id]) {
              productSalesMap[id] = { name: item.title, sales: 0, revenue: 0 }
            }
            productSalesMap[id].sales += item.quantity || 1
            productSalesMap[id].revenue += item.itemTotal || item.totalPrice || 0
          })
        })
        const sorted = Object.values(productSalesMap).sort((a, b) => b.revenue - a.revenue).slice(0, 5)
        setTopProducts(sorted)

        // Category distribution from products
        const catMap = {}
        products.forEach((p) => {
          const cat = p.category || 'Other'
          catMap[cat] = (catMap[cat] || 0) + 1
        })
        const total = products.length || 1
        const catArr = Object.entries(catMap).map(([name, count], i) => ({
          name,
          value: Math.round((count / total) * 100),
          fill: PIE_COLORS[i % PIE_COLORS.length],
        }))
        setCategoryData(catArr)
      } catch {
        // fail silently
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

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
          <h1 className="text-3xl font-bold text-foreground">Reports & Analytics</h1>
          <p className="text-muted-foreground mt-2">Platform performance and insights</p>
        </div>

        <Card className="border-border bg-card mb-6">
          <CardHeader>
            <CardTitle className="text-foreground">Revenue Trend</CardTitle>
            <CardDescription>Monthly revenue and order volume</CardDescription>
          </CardHeader>
          <CardContent>
            {revenueData.length === 0 ? (
              <p className="text-muted-foreground text-sm">No order data available</p>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                  <XAxis dataKey="date" stroke="var(--color-muted-foreground)" />
                  <YAxis yAxisId="left" stroke="var(--color-muted-foreground)" />
                  <YAxis yAxisId="right" orientation="right" stroke="var(--color-accent)" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'var(--color-muted)',
                      border: '1px solid var(--color-border)',
                      borderRadius: '8px',
                    }}
                    formatter={(value) => value.toLocaleString()}
                  />
                  <Legend />
                  <Line type="monotone" dataKey="revenue" stroke="var(--color-primary)" strokeWidth={2} yAxisId="left" />
                  <Line type="monotone" dataKey="orders" stroke="var(--color-accent)" strokeWidth={2} yAxisId="right" />
                </LineChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="text-foreground">Top Selling Products</CardTitle>
              <CardDescription>Best performing products by revenue</CardDescription>
            </CardHeader>
            <CardContent>
              {topProducts.length === 0 ? (
                <p className="text-muted-foreground text-sm">No sales data available</p>
              ) : (
                <div className="space-y-4">
                  {topProducts.map((product, index) => (
                    <div key={index} className="flex items-center justify-between rounded-lg border border-border p-3">
                      <div className="flex-1">
                        <p className="font-medium text-foreground">{product.name}</p>
                        <p className="text-sm text-muted-foreground">{product.sales} units sold</p>
                      </div>
                      <p className="font-semibold text-foreground">${product.revenue.toLocaleString()}</p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="text-foreground">Sales by Category</CardTitle>
              <CardDescription>Product distribution across categories</CardDescription>
            </CardHeader>
            <CardContent>
              {categoryData.length === 0 ? (
                <p className="text-muted-foreground text-sm">No product data available</p>
              ) : (
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name} ${value}%`}
                      outerRadius={80}
                      dataKey="value"
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `${value}%`} />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
