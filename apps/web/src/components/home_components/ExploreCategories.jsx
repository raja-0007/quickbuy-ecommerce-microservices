import React, { useEffect, useState } from 'react'
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '../ui/carousel'
import { Card, CardContent, CardFooter } from '../ui/card'
import { axiosHandle } from '@/lib/api'
import Image from 'next/image'

const ExploreCategories = () => {

    const [categories, setCategories] = useState([])

    const getCategories = async() =>{
        try{
            const res = await axiosHandle.get('/products/categories');
            setCategories(res.data.categories)
        }catch(err){
            console.log('Error fetching categories:', err);
        }
    }

    useEffect(()=>{
        getCategories()
    },[])
    return (
        <div className='mt-36'>
            <div className='font-bold text-lg'>Explore Categories</div>
            <div className='relative w-[97%] mx-auto'><Carousel className="w-full mt-10">
                <CarouselContent className={' -ml-[0]'}>
                    {categories.map((item, index) => (
                        <CarouselItem key={index} className={'basis-1/6 pl-0'}>
                            <div className="p- h-full">
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
                            </div>
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