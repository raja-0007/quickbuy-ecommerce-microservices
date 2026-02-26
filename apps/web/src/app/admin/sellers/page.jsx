'use client'

import React, { useState } from 'react'
import { Search, TrendingUp, Package, Ban, Trash2 } from 'lucide-react'
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

const MOCK_SELLERS = [
  { id: 'S001', name: 'TechHub Store', owner: 'Bob Smith', email: 'bob@tech.com', products: 45, revenue: 125000, status: 'active', joinDate: '2026-01-20' },
  { id: 'S002', name: 'Fashion Forward', owner: 'Eve Wilson', email: 'eve@fashion.com', products: 82, revenue: 245000, status: 'active', joinDate: '2026-01-28' },
  { id: 'S003', name: 'Home Essentials', owner: 'Henry Brown', email: 'henry@home.com', products: 156, revenue: 450000, status: 'active', joinDate: '2026-02-10' },
  { id: 'S004', name: 'Electronics Pro', owner: 'John Doe', email: 'john@electronics.com', products: 120, revenue: 580000, status: 'suspended', joinDate: '2025-12-15' },
  { id: 'S005', name: 'Beauty Box', owner: 'Sarah Lee', email: 'sarah@beauty.com', products: 95, revenue: 280000, status: 'active', joinDate: '2026-02-05' },
]

export default function AdminSellersPage() {
  const [sellers, setSellers] = useState(MOCK_SELLERS)
  const [searchQuery, setSearchQuery] = useState('')

  const filteredSellers = sellers.filter((seller) =>
    seller.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    seller.owner.toLowerCase().includes(searchQuery.toLowerCase()) ||
    seller.email.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const getStatusColor = (status) => {
    return status === 'active'
      ? 'bg-green-100 text-green-800'
      : 'bg-red-100 text-red-800'
  }

  const handleSuspend = (sellerId) => {
    setSellers(sellers.map((s) =>
      s.id === sellerId ? { ...s, status: s.status === 'active' ? 'suspended' : 'active' } : s
    ))
  }

  const handleRemove = (sellerId) => {
    setSellers(sellers.filter((s) => s.id !== sellerId))
  }

  const totalRevenue = sellers.reduce((sum, s) => sum + s.revenue, 0)
  const totalProducts = sellers.reduce((sum, s) => sum + s.products, 0)

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Seller Management</h1>
          <p className="text-muted-foreground mt-2">Manage seller accounts and monitor performance</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4 mb-8">
          <Card className="border-border bg-card">
            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground">Total Sellers</p>
              <p className="text-2xl font-bold text-foreground">{sellers.length}</p>
            </CardContent>
          </Card>
          <Card className="border-border bg-card">
            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground">Total Products</p>
              <p className="text-2xl font-bold text-foreground">{totalProducts}</p>
            </CardContent>
          </Card>
          <Card className="border-border bg-card">
            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground">Total Revenue</p>
              <p className="text-2xl font-bold text-foreground">₹{(totalRevenue / 100000).toFixed(1)}L</p>
            </CardContent>
          </Card>
          <Card className="border-border bg-card">
            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground">Active Sellers</p>
              <p className="text-2xl font-bold text-foreground text-green-600">
                {sellers.filter((s) => s.status === 'active').length}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <Card className="border-border bg-card mb-6">
          <CardContent className="p-6">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Search by seller name, owner, or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Sellers Table */}
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="text-foreground">All Sellers</CardTitle>
            <CardDescription>{filteredSellers.length} sellers found</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-foreground">Store Name</TableHead>
                    <TableHead className="text-foreground">Owner</TableHead>
                    <TableHead className="text-foreground">Products</TableHead>
                    <TableHead className="text-foreground">Revenue</TableHead>
                    <TableHead className="text-foreground">Status</TableHead>
                    <TableHead className="text-foreground">Joined</TableHead>
                    <TableHead className="text-foreground">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSellers.map((seller) => (
                    <TableRow key={seller.id} className="border-border">
                      <TableCell className="font-medium text-foreground">{seller.name}</TableCell>
                      <TableCell className="text-muted-foreground">
                        <div>
                          <p className="font-medium text-foreground">{seller.owner}</p>
                          <p className="text-sm">{seller.email}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Package className="h-4 w-4 text-primary" />
                          <span className="text-foreground">{seller.products}</span>
                        </div>
                      </TableCell>
                      <TableCell className="font-semibold text-foreground">
                        ₹{seller.revenue.toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(seller.status)}>{seller.status}</Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{seller.joinDate}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-yellow-500 text-yellow-600 hover:bg-yellow-50"
                            onClick={() => handleSuspend(seller.id)}
                          >
                            <Ban className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-red-500 text-red-600 hover:bg-red-50"
                            onClick={() => handleRemove(seller.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
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
