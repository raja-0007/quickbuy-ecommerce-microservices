"use client"
import { signIn, signOut } from 'next-auth/react'
import { useTheme } from "next-themes";
import Navbar from '@/components/home_components/Navbar';
import LandingPage from '@/components/home_components/LandingPage';
import { useEffect, useState } from 'react';
import { axiosHandle } from '@/lib/api';

export default function Home() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [deals, setDeals] = useState([]);
  const getDeals = async()=>{
    try{
      const dealsResponse = await axiosHandle.get('/products/deals/home');
      console.log('Deals response:', dealsResponse.data);
      setDeals(dealsResponse.data.deals);
    }catch(err){
      console.log('Error fetching deals:', err);
    }
  }

  useEffect(() => {
    setMounted(true)
  }, [])

  const ToggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light')
  }

  useEffect(()=>{
    getDeals()
  },[])

  const logout = () => {
    signOut()
  }

  // Don't render theme-dependent content until mounted
  if (!mounted) {
    return (
      <div>
        welcome to ecommerce app
        <br />
        <button onClick={logout} className="bg-emerald-500 text-white p-3 rounded-xl">
          logout
        </button>
      </div>
    )
  }

  return (
    <div className='bg-background text-foreground'>
      {/* <Navbar/> */}
      <LandingPage deals={deals}/>
      {/* <br /> */}
      <button onClick={logout} className="bg-emerald-500 text-white p-3 rounded-xl">
        logout
      </button>
      <br />
      <button onClick={ToggleTheme} className="bg-emerald-500 text-white p-3 rounded-xl">
        change theme from {theme}
      </button>
    </div>
  );
}
