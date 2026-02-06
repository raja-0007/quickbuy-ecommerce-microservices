'use client'

import React, { useState, useMemo, useEffect } from 'react'
import { Star, Heart, Filter, ChevronDown, Grid, Sliders, Check, CircleCheckBig } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Image from 'next/image'
import { useSearchParams } from 'next/navigation'
import { useSearchProducts } from '@/contexts/searchProductsContext'
import { toast } from 'sonner'
import { Slider } from '@/components/ui/slider'
import { Input } from '@/components/ui/input'
import Link from 'next/link'
import { axiosHandle } from '@/lib/api'
import customToast from '@/lib/CustomToast'

// Sample products data
const PRODUCTS = [
    {
        id: 110,
        title: 'Selfie Lamp with iPhone',
        price: 14.99,
        discountPercentage: 19.4,
        rating: 3.55,
        stock: 58,
        category: 'mobile-accessories',
        thumbnail: 'https://cdn.dummyjson.com/product-images/mobile-accessories/selfie-lamp-with-iphone/thumbnail.webp',
        availabilityStatus: 'In Stock',
    },
    {
        id: 71,
        title: 'Silver Pot With Glass Cap',
        price: 39.99,
        discountPercentage: 5.7,
        rating: 3.22,
        stock: 40,
        category: 'kitchen-accessories',
        thumbnail: 'https://cdn.dummyjson.com/product-images/kitchen-accessories/silver-pot-with-glass-cap/thumbnail.webp',
        availabilityStatus: 'In Stock',
    },
]

