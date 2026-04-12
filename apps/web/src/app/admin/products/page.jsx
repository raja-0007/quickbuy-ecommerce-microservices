'use client'

import React, { useState, useEffect } from 'react'
import { Search, Star, CircleSlash2, Trash2, Loader2 } from 'lucide-react'
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

export default function AdminProductsPage() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const res = await axiosHandle.get('/products/get-products')
      const data = res.data?.products || res.data || []
      setProducts(data)
    } catch {
      setError('Failed to load products')
    } finally {
      setLoading(false)
    }
  }

  const filteredProducts = products.filter((p) => {
    const title = p.title || ''
    const brand = p.brand || ''
    return (
      title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      brand.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })

  const getStatusColor = (status) =>
    status === 'blocked' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'

  const handleBlockProduct = async (productId, currentStatus) => {
    const newStatus = currentStatus === 'blocked' ? 'active' : 'blocked'
    try {
      await axiosHandle.put(`/products/update-product/${productId}`, { availabilityStatus: newStatus })
      setProducts(products.map((p) =>
        p._id === productId ? { ...p, availabilityStatus: newStatus } : p
      ))
    } catch {
      alert('Failed to update product')
    }
  }

  const handleDeleteProduct = async (productId) => {
    if (!confirm('Delete this product?')) return
    try {
      await axiosHandle.delete(`/products/delete-product/${productId}`)
      setProducts(products.filter((p) => p._id !== productId))
    } catch {
      alert('Failed to delete product')
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

  const activeCount = products.filter((p) => p.availabilityStatus !== 'blocked').length
  const blockedCount = products.filter((p) => p.availabilityStatus === 'blocked').length

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Product Moderation</h1>
          <p className="text-muted-foreground mt-2">Review and manage all platform products</p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3 mb-8">
          <Card className="border-border bg-card">
            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground">Total Products</p>
              <p className="text-2xl font-bold text-foreground">{products.length}</p>
            </CardContent>
          </Card>
          <Card className="border-border bg-card">
            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground">Active</p>
              <p className="text-2xl font-bold text-green-600">{activeCount}</p>
            </CardContent>
          </Card>
          <Card className="border-border bg-card">
            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground">Blocked</p>
              <p className="text-2xl font-bold text-red-600">{blockedCount}</p>
            </CardContent>
          </Card>
        </div>

        <Card className="border-border bg-card mb-6">
          <CardContent className="p-6">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Search products by title or brand..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="text-foreground">All Products</CardTitle>
            <CardDescription>{filteredProducts.length} products found</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-foreground">Title</TableHead>
                    <TableHead className="text-foreground">Brand</TableHead>
                    <TableHead className="text-foreground">Price</TableHead>
                    <TableHead className="text-foreground">Stock</TableHead>
                    <TableHead className="text-foreground">Rating</TableHead>
                    <TableHead className="text-foreground">Status</TableHead>
                    <TableHead className="text-foreground">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProducts.map((product) => (
                    <TableRow key={product._id} className="border-border">
                      <TableCell className="font-medium text-foreground">{product.title}</TableCell>
                      <TableCell className="text-muted-foreground">{product.brand}</TableCell>
                      <TableCell className="font-semibold text-foreground">${product.price}</TableCell>
                      <TableCell>
                        <span className={product.stock === 0 ? 'text-red-600' : 'text-foreground'}>
                          {product.stock} units
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 text-accent" />
                          <span className="text-foreground">{product.rating ?? '—'}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(product.availabilityStatus)}>
                          {product.availabilityStatus === 'blocked' ? 'blocked' : 'active'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-yellow-500 text-yellow-600 hover:bg-yellow-50"
                            onClick={() => handleBlockProduct(product._id, product.availabilityStatus)}
                            title={product.availabilityStatus === 'blocked' ? 'Unblock' : 'Block'}
                          >
                            <CircleSlash2 className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-red-500 text-red-600 hover:bg-red-50"
                            onClick={() => handleDeleteProduct(product._id)}
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
