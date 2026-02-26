import React from 'react'
import { HeroCarousel } from './HeroCarousel'
import ExploreCategories from './ExploreCategories'
import TrustSignals from './TrustSignals'
import Footer from './Footer'
import DealsSection from './DealsSection'

const LandingPage = ({ deals }) => {


  return (
    <>
      <div className='p-5 pt-0 mb-10 min-h-screen'>


        <HeroCarousel />


        <DealsSection deals={deals} />
        <section className='w-full h-full px-5'>
          <ExploreCategories />
        </section>

      </div>
      <TrustSignals />
      <Footer />
    </>

  )
}

export default LandingPage