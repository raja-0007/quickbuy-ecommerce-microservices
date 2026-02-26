'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ChevronLeft } from 'lucide-react'

export default function CreateProductPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    title: '',
    brand: '',
    category: 'smartphones',
    price: '',
    stock: '',
    description: '',
    image: '',
    weight: '',
    dimensions: '',
    warranty: '',
  })

  const [errors, setErrors] = useState({})

  const handleChange = (e) => {
    const { id, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }))
    if (errors[id]) {
      setErrors((prev) => ({
        ...prev,
        [id]: '',
      }))
    }
  }

  const validateForm = () => {
    const newErrors = {}
    if (!formData.title.trim()) newErrors.title = 'Title is required'
    if (!formData.brand.trim()) newErrors.brand = 'Brand is required'
    if (!formData.price || parseFloat(formData.price) <= 0) newErrors.price = 'Valid price is required'
    if (!formData.stock || parseInt(formData.stock) < 0) newErrors.stock = 'Valid stock quantity is required'
    if (!formData.description.trim()) newErrors.description = 'Description is required'
    if (!formData.image.trim()) newErrors.image = 'Image URL is required'
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (validateForm()) {
      // Here you would typically send the data to the backend
      console.log('[v0] Creating product:', formData)
      router.push('/seller/products')
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6 lg:px-8">
          <Link href="/seller/products" className="flex items-center gap-2 text-primary hover:text-primary/80 mb-4">
            <ChevronLeft size={20} />
            <span>Back to Products</span>
          </Link>
          <h1 className="text-3xl font-bold text-foreground">Create New Product</h1>
          <p className="mt-1 text-sm text-muted-foreground">Add a new product to your catalog</p>
        </div>
      </div>

      {/* Form */}
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
        <Card className="border-border bg-card">
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Product Title & Brand */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="title" className="text-foreground">
                    Product Title *
                  </Label>
                  <Input
                    id="title"
                    placeholder="e.g., iPhone 14 Pro"
                    value={formData.title}
                    onChange={handleChange}
                    className="mt-2 border-border bg-background text-foreground"
                  />
                  {errors.title && <p className="mt-1 text-xs text-destructive">{errors.title}</p>}
                </div>
                <div>
                  <Label htmlFor="brand" className="text-foreground">
                    Brand *
                  </Label>
                  <Input
                    id="brand"
                    placeholder="e.g., Apple"
                    value={formData.brand}
                    onChange={handleChange}
                    className="mt-2 border-border bg-background text-foreground"
                  />
                  {errors.brand && <p className="mt-1 text-xs text-destructive">{errors.brand}</p>}
                </div>
              </div>

              {/* Category & Price */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="category" className="text-foreground">
                    Category *
                  </Label>
                  <select
                    id="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="mt-2 w-full rounded-md border border-border bg-background px-3 py-2 text-foreground"
                  >
                    <option value="smartphones">Smartphones</option>
                    <option value="accessories">Accessories</option>
                    <option value="tablets">Tablets</option>
                    <option value="laptops">Laptops</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="price" className="text-foreground">
                    Price (₹) *
                  </Label>
                  <Input
                    id="price"
                    type="number"
                    placeholder="999.99"
                    value={formData.price}
                    onChange={handleChange}
                    className="mt-2 border-border bg-background text-foreground"
                  />
                  {errors.price && <p className="mt-1 text-xs text-destructive">{errors.price}</p>}
                </div>
              </div>

              {/* Stock & Warranty */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="stock" className="text-foreground">
                    Stock Quantity *
                  </Label>
                  <Input
                    id="stock"
                    type="number"
                    placeholder="50"
                    value={formData.stock}
                    onChange={handleChange}
                    className="mt-2 border-border bg-background text-foreground"
                  />
                  {errors.stock && <p className="mt-1 text-xs text-destructive">{errors.stock}</p>}
                </div>
                <div>
                  <Label htmlFor="warranty" className="text-foreground">
                    Warranty Period
                  </Label>
                  <Input
                    id="warranty"
                    placeholder="e.g., 1 Year"
                    value={formData.warranty}
                    onChange={handleChange}
                    className="mt-2 border-border bg-background text-foreground"
                  />
                </div>
              </div>

              {/* Specifications */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="weight" className="text-foreground">
                    Weight (kg)
                  </Label>
                  <Input
                    id="weight"
                    placeholder="0.5"
                    value={formData.weight}
                    onChange={handleChange}
                    className="mt-2 border-border bg-background text-foreground"
                  />
                </div>
                <div>
                  <Label htmlFor="dimensions" className="text-foreground">
                    Dimensions
                  </Label>
                  <Input
                    id="dimensions"
                    placeholder="15x8x1 cm"
                    value={formData.dimensions}
                    onChange={handleChange}
                    className="mt-2 border-border bg-background text-foreground"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <Label htmlFor="description" className="text-foreground">
                  Product Description *
                </Label>
                <textarea
                  id="description"
                  placeholder="Describe your product features, specifications, and benefits..."
                  value={formData.description}
                  onChange={handleChange}
                  rows="5"
                  className="mt-2 w-full rounded-md border border-border bg-background px-3 py-2 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
                {errors.description && <p className="mt-1 text-xs text-destructive">{errors.description}</p>}
              </div>

              {/* Image URL */}
              <div>
                <Label htmlFor="image" className="text-foreground">
                  Product Image URL *
                </Label>
                <Input
                  id="image"
                  placeholder="https://example.com/product.jpg"
                  value={formData.image}
                  onChange={handleChange}
                  className="mt-2 border-border bg-background text-foreground"
                />
                {errors.image && <p className="mt-1 text-xs text-destructive">{errors.image}</p>}
                {formData.image && (
                  <div className="mt-3">
                    <p className="text-sm text-muted-foreground mb-2">Image Preview:</p>
                    <img
                      src={formData.image}
                      alt="Preview"
                      className="h-32 w-32 rounded object-cover border border-border"
                      onError={(e) => {
                        e.target.src = '/placeholder.svg'
                      }}
                    />
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4">
                <Link href="/seller/products" className="flex-1">
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full border-border text-foreground hover:bg-secondary"
                  >
                    Cancel
                  </Button>
                </Link>
                <Button type="submit" className="flex-1 bg-primary hover:bg-primary/90">
                  Create Product
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
