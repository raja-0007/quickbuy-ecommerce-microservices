import React from 'react'
import { HeroCarousel } from './HeroCarousel'
import { Card, CardContent, CardFooter, CardHeader } from '../ui/card'
import Image from 'next/image'
import ExploreCategories from './ExploreCategories'
import TrustSignals from './TrustSignals'
import Footer from './Footer'

const LandingPage = ({ deals }) => {

  console.log('Deals in LandingPage:', deals);
  return (
    <>
    <div className='p-5 pt-0 mb-10 min-h-screen'>

      <HeroCarousel />
      

      <div className='relative w-full'>

        <div className='absolute px-5 w-full bottom-[-60px] h-[400px] bg-gradient-to-b from-transparent to-background pointer-events-none z-10 grid grid-cols-4 gap-10'>
          <Card >
            <CardHeader className={'text-lg font-black'}>Trending Deals</CardHeader>
            <CardContent className={'grid grid-cols-2 gap-5'}>
              {deals.trending && deals.trending.slice(0, 4).map((item, index) => (
                <div key={index} className='flex flex-col items-center justify-center relative'>
                  <div className='w-20 h-20 relative'>
                    <Image fill src={item.images[0]} alt={item.title} className='w-20 h-20 object-contain' />
                  </div>
                  <p className='text-sm text-center- mt-1 truncate w-full'>{item.title}</p>
                </div>
              ))}
            </CardContent>
            <CardFooter className={'text-sm text-primary'}>see more</CardFooter>
          </Card>

          <Card>
            <CardHeader className={'text-lg font-black'}>Best Sellers</CardHeader>
            <CardContent className={'grid grid-cols-2 gap-5'}>
              {deals.best_seller && deals.best_seller.slice(0, 4).map((item, index) => (
                <div key={index} className='flex flex-col items-center justify-center relative'>
                  <div className='w-28 h-20 relative'>
                    <Image fill src={item.images[0]} alt={item.title} className='' />
                  </div>
                  <p className='text-sm text-center- mt-2 truncate w-full'>{item.title}</p>
                </div>
              ))}
            </CardContent>
            <CardFooter className={'text-sm text-primary'}>see more</CardFooter>
          </Card>

          <Card>
            <CardHeader className={'text-lg font-black'}>New Arrivals</CardHeader>
            <CardContent className={'grid grid-cols-2 gap-5'}>
              {deals.new_arrival && deals.new_arrival.slice(0, 4).map((item, index) => (
                <div key={index} className='flex flex-col items-center justify-center relative'>
                  <div className='w-20 h-20 relative'>
                    <Image fill src={item.images[0]} alt={item.title} className='w-20 h-20 object-contain' />
                  </div>
                  <p className='text-sm text-center- mt-2 truncate w-full'>{item.title}</p>
                </div>
              ))}
            </CardContent>
            <CardFooter className={'text-sm text-primary'}>see more</CardFooter>
          </Card>

          <Card>
            <CardHeader className={'text-lg font-black'}>Up to 50% Off</CardHeader>
            <CardContent className={'grid grid-cols-2 gap-5'}>
              {deals.up_to_50_off && deals.up_to_50_off.slice(0, 4).map((item, index) => (
                <div key={index} className='flex flex-col items-center justify-center relative'>
                  <div className='w-20 h-20 relative'>
                    <Image fill src={item.images[0]} alt={item.title} className='w-20 h-20 object-contain' />
                  </div>
                  <p className='text-sm text-center- mt-2 truncate w-full'>{item.title}</p>
                </div>
              ))}
            </CardContent>
            <CardFooter className={'text-sm text-primary'}>see more</CardFooter>
          </Card>
        </div>
      </div>
<section className='w-full h-full px-5'>
      <ExploreCategories/>
      </section>

    </div>
      <TrustSignals/>
      <Footer/>
    </>
    
  )
}

export default LandingPage