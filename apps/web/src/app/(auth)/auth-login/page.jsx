"use client"
import { getSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import React, { useEffect } from 'react'

const page = () => {
    const router = useRouter()
    const handleRedirection=async()=>{
        const session = await getSession()

            if (!session) {
                router.replace('/login')
                return
            }

            if (session.user.role === "seller") {
                router.replace("/seller/dashboard")
            } else if (session.user.role === "admin") {
                router.replace("/admin")
            } else {
                router.replace("/")
            }
    }
    useEffect(() => {

        handleRedirection()
    }, [])
    return (
        <div className='min-h-screen flex items-center justify-center font-semibold text-xl animate-pulse'>Logging In...</div>
    )
}

export default page