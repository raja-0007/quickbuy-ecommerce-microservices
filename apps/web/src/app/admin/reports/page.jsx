'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

const REVENUE_DATA = [
  { date: 'Jan', revenue: 45000, orders: 120 },
  { date: 'Feb', revenue: 52000, orders: 145 },
  { date: 'Mar', revenue: 48000, orders: 130 },
  { date: 'Apr', revenue: 61000, orders: 165 },
  { date: 'May', revenue: 55000, orders: 150 },
  { date: 'Jun', revenue: 67000, orders: 180 },
]

const TOP_PRODUCTS = [
  { name: 'Wireless Earbuds', sales: 450, revenue: 112500 },
  { name: 'Smartphone Case', sales: 680, revenue: 340000 },
  { name: 'Designer Handbag', sales: 125, revenue: 749875 },
  { name: 'Laptop Stand', sales: 280, revenue: 419200 },
  { name: 'LED Desk Lamp', sales: 320, revenue: 415680 },
]

const TOP_SELLERS = [
  { name: 'Home Essentials', revenue: 450000, orders: 320 },
  { name: 'Electronics Pro', revenue: 380000, orders: 280 },
  { name: 'Fashion Forward', revenue: 290000, orders: 210 },
  { name: 'TechHub Store', revenue: 215000, orders: 180 },
  { name: 'Beauty Box', revenue: 180000, orders: 150 },
]

const CATEGORY_DATA = [
  { name: 'Electronics', value: 35, fill: '#06b6d4' },
  { name: 'Fashion', value: 28, fill: '#f59e0b' },
  { name: 'Home', value: 22, fill: '#10b981' },
  { name: 'Beauty', value: 15, fill: '#8b5cf6' },
]

export default function AdminReportsPage() {
  return (
    <div className="min-h-screen bg-background p-6">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Reports & Analytics</h1>
          <p className="text-muted-foreground mt-2">Platform performance and insights</p>
        </div>

        {/* Revenue Trend */}
        <Card className="border-border bg-card mb-6">
          <CardHeader>
            <CardTitle className="text-foreground">Revenue Trend</CardTitle>
            <CardDescription>Monthly revenue and order volume</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={REVENUE_DATA}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="date" stroke="var(--color-muted-foreground)" />
                <YAxis stroke="var(--color-muted-foreground)" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--color-muted)',
                    border: '1px solid var(--color-border)',
                    borderRadius: '8px',
                  }}
                  formatter={(value) => value.toLocaleString()}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="var(--color-primary)"
                  strokeWidth={2}
                  yAxisId="left"
                />
                <YAxis yAxisId="right" orientation="right" stroke="var(--color-accent)" />
                <Line
                  type="monotone"
                  dataKey="orders"
                  stroke="var(--color-accent)"
                  strokeWidth={2}
                  yAxisId="right"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Top Products & Sellers */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Top Products */}
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="text-foreground">Top Selling Products</CardTitle>
              <CardDescription>Best performing products</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {TOP_PRODUCTS.map((product, index) => (
                  <div key={index} className="flex items-center justify-between rounded-lg border border-border p-3">
                    <div className="flex-1">
                      <p className="font-medium text-foreground">{product.name}</p>
                      <p className="text-sm text-muted-foreground">{product.sales} sales</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-foreground">₹{product.revenue.toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Top Sellers */}
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="text-foreground">Top Sellers by Revenue</CardTitle>
              <CardDescription>Highest earning sellers</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {TOP_SELLERS.map((seller, index) => (
                  <div key={index} className="flex items-center justify-between rounded-lg border border-border p-3">
                    <div className="flex-1">
                      <p className="font-medium text-foreground">{seller.name}</p>
                      <p className="text-sm text-muted-foreground">{seller.orders} orders</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-foreground">₹{seller.revenue.toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Category Distribution */}
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="text-foreground">Sales by Category</CardTitle>
            <CardDescription>Revenue distribution across categories</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={CATEGORY_DATA}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name} ${value}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {CATEGORY_DATA.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `${value}%`} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
