import * as React from "react"
import { Card, CardContent } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/hero_carousel"
import Image from "next/image"

export function HeroCarousel() {
    const imagesArray = [
        '/images/carousel_1.jpg',
         '/images/carousel_2.jpg',
          '/images/carousel_3.jpg',
           '/images/carousel_4.jpg',
            '/images/carousel_5.jpg',
             '/images/carousel_6.jpg',
              '/images/carousel_7.jpg'
    ]

  return (
    <div className="relative w-full">
    <Carousel className="w-full">
      <CarouselContent className={'h-[600px] -ml-[0]'}>
        {imagesArray.map((img, index) => (
          <CarouselItem key={index} className={'pl-0'}>
            <div className="p- h-full">
              <Card className={'h-full py-0'}>
                <CardContent className="relative h-full items-center justify-center p-0">
                  <Image src={img} fill className="w-full h-full object-cover" alt={`carousel_img_${index}`} />
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
    <div className="bg-gradient-to-b z-10 from-transparent to-background pointer-events-none h-[400px] w-full absolute bottom-0"></div>
    </div>
  )
}
