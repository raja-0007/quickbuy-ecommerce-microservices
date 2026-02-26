import React from 'react'
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '../ui/carousel'
import { Card, CardContent } from '../ui/card'
import Image from 'next/image'
import Link from 'next/link'

const ExploreCategories = async () => {

    let categories = []

    try {
        const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/products/categories`,
            // { cache: 'no-store' },
            { next: { revalidate: 60 * 60 } }
        )

        const categoriesResponse = await res.json()
        categories = categoriesResponse.categories

    } catch (err) {
        console.log('Error fetching deals:', err)
    }
    return (
        <div className='mt-36'>
            <div className='font-bold text-lg'>Explore Categories</div>
            <div className='relative w-[97%] mx-auto'><Carousel className="w-full mt-10">
                <CarouselContent className={' -ml-[0]'}>
                    {categories.map((item, index) => (
                        <CarouselItem key={index} className={'basis-1/6 pl-0'}>
                            <Link href={`/search-results?searchQuery=${item.title}`} className="p- h-full">
                                <Card className={'h-full py-0 border-0 bg-transparent shadow-none'}>
                                    <CardContent className="relative h-full items-center justify-center p-0">
                                        <div className='w-40 h-40 mx-auto bg-secondary relative rounded-full border'>
                                            <Image fill src={item.image} alt={item.title} className='object-contain hover:scale-105 transition-transform' />
                                        </div>
                                        <div className='w-full text-center mt-5'>
                                            <p className='text-md capitalize'>{item.title.replaceAll('-', ' ')}</p>
                                        </div>
                                    </CardContent>

                                </Card>
                            </Link>
                        </CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
            </Carousel></div>

        </div>
    )
}

export default ExploreCategories