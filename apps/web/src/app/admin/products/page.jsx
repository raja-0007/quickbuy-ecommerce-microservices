'use client'

import React, { useState } from 'react'
import { Search, Eye, Star, CircleSlash2, Trash2, Heart } from 'lucide-react'
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

const MOCK_PRODUCTS = [
  { id: 'P001', title: 'Wireless Earbuds Pro', seller: 'TechHub Store', price: 2499, stock: 45, rating: 4.5, status: 'active', featured: true },
  { id: 'P002', title: 'Smartphone Case', seller: 'TechHub Store', price: 499, stock: 120, rating: 4.2, status: 'active', featured: false },
  { id: 'P003', title: 'Designer Handbag', seller: 'Fashion Forward', price: 5999, stock: 12, rating: 4.7, status: 'active', featured: true },
  { id: 'P004', title: 'Yoga Mat Premium', seller: 'Home Essentials', price: 1999, stock: 0, rating: 4.3, status: 'blocked', featured: false },
  { id: 'P005', title: 'Laptop Stand', seller: 'Electronics Pro', price: 1499, stock: 25, rating: 4.4, status: 'active', featured: false },
  { id: 'P006', title: 'LED Desk Lamp', seller: 'Electronics Pro', price: 1299, stock: 45, rating: 4.1, status: 'active', featured: true },
  { id: 'P007', title: 'Organic Face Cream', seller: 'Beauty Box', price: 799, stock: 85, rating: 4.6, status: 'active', featured: false },
  { id: 'P008', title: 'Running Shoes', seller: 'Fashion Forward', price: 3499, stock: 30, rating: 4.5, status: 'active', featured: false },
]

export default function AdminProductsPage() {
  const [products, setProducts] = useState(MOCK_PRODUCTS)
  const [searchQuery, setSearchQuery] = useState('')

  const filteredProducts = products.filter((product) =>
    product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.seller.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const getStatusColor = (status) => {
    return status === 'active'
      ? 'bg-green-100 text-green-800'
      : 'bg-red-100 text-red-800'
  }

  const handleToggleFeatured = (productId) => {
    setProducts(products.map((p) =>
      p.id === productId ? { ...p, featured: !p.featured } : p
    ))
  }

  const handleBlockProduct = (productId) => {
    setProducts(products.map((p) =>
      p.id === productId ? { ...p, status: p.status === 'active' ? 'blocked' : 'active' } : p
    ))
  }

  const handleDeleteProduct = (productId) => {
    setProducts(products.filter((p) => p.id !== productId))
  }

  const activeCount = products.filter((p) => p.status === 'active').length
  const blockedCount = products.filter((p) => p.status === 'blocked').length
  const featuredCount = products.filter((p) => p.featured).length

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Product Moderation</h1>
          <p className="text-muted-foreground mt-2">Review and manage all platform products</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4 mb-8">
          <Card className="border-border bg-card">
            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground">Total Products</p>
              <p className="text-2xl font-bold text-foreground">{products.length}</p>
            </CardContent>
          </Card>
          <Card className="border-border bg-card">
            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground">Active</p>
              <p className="text-2xl font-bold text-foreground text-green-600">{activeCount}</p>
            </CardContent>
          </Card>
          <Card className="border-border bg-card">
            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground">Blocked</p>
              <p className="text-2xl font-bold text-foreground text-red-600">{blockedCount}</p>
            </CardContent>
          </Card>
          <Card className="border-border bg-card">
            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground">Featured</p>
              <p className="text-2xl font-bold text-foreground text-accent">{featuredCount}</p>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <Card className="border-border bg-card mb-6">
          <CardContent className="p-6">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Search products by title or seller..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Products Table */}
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
                    <TableHead className="text-foreground">Product Title</TableHead>
                    <TableHead className="text-foreground">Seller</TableHead>
                    <TableHead className="text-foreground">Price</TableHead>
                    <TableHead className="text-foreground">Stock</TableHead>
                    <TableHead className="text-foreground">Rating</TableHead>
                    <TableHead className="text-foreground">Status</TableHead>
                    <TableHead className="text-foreground">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProducts.map((product) => (
                    <TableRow key={product.id} className="border-border">
                      <TableCell className="font-medium text-foreground">{product.title}</TableCell>
                      <TableCell className="text-muted-foreground">{product.seller}</TableCell>
                      <TableCell className="font-semibold text-foreground">₹{product.price}</TableCell>
                      <TableCell>
                        <span className={product.stock === 0 ? 'text-red-600' : 'text-foreground'}>
                          {product.stock} units
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 text-accent" />
                          <span className="text-foreground">{product.rating}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Badge className={getStatusColor(product.status)}>{product.status}</Badge>
                          {product.featured && (
                            <Badge className="bg-accent text-accent-foreground">Featured</Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-primary text-primary hover:bg-primary/10"
                            onClick={() => handleToggleFeatured(product.id)}
                          >
                            <Heart className={`h-4 w-4 ${product.featured ? 'fill-accent' : ''}`} />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-yellow-500 text-yellow-600 hover:bg-yellow-50"
                            onClick={() => handleBlockProduct(product.id)}
                          >
                            <CircleSlash2 className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-red-500 text-red-600 hover:bg-red-50"
                            onClick={() => handleDeleteProduct(product.id)}
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
