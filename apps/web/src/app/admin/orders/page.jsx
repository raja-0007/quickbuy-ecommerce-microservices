'use client'

import AdminOrdersClient from './AdminOrdersClient'
import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import axios from 'axios'
import { authOptions } from '../../api/auth/[...nextauth]/route'

const fetchOrdersServer = async (accessToken) => {
  const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/orders/getAllOrders`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })
  return Array.isArray(res.data) ? res.data : res.data.orders || []
}

export default async function AdminOrdersPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.accessToken) {
    redirect('/login')
  }

  const orders = await fetchOrdersServer(session.user.accessToken)

  return <AdminOrdersClient initialOrders={orders} />
}
