'use client'

import React, { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Eye, Package, Plus, Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { axiosHandle } from '@/lib/api'

export default function SellerProductsPage() {
  const { data: session, status } = useSession()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedProduct, setSelectedProduct] = useState(null)

  useEffect(() => {
    if (status === 'loading') return

    if (status !== 'authenticated' || !session?.user?.id) {
      setLoading(false)
      setProducts([])
      return
    }

    const fetchProducts = async () => {
      setLoading(true)
      try {
        const res = await axiosHandle.get('/products/get-products', {
          params: {
            sellerUserId: session.user.id,
            limit: 200,
            page: 1,
          },
        })
        setProducts(Array.isArray(res.data?.products) ? res.data.products : [])
      } catch (error) {
        console.error('Failed to fetch seller products:', error)
        setProducts([])
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [session?.user?.id, status])

  const filteredProducts = useMemo(() => {
    if (!searchQuery.trim()) return products
    const q = searchQuery.toLowerCase()
    return products.filter(
      (p) =>
        String(p.title || '')
          .toLowerCase()
          .includes(q) ||
        String(p.brand || '')
          .toLowerCase()
          .includes(q) ||
        String(p.category || '')
          .toLowerCase()
          .includes(q) ||
        String(p.sku || '')
          .toLowerCase()
          .includes(q)
    )
  }, [products, searchQuery])

  const stats = useMemo(() => {
    const total = products.length
    const lowStock = products.filter((p) => Number(p.stock) < 10).length
    const inStock = products.filter(
      (p) => String(p.availabilityStatus || '').toLowerCase().includes('stock')
    ).length
    return { total, lowStock, inStock }
  }, [products])

  const authBlocking = status !== 'loading' && status !== 'authenticated'

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border bg-card">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">My products</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Listings linked to your seller account
            </p>
          </div>
          <Button asChild className="bg-primary hover:bg-primary/90 w-full sm:w-auto">
            <Link href="/seller/products/create" className="inline-flex items-center gap-2">
              <Plus size={18} />
              Add product
            </Link>
          </Button>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {authBlocking && (
          <Card className="border-border bg-card mb-8">
            <CardContent className="p-6">
              <p className="text-muted-foreground">
                Sign in as a seller to view your products.
              </p>
              <Button asChild className="mt-4">
                <Link href="/login">Go to login</Link>
              </Button>
            </CardContent>
          </Card>
        )}

        {!authBlocking && (
          <>
            <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-3">
              <Card className="border-border bg-card">
                <CardContent className="p-4">
                  <p className="text-xs text-muted-foreground">Total products</p>
                  <p className="mt-2 text-2xl font-bold text-primary">{stats.total}</p>
                </CardContent>
              </Card>
              <Card className="border-border bg-card">
                <CardContent className="p-4">
                  <p className="text-xs text-muted-foreground">Listed as in stock</p>
                  <p className="mt-2 text-2xl font-bold text-green-600 dark:text-green-400">
                    {stats.inStock}
                  </p>
                </CardContent>
              </Card>
              <Card className="border-border bg-card col-span-2 sm:col-span-1">
                <CardContent className="p-4">
                  <p className="text-xs text-muted-foreground">Low stock (&lt; 10)</p>
                  <p className="mt-2 text-2xl font-bold text-amber-600 dark:text-amber-400">
                    {stats.lowStock}
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card className="mb-6 border-border bg-card">
              <CardContent className="p-6">
                <Label className="text-foreground">Search</Label>
                <div className="relative mt-2">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by title, brand, category, or SKU..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 border-border bg-background text-foreground"
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="border-border bg-card overflow-hidden">
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="border-b border-border bg-muted/50">
                      <tr>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                          Product
                        </th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                          Category
                        </th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                          Price
                        </th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                          Stock
                        </th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                          Status
                        </th>
                        <th className="px-6 py-3 text-right text-sm font-semibold text-foreground">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {loading ? (
                        <tr>
                          <td colSpan={6} className="px-6 py-8 text-center">
                            <p className="text-muted-foreground">Loading products...</p>
                          </td>
                        </tr>
                      ) : filteredProducts.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="px-6 py-12 text-center">
                            <Package className="mx-auto h-10 w-10 text-muted-foreground mb-3" />
                            <p className="text-muted-foreground mb-4">
                              {products.length === 0
                                ? 'No products yet. Create your first listing.'
                                : 'No products match your search.'}
                            </p>
                            {products.length === 0 && (
                              <Button asChild>
                                <Link href="/seller/products/create">Create product</Link>
                              </Button>
                            )}
                          </td>
                        </tr>
                      ) : (
                        filteredProducts.map((product) => {
                          const thumb =
                            product.thumbnail ||
                            (Array.isArray(product.images) && product.images[0]) ||
                            '/placeholder.svg'
                          const low = Number(product.stock) < 10

                          return (
                            <tr
                              key={product._id}
                              className="border-t border-border hover:bg-muted/50 transition"
                            >
                              <td className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                  <img
                                    src={thumb}
                                    alt=""
                                    className="h-12 w-12 rounded-md object-cover border border-border"
                                  />
                                  <div>
                                    <p className="font-medium text-foreground line-clamp-1">
                                      {product.title}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                      {product.brand}
                                    </p>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 text-sm text-foreground capitalize">
                                {product.category || '—'}
                              </td>
                              <td className="px-6 py-4 font-semibold text-foreground">
                                ${Number(product.price || 0).toFixed(2)}
                              </td>
                              <td className="px-6 py-4">
                                <span className={low ? 'text-amber-600 font-medium' : ''}>
                                  {product.stock ?? '—'}
                                </span>
                              </td>
                              <td className="px-6 py-4">
                                <Badge
                                  variant="outline"
                                  className="border-border text-foreground"
                                >
                                  {product.availabilityStatus || '—'}
                                </Badge>
                              </td>
                              <td className="px-6 py-4">
                                <div className="flex justify-end gap-2">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setSelectedProduct(product)}
                                    className="text-primary hover:bg-primary/10"
                                  >
                                    <Eye size={18} />
                                  </Button>
                                  <Button variant="ghost" size="sm" asChild>
                                    <Link
                                      href={`/product/${product._id}`}
                                      className="text-primary hover:bg-primary/10"
                                    >
                                      Store
                                    </Link>
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          )
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      {selectedProduct && (
        <Dialog open={!!selectedProduct} onOpenChange={() => setSelectedProduct(null)}>
          <DialogContent className="border-border bg-card max-w-lg">
            <DialogHeader>
              <DialogTitle className="text-foreground">{selectedProduct.title}</DialogTitle>
              <DialogDescription>
                SKU: {selectedProduct.sku || '—'} · Brand: {selectedProduct.brand || '—'}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-3 text-sm">
              <div className="rounded-lg bg-muted/50 p-4 grid grid-cols-2 gap-2">
                <div>
                  <p className="text-muted-foreground">Price</p>
                  <p className="font-semibold text-foreground">
                    ${Number(selectedProduct.price || 0).toFixed(2)}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Stock</p>
                  <p className="font-semibold text-foreground">{selectedProduct.stock ?? '—'}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-muted-foreground">Description</p>
                  <p className="text-foreground line-clamp-6">{selectedProduct.description || '—'}</p>
                </div>
              </div>
              <Button asChild className="w-full">
                <Link href={`/product/${selectedProduct._id}`}>View on storefront</Link>
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
