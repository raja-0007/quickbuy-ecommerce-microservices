'use client'

import React, { useEffect, useState } from 'react'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useSession } from 'next-auth/react'
import { axiosHandle } from '@/lib/api'
import { useSearchParams } from 'next/navigation'
import { useTheme } from 'next-themes'
import customToast from '@/lib/CustomToast'
import { v4 as uuidv4 } from 'uuid'
import ProfileHeaderCard from '@/components/profile_components/ProfileHeaderCard'
import ProfileOverviewTab from '@/components/profile_components/ProfileOverviewTab'
import ProfileAddressesTab from '@/components/profile_components/ProfileAddressesTab'
import ProfilePaymentsTab from '@/components/profile_components/ProfilePaymentsTab'
import ProfileSettingsTab from '@/components/profile_components/ProfileSettingsTab'

const MOCK_USER = {
  id: '1',
  firstName: 'Sarah',
  lastName: 'Anderson',
  email: 'sarah.anderson@example.com',
  phone: '+1 (555) 123-4567',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
  joinDate: 'January 15, 2023',
}

const MOCK_PAYMENT_METHODS = [
  {
    id: '1',
    type: 'card',
    brand: 'Visa',
    last4: '4242',
    expiry: '12/25',
    isDefault: true,
  },
  {
    id: '2',
    type: 'card',
    brand: 'Mastercard',
    last4: '5555',
    expiry: '08/26',
    isDefault: false,
  },
]

