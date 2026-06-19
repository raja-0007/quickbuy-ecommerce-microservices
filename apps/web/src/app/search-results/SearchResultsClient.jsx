"use client"

import { useState, useMemo, useEffect } from 'react'
import dynamic from 'next/dynamic'
const Star = dynamic(() => import('lucide-react').then((mod) => mod.Star), { ssr: false })
const Sliders = dynamic(() => import('lucide-react').then((mod) => mod.Sliders), { ssr: false })
import { Slider } from '@/components/ui/slider'
import { Input } from '@/components/ui/input'
import ProductCard from '@/components/product/ProductCard'

export default function SearchResultsClient({ initialProducts = [], initialQuery = '' }) {
  const [sortBy, setSortBy] = useState('relevance')
  const [priceRange, setPriceRange] = useState([0, 1000000])
  const [showFilters, setShowFilters] = useState(false)
  const [selectedRatings, setSelectedRatings] = useState(new Set())
  const [searchResults, setSearchResults] = useState(initialProducts)

  useEffect(() => {
    setSearchResults(initialProducts)
  }, [initialProducts])

  const toggleRatingFilter = (rating) => {
    const newRatings = new Set(selectedRatings)
    if (newRatings.has(rating)) newRatings.delete(rating)
    else newRatings.add(rating)
    setSelectedRatings(newRatings)
  }

  const parsePriceInput = (value, fallback) => {
    if (value === '' || value === null || value === undefined) return fallback
    const parsed = Number(value)
    return Number.isFinite(parsed) ? parsed : fallback
  }

  const getDiscountedPrice = (price, discount) => price - (price * discount) / 100

  const filteredProducts = useMemo(() => {
    let sorted = [...searchResults]
    sorted = sorted.filter((p) => {
      const finalPrice = p.price - (p.price * p.discountPercentage) / 100
      return finalPrice >= priceRange[0] && finalPrice <= priceRange[1]
    })
    if (selectedRatings.size > 0) {
      sorted = sorted.filter((p) => selectedRatings.has(Math.round(p.rating)))
    }
    if (sortBy === 'price-low') sorted.sort((a, b) => (a.price - a.price * a.discountPercentage / 100) - (b.price - b.price * b.discountPercentage / 100))
    else if (sortBy === 'price-high') sorted.sort((a, b) => (b.price - b.price * b.discountPercentage / 100) - (a.price - a.price * a.discountPercentage / 100))
    else if (sortBy === 'rating') sorted.sort((a, b) => b.rating - a.rating)
    return sorted
  }, [sortBy, priceRange, selectedRatings, searchResults])

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-10 z-10 border-b border-border bg-card backdrop-blur-sm">
        <div className="mx-auto w-full px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Search Results for "{initialQuery}"</h1>
              <p className="text-sm text-muted-foreground">Showing {filteredProducts.length} products</p>
            </div>
            <div className="flex items-center gap-2">
              <label htmlFor="sort-by" className="text-sm text-muted-foreground">Sort by:</label>
              <select id="sort-by" value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:ring-2 focus:ring-primary">
                <option value="relevance">Relevance</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rating</option>
              </select>
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-5">
          <div className={`lg:block ${showFilters ? 'block' : 'hidden'}`}>
            <div className="sticky top-24 space-y-6">
              <div>
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="font-semibold text-foreground">Filters</h3>
                  <button onClick={() => setShowFilters(false)} aria-label="Close filters" className="lg:hidden text-muted-foreground hover:text-foreground">✕</button>
                </div>
              </div>

              <div className="rounded-lg border border-border bg-card p-4">
                <h4 className="mb-4 font-semibold text-foreground text-sm">Price Range</h4>
                <div className="space-y-4">
                  <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] sm:items-center">
                    <label htmlFor="min-price" className="sr-only">Minimum price</label>
                    <div className="flex flex-col gap-1">
                      <span className="text-sm font-medium text-foreground">Min Price</span>
                      <div className="relative w-full">
                        <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-sm text-muted-foreground">$</span>
                        <Input id="min-price" className="w-full pl-7 border border-primary focus:ring-0 h-12 text-base" value={priceRange[0]} onChange={(e) => setPriceRange([parsePriceInput(e.target.value, 0), priceRange[1]])} inputMode="numeric" />
                      </div>
                    </div>
                    <span className="text-sm text-muted-foreground text-center font-medium">—</span>
                    <div className="flex flex-col gap-1">
                      <span className="text-sm font-medium text-foreground">Max Price</span>
                      <div className="relative w-full">
                        <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-sm text-muted-foreground">$</span>
                        <Input id="max-price" className="w-full pl-7 border border-primary focus:ring-0 h-12 text-base" value={priceRange[1]} onChange={(e) => setPriceRange([priceRange[0], parsePriceInput(e.target.value, priceRange[1])])} inputMode="numeric" />
                      </div>
                    </div>
                  </div>
                  <Slider value={priceRange} max={10000} step={100} onValueChange={(value) => setPriceRange(value)} className="mx-auto w-full max-w-xs" />
                </div>
              </div>

              <div className="rounded-lg border border-border bg-card p-4">
                <h4 className="mb-3 font-semibold text-foreground text-sm">Availability</h4>
                <label className="flex cursor-pointer items-center gap-2">
                  <input type="checkbox" defaultChecked className="h-4 w-4 rounded border-border bg-background" />
                  <span className="text-sm text-foreground">In Stock</span>
                </label>
              </div>

              <div className="rounded-lg border border-border bg-card p-4">
                <h4 className="mb-3 font-semibold text-foreground text-sm">Rating</h4>
                <div className="space-y-2">
                  {[5,4,3,2,1].map((rating)=> (
                    <label key={rating} className="flex cursor-pointer items-center gap-2">
                      <input type="checkbox" checked={selectedRatings.has(rating)} onChange={()=>toggleRatingFilter(rating)} className="h-4 w-4 rounded border-border bg-background cursor-pointer" aria-label={`${rating} stars and up`} />
                      <div className="flex items-center gap-1">{Array.from({length: rating}).map((_,i)=>(<Star key={i} size={14} className="fill-accent text-accent"/>))}<span className="ml-1 text-xs text-muted-foreground">& up</span></div>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-4">
            <button onClick={() => setShowFilters(true)} className="mb-6 flex lg:hidden items-center gap-2 rounded-lg border border-border bg-card px-4 py-2 text-sm text-foreground hover:bg-secondary transition-colors">
              <Sliders size={16} />
              Show Filters
            </button>

            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {filteredProducts.map((product)=> (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            ) : (
              <div className="rounded-lg border border-border bg-card p-12 text-center"><p className="text-foreground font-semibold mb-2">No products found</p><p className="text-sm text-muted-foreground">Try adjusting your filters or search criteria</p></div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
