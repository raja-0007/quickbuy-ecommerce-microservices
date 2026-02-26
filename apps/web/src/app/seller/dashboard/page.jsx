
import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
// import dynamic from 'next/dynamic'
// const ChartsSection = dynamic(()=>import('@/components/seller_dashboard/ChartsSection'), {ssr:false})
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

import {
  TrendingUp,
  ShoppingBag,
  Users,
  DollarSign,
  AlertCircle,
  Clock,
  CheckCircle,
  Package,
  Eye,
  Star,
  Download,
} from 'lucide-react'
import ChartsSection from '@/components/seller_dashboard/ChartsSection'



const TOP_PRODUCTS = [
  {
    id: 1,
    name: 'iPhone 14 Pro',
    sales: 1250,
    revenue: 1248750,
    rating: 4.8,
    views: 5420,
  },
  {
    id: 2,
    name: 'Samsung Galaxy A50',
    sales: 980,
    revenue: 343020,
    rating: 4.6,
    views: 4230,
  },
  {
    id: 3,
    name: 'Oppo A57',
    sales: 750,
    revenue: 182937,
    rating: 4.5,
    views: 3890,
  },
]

const RECENT_ORDERS = [
  {
    id: 'ORD-001',
    customer: 'John Doe',
    product: 'iPhone 14 Pro',
    amount: 999.99,
    status: 'DELIVERED',
    date: '2026-02-25',
  },
  {
    id: 'ORD-002',
    customer: 'Jane Smith',
    product: 'Samsung Galaxy A50',
    amount: 349.99,
    status: 'PROCESSING',
    date: '2026-02-24',
  },
  {
    id: 'ORD-003',
    customer: 'Mike Johnson',
    product: 'Oppo A57',
    amount: 249.99,
    status: 'SHIPPED',
    date: '2026-02-23',
  },
  {
    id: 'ORD-004',
    customer: 'Sarah Williams',
    product: 'iPhone 14 Pro',
    amount: 999.99,
    status: 'PENDING',
    date: '2026-02-22',
  },
]



const getStatusColor = (status) => {
  switch (status) {
    case 'DELIVERED':
      return 'bg-green-500 text-white'
    case 'SHIPPED':
      return 'bg-blue-500 text-white'
    case 'PROCESSING':
      return 'bg-yellow-500 text-white'
    case 'PENDING':
      return 'bg-gray-500 text-white'
    default:
      return 'bg-gray-400 text-white'
  }
}

const KPICard = ({ icon: Icon, title, value, change, description }) => (
  <Card className="border-border bg-card hover:shadow-lg transition-shadow">
    <CardContent className="pt-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="mt-2 text-2xl font-bold text-foreground">{value}</p>
          <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
            <TrendingUp size={14} className="text-primary" />
            {change}
          </p>
        </div>
        <div className="rounded-lg bg-primary/10 p-3">
          <Icon size={24} className="text-primary" />
        </div>
      </div>
    </CardContent>
  </Card>
)

export default function SellerDashboard() {

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Welcome back! Here's your sales performance
              </p>
            </div>
            <Button className="gap-2 bg-primary hover:bg-primary/90">
              <Download size={18} />
              Export Report
            </Button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <KPICard
            icon={DollarSign}
            title="Total Revenue"
            value="₹1,82,450"
            change="+12.5% from last month"
          />
          <KPICard
            icon={ShoppingBag}
            title="Total Orders"
            value="2,425"
            change="+8.2% from last month"
          />
          <KPICard
            icon={Package}
            title="Active Products"
            value="48"
            change="+2 new products"
          />
          <KPICard
            icon={Users}
            title="Customers"
            value="1,240"
            change="+45 new customers"
          />
        </div>

        {/* Charts Section */}
        <ChartsSection/>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Recent Orders */}
          <Card className="border-border bg-card lg:col-span-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-foreground">Recent Orders</CardTitle>
                  <CardDescription>Latest customer orders</CardDescription>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-primary text-primary hover:bg-primary/10"
                >
                  View All
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {RECENT_ORDERS.map((order) => (
                  <div
                    key={order.id}
                    className="flex items-center justify-between rounded-lg border border-border bg-muted/50 p-4"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-foreground">{order.id}</p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {order.customer} • {order.product}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-foreground">₹{order.amount}</p>
                      <Badge className={`mt-1 ${getStatusColor(order.status)}`}>
                        {order.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Top Products */}
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="text-foreground">Top Products</CardTitle>
              <CardDescription>Best performing items</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {TOP_PRODUCTS.map((product) => (
                  <div
                    key={product.id}
                    className="rounded-lg border border-border bg-muted/50 p-3"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="font-medium text-foreground line-clamp-2">
                          {product.name}
                        </p>
                        <div className="mt-2 flex items-center gap-3 text-xs">
                          <span className="flex items-center gap-1 text-muted-foreground">
                            <ShoppingBag size={14} />
                            {product.sales} sales
                          </span>
                          <span className="flex items-center gap-1 text-yellow-500">
                            <Star size={14} fill="currentColor" />
                            {product.rating}
                          </span>
                        </div>
                      </div>
                    </div>
                    <p className="mt-2 text-sm font-semibold text-primary">
                      ₹{product.revenue.toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Alerts Section */}
        <Card className="border-border bg-card mt-6">
          <CardHeader>
            <CardTitle className="text-foreground">Alerts & Notifications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-start gap-3 rounded-lg border border-yellow-200 bg-yellow-50 dark:bg-yellow-900/20 dark:border-yellow-800 p-4">
                <AlertCircle size={20} className="text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-yellow-900 dark:text-yellow-200">
                    Low Stock Alert
                  </p>
                  <p className="mt-1 text-sm text-yellow-800 dark:text-yellow-300">
                    iPhone 14 Pro has only 15 units left in stock
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 rounded-lg border border-blue-200 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-800 p-4">
                <Clock size={20} className="text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-blue-900 dark:text-blue-200">
                    Pending Orders
                  </p>
                  <p className="mt-1 text-sm text-blue-800 dark:text-blue-300">
                    You have 12 orders awaiting processing
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