const SearchResults = () => {
    const [sortBy, setSortBy] = useState('relevance')
    const [priceRange, setPriceRange] = useState([0, 1000000])
    const [showFilters, setShowFilters] = useState(false)
    const [wishlist, setWishlist] = useState(new Set())
    const [selectedRatings, setSelectedRatings] = useState(new Set())
    const searchParams = useSearchParams()
    const { searchResults, setSearchResults } = useSearchProducts()

    // useEffect(()=>{
    //     const searchQuery = searchParams.get('searchQuery')
    //     if(searchQuery){
    //         getProducts()
    //     }
    // },[searchParams])

    const toggleRatingFilter = (rating) => {
        const newRatings = new Set(selectedRatings)
        if (newRatings.has(rating)) {
            newRatings.delete(rating)
        } else {
            newRatings.add(rating)
        }
        setSelectedRatings(newRatings)
    }

    const addToCart = async(e, product) => {

        e.preventDefault()
        e.stopPropagation()
        try{
            console.log("Adding to cart", product)
            const response = await axiosHandle.post('/orders/cart/addToCart', product)
            console.log("Add to cart response", response.data)
            customToast({message: "Product added to cart!", type: "success"})
            
        }catch(err){
            console.log(err)
            customToast({message: "Failed to add product to cart!", type: "error"})
        }

    }


    const filteredProducts = useMemo(() => {
        let sorted = [...searchResults]

        // Filter by price
        sorted = sorted.filter((p) => {
            const finalPrice = p.price - (p.price * p.discountPercentage) / 100
            return (finalPrice * 91.91) >= priceRange[0] && (finalPrice * 91.91) <= priceRange[1]
        })

        // Filter by rating
        if (selectedRatings.size > 0) {
            sorted = sorted.filter((p) => {
                const productRating = Math.round(p.rating)
                return selectedRatings.has(productRating)
            })
        }

        // Sort
        if (sortBy === 'price-low') {
            sorted.sort((a, b) => {
                const priceA = a.price - (a.price * a.discountPercentage) / 100
                const priceB = b.price - (b.price * b.discountPercentage) / 100
                return priceA - priceB
            })
        } else if (sortBy === 'price-high') {
            sorted.sort((a, b) => {
                const priceA = a.price - (a.price * a.discountPercentage) / 100
                const priceB = b.price - (b.price * b.discountPercentage) / 100
                return priceB - priceA
            })
        } else if (sortBy === 'rating') {
            sorted.sort((a, b) => b.rating - a.rating)
        }

        return sorted
    }, [sortBy, priceRange, selectedRatings, searchResults])

    const toggleWishlist = (id) => {
        const newWishlist = new Set(wishlist)
        if (newWishlist.has(id)) {
            newWishlist.delete(id)
        } else {
            newWishlist.add(id)
        }
        setWishlist(newWishlist)
    }

    const getDiscountedPrice = (price, discount) => {
        return (price - (price * discount) / 100).toFixed(2)
    }

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <header className="sticky top-10 z-10 border-b border-border bg-card backdrop-blur-sm">
                <div className="mx-auto w-full px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between py-4">
                        <div>
                            <h1 className="text-2xl font-bold text-foreground">Search Results for "{searchParams?.get('searchQuery')}"</h1>
                            <p className="text-sm text-muted-foreground">
                                Showing {filteredProducts.length} products
                            </p>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground">Sort by:</span>
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                            >
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
                    {/* Sidebar Filters */}
                    <div className={`lg:block ${showFilters ? 'block' : 'hidden'}`}>
                        <div className="sticky top-24 space-y-6">
                            <div>
                                <div className="mb-4 flex items-center justify-between">
                                    <h3 className="font-semibold text-foreground">Filters</h3>
                                    <button
                                        onClick={() => setShowFilters(false)}
                                        className="lg:hidden text-muted-foreground hover:text-foreground"
                                    >
                                        ✕
                                    </button>
                                </div>
                            </div>

                            {/* Price Filter */}
                            <div className="rounded-lg border border-border bg-card p-4">
                                <h4 className="mb-4 font-semibold text-foreground text-sm">Price Range</h4>
                                <div className="space-y-4">

                                    <div className='text-center flex items-center justify-center'>

                                        ₹<Input className={'w-20 border border-primary focus:ring-0 p-1 h-6'} value={priceRange[0]} onChange={(e) => setPriceRange([e.target.value, priceRange[1]])} />
                                        <span className='mx-3'>-</span>
                                        ₹<Input className={'w-20 border border-primary focus:ring-0 p-1 h-6'} value={priceRange[1]} onChange={(e) => setPriceRange([priceRange[0], e.target.value])} />

                                        {/* {priceRange[0]} - ₹{priceRange[1]} */}
                                    </div>
                                    <Slider
                                        //   defaultValue={[25, 10000]}
                                        value={priceRange}
                                        max={100000}
                                        step={1000}
                                        onValueChange={(value) => {
                                            setPriceRange(value)
                                            console.log("value", value)
                                        }}
                                        className="mx-auto w-full max-w-xs"
                                    />
                                </div>
                            </div>

                            {/* Availability Filter */}
                            <div className="rounded-lg border border-border bg-card p-4">
                                <h4 className="mb-3 font-semibold text-foreground text-sm">Availability</h4>
                                <label className="flex cursor-pointer items-center gap-2">
                                    <input
                                        type="checkbox"
                                        defaultChecked
                                        className="h-4 w-4 rounded border-border bg-background"
                                    />
                                    <span className="text-sm text-foreground">In Stock</span>
                                </label>
                            </div>

                            {/* Rating Filter */}
                            <div className="rounded-lg border border-border bg-card p-4">
                                <h4 className="mb-3 font-semibold text-foreground text-sm">Rating</h4>
                                <div className="space-y-2">
                                    {[5, 4, 3, 2, 1].map((rating) => (
                                        <label key={rating} className="flex cursor-pointer items-center gap-2">
                                            <input
                                                type="checkbox"
                                                checked={selectedRatings.has(rating)}
                                                onChange={() => toggleRatingFilter(rating)}
                                                className="h-4 w-4 rounded border-border bg-background cursor-pointer"
                                            />
                                            <div className="flex items-center gap-1">
                                                {Array.from({ length: rating }).map((_, i) => (
                                                    <Star key={i} size={14} className="fill-accent text-accent" />
                                                ))}
                                                <span className="ml-1 text-xs text-muted-foreground">& up</span>
                                            </div>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Products Grid */}
                    <div className="lg:col-span-4">
                        {/* Mobile Filter Button */}
                        <button
                            onClick={() => setShowFilters(true)}
                            className="mb-6 flex lg:hidden items-center gap-2 rounded-lg border border-border bg-card px-4 py-2 text-sm text-foreground hover:bg-secondary transition-colors"
                        >
                            <Sliders size={16} />
                            Show Filters
                        </button>

                        {filteredProducts.length > 0 ? (
                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                                {filteredProducts.map((product) => {
                                    const discountedPrice = getDiscountedPrice(
                                        product.price,
                                        product.discountPercentage
                                    )
                                    const isFavorited = wishlist.has(product.id)

                                    return (
                                        <Link href={`/product/${product._id}`} key={product._id}>
                                            <Card

                                                className="group overflow-hidden border-border hover:border-primary transition-all hover:shadow-lg py-0"
                                            >
                                                <CardContent className="p-0">
                                                    {/* Image Container */}
                                                    <div className="relative overflow-hidden bg-secondary h-48">
                                                        <div className='w-full h-full'>

                                                            <Image fill
                                                                src={product.thumbnail || "/placeholder.svg"}
                                                                alt={product.title}
                                                                className="h-full w-full object-contain group-hover:scale-110 transition-transform duration-300"
                                                            />
                                                        </div>

                                                        {/* Discount Badge */}
                                                        {product.discountPercentage > 0 && (
                                                            <Badge className="absolute top-3 left-3 bg-accent text-accent-foreground hover:bg-accent">
                                                                -{product.discountPercentage.toFixed(0)}%
                                                            </Badge>
                                                        )}

                                                        {/* Wishlist Button */}
                                                        <button
                                                            onClick={(e) => {
                                                                e.preventDefault()
                                                                e.stopPropagation()
                                                                toggleWishlist(product.id)
                                                            }}
                                                            className="absolute top-3 right-3 rounded-full bg-card p-2 shadow-md hover:bg-primary hover:text-primary-foreground transition-colors"
                                                        >
                                                            <Heart
                                                                size={18}
                                                                className={isFavorited ? 'fill-current text-accent' : 'text-foreground'}
                                                            />
                                                        </button>

                                                        {/* Stock Status */}
                                                        {product.stock < 10 && (
                                                            <div className="absolute bottom-3 left-3">
                                                                <Badge variant="outline" className="bg-background/80">
                                                                    Only {product.stock} left
                                                                </Badge>
                                                            </div>
                                                        )}
                                                    </div>

                                                    {/* Content */}
                                                    <div className="p-4">
                                                        <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wide">
                                                            {product.category.replace('-', ' ')}
                                                        </p>

                                                        <h3 className="text-sm font-semibold text-foreground line-clamp-2 mb-2 group-hover:text-primary transition-colors">
                                                            {product.title}
                                                        </h3>

                                                        {/* Rating */}
                                                        <div className="mb-3 flex items-center gap-2">
                                                            <div className="flex items-center gap-0.5">
                                                                {Array.from({ length: 5 }).map((_, i) => (
                                                                    <Star
                                                                        key={i}
                                                                        size={14}
                                                                        className={`${i < Math.round(product.rating)
                                                                            ? 'fill-accent text-accent'
                                                                            : 'text-border'
                                                                            }`}
                                                                    />
                                                                ))}
                                                            </div>
                                                            <span className="text-xs text-muted-foreground">
                                                                ({product.rating})
                                                            </span>
                                                        </div>

                                                        {/* Price */}
                                                        <div className="mb-4 flex items-baseline gap-2">
                                                            <span className="text-lg font-bold text-primary">
                                                                ₹{(discountedPrice * 91.91).toFixed(2)}
                                                            </span>
                                                            {product.discountPercentage > 0 && (
                                                                <span className="text-xs text-muted-foreground line-through">
                                                                    ₹{(product.price * 91.91).toFixed(2)}
                                                                </span>
                                                            )}
                                                        </div>

                                                        {/* Add to Cart Button */}
                                                        <Button onClick={(e)=>addToCart(e, product)} className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                                                            Add to Cart
                                                        </Button>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        </Link>
                                    )
                                })}
                            </div>
                        ) : (
                            <div className="rounded-lg border border-border bg-card p-12 text-center">
                                <p className="text-foreground font-semibold mb-2">No products found</p>
                                <p className="text-sm text-muted-foreground">
                                    Try adjusting your filters or search criteria
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SearchResults
