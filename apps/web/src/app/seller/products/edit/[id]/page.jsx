'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ChevronLeft, Loader2 } from 'lucide-react'
import { axiosHandle } from '@/lib/api'

export default function EditProductPage({ params }) {
  const router = useRouter()
  const productId = params.id

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [errors, setErrors] = useState({})
  const [formData, setFormData] = useState({
    title: '',
    brand: '',
    category: 'smartphones',
    price: '',
    stock: '',
    description: '',
    weight: '',
    warranty: '',
  })

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axiosHandle.get(`/products/getProduct/${productId}`)
        const p = res.data?.product || res.data
        setFormData({
          title: p.title || '',
          brand: p.brand || '',
          category: p.category || 'smartphones',
          price: p.price?.toString() || '',
          stock: p.stock?.toString() || '',
          description: p.description || '',
          weight: p.weight?.toString() || '',
          warranty: p.warrantyInformation || '',
        })
      } catch {
        alert('Failed to load product')
        router.push('/seller/products')
      } finally {
        setLoading(false)
      }
    }
    fetchProduct()
  }, [productId])

  const handleChange = (e) => {
    const { id, value } = e.target
    setFormData((prev) => ({ ...prev, [id]: value }))
    if (errors[id]) setErrors((prev) => ({ ...prev, [id]: '' }))
  }

  const validateForm = () => {
    const newErrors = {}
    if (!formData.title.trim()) newErrors.title = 'Title is required'
    if (!formData.brand.trim()) newErrors.brand = 'Brand is required'
    if (!formData.price || parseFloat(formData.price) <= 0) newErrors.price = 'Valid price is required'
    if (!formData.stock || parseInt(formData.stock) < 0) newErrors.stock = 'Valid stock quantity is required'
    if (!formData.description.trim()) newErrors.description = 'Description is required'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return
    setSaving(true)
    try {
      await axiosHandle.put(`/products/update-product/${productId}`, {
        title: formData.title,
        brand: formData.brand,
        category: formData.category,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
        description: formData.description,
        weight: formData.weight ? parseFloat(formData.weight) : undefined,
        warrantyInformation: formData.warranty || undefined,
      })
      router.push('/seller/products')
    } catch {
      alert('Failed to save changes')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border bg-card">
        <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6 lg:px-8">
          <Link href="/seller/products" className="flex items-center gap-2 text-primary hover:text-primary/80 mb-4">
            <ChevronLeft size={20} />
            <span>Back to Products</span>
          </Link>
          <h1 className="text-3xl font-bold text-foreground">Edit Product</h1>
          <p className="mt-1 text-sm text-muted-foreground">Update product details and information</p>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
        <Card className="border-border bg-card">
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="title" className="text-foreground">Product Title *</Label>
                  <Input id="title" value={formData.title} onChange={handleChange} className="mt-2 border-border bg-background text-foreground" />
                  {errors.title && <p className="mt-1 text-xs text-destructive">{errors.title}</p>}
                </div>
                <div>
                  <Label htmlFor="brand" className="text-foreground">Brand *</Label>
                  <Input id="brand" value={formData.brand} onChange={handleChange} className="mt-2 border-border bg-background text-foreground" />
                  {errors.brand && <p className="mt-1 text-xs text-destructive">{errors.brand}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="category" className="text-foreground">Category *</Label>
                  <select id="category" value={formData.category} onChange={handleChange} className="mt-2 w-full rounded-md border border-border bg-background px-3 py-2 text-foreground">
                    <option value="smartphones">Smartphones</option>
                    <option value="accessories">Accessories</option>
                    <option value="tablets">Tablets</option>
                    <option value="laptops">Laptops</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="price" className="text-foreground">Price ($) *</Label>
                  <Input id="price" type="number" value={formData.price} onChange={handleChange} className="mt-2 border-border bg-background text-foreground" />
                  {errors.price && <p className="mt-1 text-xs text-destructive">{errors.price}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="stock" className="text-foreground">Stock Quantity *</Label>
                  <Input id="stock" type="number" value={formData.stock} onChange={handleChange} className="mt-2 border-border bg-background text-foreground" />
                  {errors.stock && <p className="mt-1 text-xs text-destructive">{errors.stock}</p>}
                </div>
                <div>
                  <Label htmlFor="warranty" className="text-foreground">Warranty Period</Label>
                  <Input id="warranty" placeholder="e.g., 1 Year" value={formData.warranty} onChange={handleChange} className="mt-2 border-border bg-background text-foreground" />
                </div>
              </div>

              <div>
                <Label htmlFor="weight" className="text-foreground">Weight (kg)</Label>
                <Input id="weight" placeholder="0.5" value={formData.weight} onChange={handleChange} className="mt-2 border-border bg-background text-foreground" />
              </div>

              <div>
                <Label htmlFor="description" className="text-foreground">Product Description *</Label>
                <textarea
                  id="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="5"
                  className="mt-2 w-full rounded-md border border-border bg-background px-3 py-2 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
                {errors.description && <p className="mt-1 text-xs text-destructive">{errors.description}</p>}
              </div>

              <div className="flex gap-3 pt-4">
                <Link href="/seller/products" className="flex-1">
                  <Button type="button" variant="outline" className="w-full border-border text-foreground hover:bg-secondary">
                    Cancel
                  </Button>
                </Link>
                <Button type="submit" disabled={saving} className="flex-1 bg-primary hover:bg-primary/90">
                  {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Save Changes'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
