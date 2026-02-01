"use client"
import { useSession } from 'next-auth/react'
import React from 'react'

const page = () => {
    const {data: session} = useSession()

    if(!session){
        return <div>You are not logged in</div>
    }
  return (
    <div className='w-full h-screen '>{session.user.name} and {session.user.role}</div>
  )
}

export default page