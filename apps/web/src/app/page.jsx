
import LandingPage from '@/components/home_components/LandingPage';
// import { useEffect, useState } from 'react';
// import { axiosHandle } from '@/lib/api';

export default async function Home() {
  let deals = []

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/products/deals/home`,
      // { cache: 'no-store' },
      {next: { revalidate: 60*60 }}
    )

    const dealsResponse = await res.json()
    deals = dealsResponse.deals

  } catch (err) {
    console.log('Error fetching deals:', err)
  }
  return (
    <div className='bg-background text-foreground'>
      {/* <Navbar/> */}
      <LandingPage deals={deals} />
      {/* <br /> */}
      {/* <button onClick={logout} className="bg-emerald-500 text-white p-3 rounded-xl">
        logout
      </button>
      <br />
      <button onClick={ToggleTheme} className="bg-emerald-500 text-white p-3 rounded-xl">
        change theme from {theme}
      </button> */}
    </div>
  );
}