export default function ProfilePage() {
  const [isEditingProfile, setIsEditingProfile] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [profile, setProfile] = useState(null)
  const [profileForm, setProfileForm] = useState(null)
  const [addresses, setAddresses] = useState([])
  const [paymentMethods, setPaymentMethods] = useState(MOCK_PAYMENT_METHODS)
  const [isAddingAddress, setIsAddingAddress] = useState(false)
  const [isAddingPayment, setIsAddingPayment] = useState(false)
  const [editingAddressId, setEditingAddressId] = useState(null)
  const [editingPaymentId, setEditingPaymentId] = useState(null)
  const [mounted, setMounted] = useState(false)
  const { data: session, status } = useSession()
  const [orders, setOrders] = useState([])
  const params = useSearchParams()
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    if (status !== 'loading' && params) {
      const tab = params.get('tab')
      if (tab === 'orders') {
        const element = document.getElementById('orders')
        element?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    }
  }, [status, params])

  const [addressForm, setAddressForm] = useState({
    type: 'Home',
    street: '',
    city: '',
    state: '',
    zip: '',
    country: 'IN',
    phone: '',
  })

  const [paymentForm, setPaymentForm] = useState({
    brand: 'Visa',
    last4: '',
    expiry: '',
  })

  const handleUpdateProfile = async () => {
    try {
      let payload = {
        ...profileForm,
        firstName: profileForm?.firstName || session.user.name,
        email: profileForm?.email || session.user.email,
      }
      let res = null
      if (!profile) {
        res = await axiosHandle.post('/users/createUser', payload)
      } else {
        res = await axiosHandle.put('/users/updateUser', payload)
      }
      customToast({ message: 'Profile updated successfully!', type: 'success' })
      setProfile(res.data)
    } catch (err) {
      console.log('Error updating profile:', err)
      customToast({ message: 'Something went wrong, try again later.', type: 'error' })
    }
    setProfile(profileForm)
    setIsEditingProfile(false)
  }

  const handleProfileChange = (e) => {
    let { id, value } = e.target

    if (id === 'phone') {
      value = value.replace(/[^0-9]/g, '').slice(0, 10)
    }

    setProfileForm((prev) => ({ ...prev, [id]: value }))
  }

  const handleAddAddress = async () => {
    if (!addressForm.street || !addressForm.city) {
      alert('Please fill in all required fields')
      return
    }
    const newAddress = {
      id: uuidv4(),
      ...addressForm,
      isDefault: addresses.length === 0,
    }
    try {
      const res = await axiosHandle.put('/users/updateAddress', newAddress)
      console.log('Address added successfully:', res.data)
      setAddresses(res.data.addresses)
      setIsAddingAddress(false)
      customToast({ message: 'Address added successfully!', type: 'success' })

      setAddressForm({
        type: 'Home',
        street: '',
        city: '',
        state: '',
        zip: '',
        country: 'IN',
        phone: '',
      })
    } catch (err) {
      console.log(err)
      customToast({ message: 'Something went wrong, try again later.', type: 'error' })
    }
  }

  const handleUpdateAddress = async (id) => {
    if (!addressForm.street || !addressForm.city) {
      alert('Please fill in all required fields')
      return
    }
    try {
      const newAddress = {
        id,
        ...addressForm,
      }
      const res = await axiosHandle.put('/users/updateAddress', newAddress)
      console.log('Address added successfully:', res.data)
      setAddresses(res.data.addresses)
      setEditingAddressId(null)
      customToast({ message: 'Address added successfully!', type: 'success' })

      setAddressForm({
        type: 'Home',
        street: '',
        city: '',
        state: '',
        zip: '',
        country: 'IN',
        phone: '',
      })
    } catch (err) {
      console.log(err)
      customToast({ message: 'Something went wrong, try again later.', type: 'error' })
    }
  }

  const handleDeleteAddress = (id) => {
    setAddresses(addresses.filter((addr) => addr.id !== id))
  }

  const handleEditAddress = (address) => {
    setEditingAddressId(address.id)
    setAddressForm({
      type: address.type,
      street: address.street,
      city: address.city,
      state: address.state,
      zip: address.zip,
      country: address.country,
      phone: address.phone,
    })
  }

  const handleSetDefaultAddress = (id) => {
    setAddresses(
      addresses.map((addr) => ({
        ...addr,
        isDefault: addr.id === id,
      }))
    )
  }

  const handleAddPayment = () => {
    if (!paymentForm.last4 || !paymentForm.expiry) {
      alert('Please fill in all required fields')
      return
    }
    const newPayment = {
      id: Date.now().toString(),
      type: 'card',
      ...paymentForm,
      isDefault: paymentMethods.length === 0,
    }
    setPaymentMethods([...paymentMethods, newPayment])
    setPaymentForm({
      brand: 'Visa',
      last4: '',
      expiry: '',
    })
    setIsAddingPayment(false)
  }

  const handleUpdatePayment = (id) => {
    if (!paymentForm.last4 || !paymentForm.expiry) {
      alert('Please fill in all required fields')
      return
    }
    setPaymentMethods(paymentMethods.map((payment) => (payment.id === id ? { ...payment, ...paymentForm } : payment)))
    setEditingPaymentId(null)
    setPaymentForm({
      brand: 'Visa',
      last4: '',
      expiry: '',
    })
  }

  const handleDeletePayment = (id) => {
    setPaymentMethods(paymentMethods.filter((payment) => payment.id !== id))
  }

  const handleEditPayment = (payment) => {
    setEditingPaymentId(payment.id)
    setPaymentForm({
      brand: payment.brand,
      last4: payment.last4,
      expiry: payment.expiry,
    })
  }

  const handleSetDefaultPayment = (id) => {
    setPaymentMethods(
      paymentMethods.map((payment) => ({
        ...payment,
        isDefault: payment.id === id,
      }))
    )
  }

  useEffect(() => {
    setMounted(true)
  }, [])

  const getOrders = async () => {
    try {
      const res = await axiosHandle.get('/orders/getUserOrders')
      console.log('Fetched orders:', res.data)
      setOrders(res.data)
    } catch (err) {
      console.log('Error fetching orders:', err)
    }
  }

  const getProfile = async () => {
    try {
      const res = await axiosHandle.get('/users/getProfile')
      console.log('Fetched profile:', res.data)
      setProfile(res.data)
      setAddresses(res.data.addresses)
    } catch (err) {
      console.log('Error fetching profile:', err)
    }
  }

  useEffect(() => {
    if (status !== 'loading') {
      getOrders()
      getProfile()
    }
  }, [status])

  const handleThemeToggle = () => {
    setTheme(theme === 'light' ? 'dark' : 'light')
  }

  if (!mounted || status === 'loading') return null

  return (
    <div className="min-h-screen bg-background px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">My Account</h1>
          <p className="mt-1 text-muted-foreground">Manage your profile, orders, and preferences</p>
        </div>

        <ProfileHeaderCard
          profile={profile}
          session={session}
          onEditProfile={() => {
            setIsEditingProfile(!isEditingProfile)
            setProfileForm(profile)
          }}
        />

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="mb-6 grid w-full grid-cols-4 bg-secondary">
            <TabsTrigger
              value="overview"
              className="text-foreground data-[state=active]:!bg-primary data-[state=active]:!text-primary-foreground"
            >
              Overview
            </TabsTrigger>
            <TabsTrigger
              value="addresses"
              className="text-foreground data-[state=active]:!bg-primary data-[state=active]:!text-primary-foreground"
            >
              Addresses
            </TabsTrigger>
            <TabsTrigger
              value="payments"
              className="text-foreground data-[state=active]:!bg-primary data-[state=active]:!text-primary-foreground"
            >
              Payments
            </TabsTrigger>
            <TabsTrigger
              value="settings"
              className="text-foreground data-[state=active]:!bg-primary data-[state=active]:!text-primary-foreground"
            >
              Settings
            </TabsTrigger>
          </TabsList>

          <ProfileOverviewTab
            profile={profile}
            session={session}
            profileForm={profileForm}
            isEditingProfile={isEditingProfile}
            setIsEditingProfile={setIsEditingProfile}
            handleProfileChange={handleProfileChange}
            handleUpdateProfile={handleUpdateProfile}
            setProfileForm={setProfileForm}
            orders={orders}
          />

          <ProfileAddressesTab
            isAddingAddress={isAddingAddress}
            editingAddressId={editingAddressId}
            addressForm={addressForm}
            setAddressForm={setAddressForm}
            handleUpdateAddress={handleUpdateAddress}
            handleAddAddress={handleAddAddress}
            setIsAddingAddress={setIsAddingAddress}
            setEditingAddressId={setEditingAddressId}
            addresses={addresses}
            handleEditAddress={handleEditAddress}
            handleSetDefaultAddress={handleSetDefaultAddress}
            handleDeleteAddress={handleDeleteAddress}
          />

          <ProfilePaymentsTab
            isAddingPayment={isAddingPayment}
            editingPaymentId={editingPaymentId}
            paymentForm={paymentForm}
            setPaymentForm={setPaymentForm}
            handleUpdatePayment={handleUpdatePayment}
            handleAddPayment={handleAddPayment}
            setIsAddingPayment={setIsAddingPayment}
            setEditingPaymentId={setEditingPaymentId}
            paymentMethods={paymentMethods}
            handleEditPayment={handleEditPayment}
            handleSetDefaultPayment={handleSetDefaultPayment}
            handleDeletePayment={handleDeletePayment}
          />

          <ProfileSettingsTab
            theme={theme}
            handleThemeToggle={handleThemeToggle}
            showPassword={showPassword}
            setShowPassword={setShowPassword}
          />
        </Tabs>
      </div>
    </div>
  )
}
