'use client'

import React, { useState, useEffect } from 'react'
import { Search, Package, Ban, Trash2, Loader2 } from 'lucide-react'
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
import { axiosHandle } from '@/lib/api'

export default function AdminSellersPage() {
  const [sellers, setSellers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    fetchSellers()
  }, [])

  const fetchSellers = async () => {
    try {
      setLoading(true)
      const [usersRes, productsRes] = await Promise.all([
        axiosHandle.get('/users/getAllUsers'),
        axiosHandle.get('/products/get-products'),
      ])

      const allUsers = Array.isArray(usersRes.data) ? usersRes.data : usersRes.data.users || []
      const allProducts = productsRes.data?.products || productsRes.data || []

      const sellerUsers = allUsers.filter((u) => u.role === 'seller')

      // Count products per seller by authUserId
      const productCountMap = {}
      allProducts.forEach((p) => {
        const sid = p.sellerUserId?.toString()
        if (sid) productCountMap[sid] = (productCountMap[sid] || 0) + 1
      })

      const enriched = sellerUsers.map((s) => ({
        ...s,
        productCount: productCountMap[s.authUserId?.toString()] || 0,
      }))

      setSellers(enriched)
    } catch (err) {
      setError('Failed to load sellers')
    } finally {
      setLoading(false)
    }
  }

  const filteredSellers = sellers.filter((s) => {
    const name = s.name || ''
    const email = s.email || ''
    return (
      name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      email.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })

  const getStatusColor = (status) =>
    status === 'active' || !status ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'

  const handleSuspend = async (userId, currentStatus) => {
    const newStatus = currentStatus === 'active' ? 'suspended' : 'active'
    try {
      await axiosHandle.put(`/users/updateStatus/${userId}`, { status: newStatus })
      setSellers(sellers.map((s) => (s._id === userId ? { ...s, status: newStatus } : s)))
    } catch {
      alert('Failed to update status')
    }
  }

  const handleRemove = async (userId) => {
    if (!confirm('Remove this seller?')) return
    try {
      await axiosHandle.delete(`/users/deleteUser/${userId}`)
      setSellers(sellers.filter((s) => s._id !== userId))
    } catch {
      alert('Failed to remove seller')
    }
  }

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

  const totalProducts = sellers.reduce((sum, s) => sum + (s.productCount || 0), 0)

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Seller Management</h1>
          <p className="text-muted-foreground mt-2">Manage seller accounts and monitor performance</p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3 mb-8">
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
              <p className="text-sm text-muted-foreground">Active Sellers</p>
              <p className="text-2xl font-bold text-green-600">
                {sellers.filter((s) => !s.status || s.status === 'active').length}
              </p>
            </CardContent>
          </Card>
        </div>

        <Card className="border-border bg-card mb-6">
          <CardContent className="p-6">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Search by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

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
                    <TableHead className="text-foreground">Name</TableHead>
                    <TableHead className="text-foreground">Email</TableHead>
                    <TableHead className="text-foreground">Products</TableHead>
                    <TableHead className="text-foreground">Status</TableHead>
                    <TableHead className="text-foreground">Joined</TableHead>
                    <TableHead className="text-foreground">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSellers.map((seller) => (
                    <TableRow key={seller._id} className="border-border">
                      <TableCell className="font-medium text-foreground">{seller.name}</TableCell>
                      <TableCell className="text-muted-foreground">{seller.email}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Package className="h-4 w-4 text-primary" />
                          <span className="text-foreground">{seller.productCount}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(seller.status)}>
                          {seller.status || 'active'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {seller.createdAt ? new Date(seller.createdAt).toLocaleDateString() : '—'}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-yellow-500 text-yellow-600 hover:bg-yellow-50"
                            onClick={() => handleSuspend(seller._id, seller.status || 'active')}
                            title={seller.status === 'suspended' ? 'Unsuspend' : 'Suspend'}
                          >
                            <Ban className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-red-500 text-red-600 hover:bg-red-50"
                            onClick={() => handleRemove(seller._id)}
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
