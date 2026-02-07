'use client'

import React, { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Edit2, LogOut, MapPin, CreditCard, ShoppingBag, Clock, ChevronRight, Plus, Trash2, Eye, EyeOff } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { axiosHandle } from '@/lib/api'
import Image from 'next/image'
import { useSearchParams } from 'next/navigation'

const MOCK_USER = {
  id: '1',
  firstName: 'Sarah',
  lastName: 'Anderson',
  email: 'sarah.anderson@example.com',
  phone: '+1 (555) 123-4567',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
  joinDate: 'January 15, 2023',
}

const MOCK_ORDERS = [
  {
    id: 'ORD-001',
    date: '2024-01-28',
    total: 287.99,
    status: 'Delivered',
    items: 3,
  },
  {
    id: 'ORD-002',
    date: '2024-01-15',
    total: 156.50,
    status: 'Delivered',
    items: 2,
  },
  {
    id: 'ORD-003',
    date: '2024-01-08',
    total: 412.75,
    status: 'Delivered',
    items: 5,
  },
]

const MOCK_ADDRESSES = [
  {
    id: '1',
    type: 'Home',
    street: '123 Oak Street',
    city: 'San Francisco',
    state: 'CA',
    zip: '94102',
    country: 'USA',
    isDefault: true,
  },
  {
    id: '2',
    type: 'Work',
    street: '456 Tech Avenue',
    city: 'San Francisco',
    state: 'CA',
    zip: '94103',
    country: 'USA',
    isDefault: false,
  },
]

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
  const [profile, setProfile] = useState(MOCK_USER)
  const [profileForm, setProfileForm] = useState(MOCK_USER)
  const [addresses, setAddresses] = useState(MOCK_ADDRESSES)
  const [paymentMethods, setPaymentMethods] = useState(MOCK_PAYMENT_METHODS)
  const [isAddingAddress, setIsAddingAddress] = useState(false)
  const [isAddingPayment, setIsAddingPayment] = useState(false)
  const [editingAddressId, setEditingAddressId] = useState(null)
  const [editingPaymentId, setEditingPaymentId] = useState(null)
  const [mounted,setMounted]=useState(false)
  const {data: session, status} = useSession()
  const [orders, setOrders] = useState([])
  const params = useSearchParams()

  useEffect(()=>{
    if(status !== 'loading' && params){
      const tab = params.get('tab')
      if(tab){
        if(tab == 'orders'){
          const element = document.getElementById('orders')
          element?.scrollIntoView({behavior: 'smooth', block: 'start'})
        }
      }
    }
  },[status, params])
  const [addressForm, setAddressForm] = useState({
    type: 'Home',
    street: '',
    city: '',
    state: '',
    zip: '',
    country: 'USA',
  })
  const [paymentForm, setPaymentForm] = useState({
    brand: 'Visa',
    last4: '',
    expiry: '',
  })



  // Profile CRUD operations
  const handleUpdateProfile = () => {
    setProfile(profileForm)
    setIsEditingProfile(false)
  }

  const handleProfileChange = (e) => {
    const { id, value } = e.target
    setProfileForm((prev) => ({ ...prev, [id]: value }))
  }

  // Address CRUD operations
  const handleAddAddress = () => {
    if (!addressForm.street || !addressForm.city) {
      alert('Please fill in all required fields')
      return
    }
    const newAddress = {
      id: Date.now().toString(),
      ...addressForm,
      isDefault: addresses.length === 0,
    }
    setAddresses([...addresses, newAddress])
    setAddressForm({
      type: 'Home',
      street: '',
      city: '',
      state: '',
      zip: '',
      country: 'USA',
    })
    setIsAddingAddress(false)
  }

  const handleUpdateAddress = (id) => {
    if (!addressForm.street || !addressForm.city) {
      alert('Please fill in all required fields')
      return
    }
    setAddresses(
      addresses.map((addr) =>
        addr.id === id ? { ...addr, ...addressForm } : addr
      )
    )
    setEditingAddressId(null)
    setAddressForm({
      type: 'Home',
      street: '',
      city: '',
      state: '',
      zip: '',
      country: 'USA',
    })
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

  // Payment CRUD operations
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
    setPaymentMethods(
      paymentMethods.map((payment) =>
        payment.id === id
          ? { ...payment, ...paymentForm }
          : payment
      )
    )
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

  useEffect(()=>{
    setMounted(true)
  },[])


  const getOrders = async () =>{
    try{
      const res = await axiosHandle.get(`/orders/getUserOrders`)
      console.log('Fetched orders:', res.data)
      setOrders(res.data)
    }catch(err){
      console.log('Error fetching orders:', err)
    }
  }
  useEffect(() => {
      if (status !== 'loading') {
  
        getOrders()
      }
  
    }, [status])


  if(!mounted || status == 'loading') return null

  return (
    <div className="min-h-screen bg-background py-8 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">My Account</h1>
          <p className="mt-1 text-muted-foreground">Manage your profile, orders, and preferences</p>
        </div>

        {/* Profile Overview Card */}
        <Card className="mb-8 border-border bg-card">
          <CardContent className="p-6">
            <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4">
                <img
                  src={profile.avatar || "/placeholder.svg"}
                  alt={`${profile.firstName} ${profile.lastName}`}
                  className="h-16 w-16 rounded-full border-2 border-primary bg-background"
                />
                <div>
                  <h2 className="text-2xl font-bold text-foreground">
                    {profile.firstName} {profile.lastName}
                  </h2>
                  <p className="text-muted-foreground">{profile.email}</p>
                  <p className="text-sm text-muted-foreground">Member since {profile.joinDate}</p>
                </div>
              </div>
              <Button
                onClick={() => setIsEditingProfile(!isEditingProfile)}
                className="gap-2 bg-primary hover:bg-primary/90"
              >
                <Edit2 size={18} />
                Edit Profile
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Main Content Tabs */}
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="mb-6 grid w-full grid-cols-4 bg-secondary">
            <TabsTrigger value="overview" className="text-foreground data-[state=active]:!bg-primary data-[state=active]:!text-primary-foreground">
              Overview
            </TabsTrigger>
            <TabsTrigger value="addresses" className="text-foreground data-[state=active]:!bg-primary data-[state=active]:!text-primary-foreground">
              Addresses
            </TabsTrigger>
            <TabsTrigger value="payments" className="text-foreground data-[state=active]:!bg-primary data-[state=active]:!text-primary-foreground">
              Payments
            </TabsTrigger>
            <TabsTrigger value="settings" className="text-foreground data-[state=active]:!bg-primary data-[state=active]:!text-primary-foreground">
              Settings
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <Card className="border-border bg-card">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-foreground">Profile Information</CardTitle>
                  <CardDescription>Your personal account details</CardDescription>
                </div>
                <Button
                  onClick={() => {
                    setProfileForm(profile)
                    setIsEditingProfile(true)
                  }}
                  className="gap-2 bg-primary hover:bg-primary/90"
                >
                  <Edit2 size={18} />
                  Edit Profile
                </Button>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <p className="text-sm text-muted-foreground">First Name</p>
                    <p className="mt-1 font-medium text-foreground">{profile.firstName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Last Name</p>
                    <p className="mt-1 font-medium text-foreground">{profile.lastName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="mt-1 font-medium text-foreground">{profile.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Phone</p>
                    <p className="mt-1 font-medium text-foreground">{profile.phone}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Member Since</p>
                    <p className="mt-1 font-medium text-foreground">{profile.joinDate}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Edit Profile Modal */}
            <Dialog open={isEditingProfile} onOpenChange={setIsEditingProfile}>
              <DialogContent className="border-border bg-card">
                <DialogHeader>
                  <DialogTitle className="text-foreground">Edit Profile</DialogTitle>
                  <DialogDescription>Update your personal account details</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <Label className="text-foreground" htmlFor="firstName">
                        First Name
                      </Label>
                      <Input
                        id="firstName"
                        value={profileForm.firstName}
                        onChange={handleProfileChange}
                        className="mt-1 border-border bg-background text-foreground"
                      />
                    </div>
                    <div>
                      <Label className="text-foreground" htmlFor="lastName">
                        Last Name
                      </Label>
                      <Input
                        id="lastName"
                        value={profileForm.lastName}
                        onChange={handleProfileChange}
                        className="mt-1 border-border bg-background text-foreground"
                      />
                    </div>
                  </div>
                  <div>
                    <Label className="text-foreground" htmlFor="email">
                      Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={profileForm.email}
                      onChange={handleProfileChange}
                      className="mt-1 border-border bg-background text-foreground"
                    />
                  </div>
                  <div>
                    <Label className="text-foreground" htmlFor="phone">
                      Phone
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={profileForm.phone}
                      onChange={handleProfileChange}
                      className="mt-1 border-border bg-background text-foreground"
                    />
                  </div>
                  <div className="flex gap-3 pt-4">
                    <Button
                      onClick={handleUpdateProfile}
                      className="bg-primary hover:bg-primary/90"
                    >
                      Save Changes
                    </Button>
                    <Button
                      onClick={() => setIsEditingProfile(false)}
                      variant="outline"
                      className="border-border text-foreground hover:bg-secondary"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            {/* Recent Orders */}
            <Card className="border-border bg-card">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-foreground">Recent Orders</CardTitle>
                    <CardDescription>Your last 3 orders</CardDescription>
                  </div>
                  <ShoppingBag size={24} className="text-primary" />
                </div>
              </CardHeader>
              <CardContent>
                <div id='orders' className="space-y-3 scroll-mt-[100px]">
                  {orders.map((order) => (
                    <div key={order._id} className="rounded-lg border border-border bg-background p-4">
                      {/* Order Header */}
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <p className="font-semibold text-foreground">Order ID: {order._id.slice(0, 8)}</p>
                          <div className="mt-1 flex items-center gap-2">
                            <Clock size={14} className="text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">
                              {new Date(order.createdAt).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                              })}
                            </span>
                          </div>
                        </div>
                        <Badge
                          className={`${
                            order.status === 'DELIVERED'
                              ? 'bg-green-500 text-white'
                              : 'bg-amber-500 text-white'
                          }`}
                        >
                          {order.status === 'DELIVERED' ? 'Delivered' : 'Processing'}
                        </Badge>
                      </div>

                      {/* Order Items Grid */}
                      <div className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="group flex flex-col rounded-lg border border-border bg-muted/50 p-3 transition-all hover:border-primary hover:shadow-md">
                            {/* Product Image */}
                            <div className="relative mb-2 overflow-hidden rounded bg-background">
                              <div className='w-full h-24 relative'>

                              <Image
                                src={item.imageUrl || "/placeholder.svg"}
                                alt={item.title}
                                fill
                                className=" object-contain transition-transform group-hover:scale-105"
                                
                              />
                              </div>
                              
                              {item.discountPercentage > 0 && (
                                <div className="absolute top-1 right-1 rounded bg-accent px-1.5 py-0.5 text-xs font-semibold text-accent-foreground">
                                  -{item.discountPercentage.toFixed(0)}%
                                </div>
                              )}
                            </div>

                            {/* Product Info */}
                            <div className="flex flex-1 flex-col">
                              <p className="text-xs font-semibold text-foreground line-clamp-2">{item.title}</p>
                              <p className="mt-0.5 text-xs text-muted-foreground">{item.brand}</p>
                              <p className="mt-1 text-xs font-medium text-primary">Qty: {item.quantity}</p>
                              
                              {/* Price */}
                              <div className="mt-auto pt-2">
                                <p className="text-xs font-bold text-foreground">
                                  ₹{item.totalPrice.toFixed(2)}
                                </p>
                              </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="mt-2 flex flex-col gap-1">
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-7 text-xs border-primary text-primary hover:text-foreground hover:bg-primary/10 bg-transparent"
                              >
                                View
                              </Button>
                              {order.status === 'DELIVERED' && (
                                <Button
                                  size="sm"
                                  className="h-7 text-xs bg-accent hover:bg-accent/90 text-accent-foreground"
                                >
                                  Buy
                                </Button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Price Summary & Payment */}
                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        {/* Price Details */}
                        <div className="rounded-lg bg-muted/30 p-3">
                          <div className="space-y-1 text-xs">
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Subtotal</span>
                              <span className="text-foreground font-medium">₹{order.priceDetails.subTotal.toFixed(2)}</span>
                            </div>
                            {order.priceDetails.tax > 0 && (
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Tax</span>
                                <span className="text-foreground font-medium">₹{order.priceDetails.tax.toFixed(2)}</span>
                              </div>
                            )}
                            {order.priceDetails.shipping > 0 && (
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Shipping</span>
                                <span className="text-foreground font-medium">₹{order.priceDetails.shipping.toFixed(2)}</span>
                              </div>
                            )}
                            <div className="border-t border-border pt-1 flex justify-between font-semibold">
                              <span className="text-foreground">Total</span>
                              <span className="text-primary text-sm">₹{order.priceDetails.total.toFixed(2)}</span>
                            </div>
                          </div>
                        </div>

                        {/* Payment Info */}
                        <div className="rounded-lg bg-muted/30 p-3">
                          <div className="space-y-1 text-xs">
                            <div className="flex items-center justify-between">
                              <span className="text-muted-foreground">Payment</span>
                              <span className="text-foreground font-medium">{order.paymentDetails.method}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-muted-foreground">Status</span>
                              <Badge variant="outline" className="h-5 border-primary text-primary text-xs">
                                {order.paymentDetails.status}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Payment Info */}
                      <div className="mt-3 flex items-center justify-between rounded bg-muted p-2 text-xs">
                        <span className="text-muted-foreground">
                          Paid via {order.paymentDetails.method}
                        </span>
                        <Badge variant="outline" className="border-primary text-primary">
                          {order.paymentDetails.status}
                        </Badge>
                      </div>

                      {/* Order Actions */}
                      <div className="mt-3 flex gap-2">
                        {order.status === 'DELIVERED' ? (
                          <Button
                            size="sm"
                            className="flex-1 bg-primary hover:bg-primary/90 text-sm"
                          >
                            Buy All Items Again
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            className="flex-1 bg-accent hover:bg-accent/90 text-accent-foreground text-sm"
                          >
                            Check Delivery Status
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Addresses Tab */}
          <TabsContent value="addresses" className="space-y-6">
            {isAddingAddress || editingAddressId ? (
              <Card className="border-border bg-card">
                <CardHeader>
                  <CardTitle className="text-foreground">
                    {editingAddressId ? 'Edit Address' : 'Add New Address'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="text-foreground" htmlFor="type">
                      Address Type
                    </Label>
                    <select
                      id="type"
                      value={addressForm.type}
                      onChange={(e) =>
                        setAddressForm({ ...addressForm, type: e.target.value })
                      }
                      className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-foreground"
                    >
                      <option>Home</option>
                      <option>Work</option>
                      <option>Other</option>
                    </select>
                  </div>
                  <div>
                    <Label className="text-foreground" htmlFor="street">
                      Street Address *
                    </Label>
                    <Input
                      id="street"
                      value={addressForm.street}
                      onChange={(e) =>
                        setAddressForm({ ...addressForm, street: e.target.value })
                      }
                      className="mt-1 border-border bg-background text-foreground"
                      placeholder="123 Main Street"
                    />
                  </div>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <Label className="text-foreground" htmlFor="city">
                        City *
                      </Label>
                      <Input
                        id="city"
                        value={addressForm.city}
                        onChange={(e) =>
                          setAddressForm({ ...addressForm, city: e.target.value })
                        }
                        className="mt-1 border-border bg-background text-foreground"
                        placeholder="San Francisco"
                      />
                    </div>
                    <div>
                      <Label className="text-foreground" htmlFor="state">
                        State
                      </Label>
                      <Input
                        id="state"
                        value={addressForm.state}
                        onChange={(e) =>
                          setAddressForm({ ...addressForm, state: e.target.value })
                        }
                        className="mt-1 border-border bg-background text-foreground"
                        placeholder="CA"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <Label className="text-foreground" htmlFor="zip">
                        ZIP Code
                      </Label>
                      <Input
                        id="zip"
                        value={addressForm.zip}
                        onChange={(e) =>
                          setAddressForm({ ...addressForm, zip: e.target.value })
                        }
                        className="mt-1 border-border bg-background text-foreground"
                        placeholder="94102"
                      />
                    </div>
                    <div>
                      <Label className="text-foreground" htmlFor="country">
                        Country
                      </Label>
                      <Input
                        id="country"
                        value={addressForm.country}
                        onChange={(e) =>
                          setAddressForm({ ...addressForm, country: e.target.value })
                        }
                        className="mt-1 border-border bg-background text-foreground"
                        placeholder="USA"
                      />
                    </div>
                  </div>
                  <div className="flex gap-3 pt-4">
                    <Button
                      onClick={() =>
                        editingAddressId
                          ? handleUpdateAddress(editingAddressId)
                          : handleAddAddress()
                      }
                      className="bg-primary hover:bg-primary/90"
                    >
                      {editingAddressId ? 'Update Address' : 'Add Address'}
                    </Button>
                    <Button
                      onClick={() => {
                        setIsAddingAddress(false)
                        setEditingAddressId(null)
                        setAddressForm({
                          type: 'Home',
                          street: '',
                          city: '',
                          state: '',
                          zip: '',
                          country: 'USA',
                        })
                      }}
                      variant="outline"
                      className="border-border text-foreground hover:bg-secondary"
                    >
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="border-border bg-card">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-foreground">Saved Addresses</CardTitle>
                    <CardDescription>Manage your delivery addresses</CardDescription>
                  </div>
                  <Button
                    onClick={() => setIsAddingAddress(true)}
                    className="gap-2 bg-primary hover:bg-primary/90"
                  >
                    <Plus size={18} />
                    Add Address
                  </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                  {addresses.length === 0 ? (
                    <p className="text-center text-muted-foreground py-4">No addresses added yet</p>
                  ) : (
                    addresses.map((address) => (
                      <div key={address.id} className="rounded-lg border border-border bg-background p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-3 flex-1">
                            <MapPin size={20} className="mt-1 text-primary flex-shrink-0" />
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <h4 className="font-semibold text-foreground">{address.type}</h4>
                                {address.isDefault && (
                                  <Badge className="bg-accent text-accent-foreground">Default</Badge>
                                )}
                              </div>
                              <p className="mt-1 text-sm text-foreground">{address.street}</p>
                              <p className="text-sm text-muted-foreground">
                                {address.city}, {address.state} {address.zip}
                              </p>
                              <p className="text-sm text-muted-foreground">{address.country}</p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEditAddress(address)}
                              className="text-primary hover:bg-primary/10"
                            >
                              <Edit2 size={18} />
                            </Button>
                            {!address.isDefault && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleSetDefaultAddress(address.id)}
                                className="text-muted-foreground hover:text-primary"
                              >
                                Set Default
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteAddress(address.id)}
                              className="text-destructive hover:bg-destructive/10"
                            >
                              <Trash2 size={18} />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Payments Tab */}
          <TabsContent value="payments" className="space-y-6">
            {isAddingPayment || editingPaymentId ? (
              <Card className="border-border bg-card">
                <CardHeader>
                  <CardTitle className="text-foreground">
                    {editingPaymentId ? 'Edit Card' : 'Add New Card'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="text-foreground" htmlFor="brand">
                      Card Brand
                    </Label>
                    <select
                      id="brand"
                      value={paymentForm.brand}
                      onChange={(e) =>
                        setPaymentForm({ ...paymentForm, brand: e.target.value })
                      }
                      className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-foreground"
                    >
                      <option>Visa</option>
                      <option>Mastercard</option>
                      <option>American Express</option>
                      <option>Discover</option>
                    </select>
                  </div>
                  <div>
                    <Label className="text-foreground" htmlFor="last4">
                      Last 4 Digits *
                    </Label>
                    <Input
                      id="last4"
                      value={paymentForm.last4}
                      onChange={(e) =>
                        setPaymentForm({ ...paymentForm, last4: e.target.value.slice(0, 4) })
                      }
                      maxLength="4"
                      className="mt-1 border-border bg-background text-foreground"
                      placeholder="4242"
                    />
                  </div>
                  <div>
                    <Label className="text-foreground" htmlFor="expiry">
                      Expiry Date (MM/YY) *
                    </Label>
                    <Input
                      id="expiry"
                      value={paymentForm.expiry}
                      onChange={(e) =>
                        setPaymentForm({ ...paymentForm, expiry: e.target.value })
                      }
                      className="mt-1 border-border bg-background text-foreground"
                      placeholder="12/25"
                    />
                  </div>
                  <div className="flex gap-3 pt-4">
                    <Button
                      onClick={() =>
                        editingPaymentId
                          ? handleUpdatePayment(editingPaymentId)
                          : handleAddPayment()
                      }
                      className="bg-primary hover:bg-primary/90"
                    >
                      {editingPaymentId ? 'Update Card' : 'Add Card'}
                    </Button>
                    <Button
                      onClick={() => {
                        setIsAddingPayment(false)
                        setEditingPaymentId(null)
                        setPaymentForm({
                          brand: 'Visa',
                          last4: '',
                          expiry: '',
                        })
                      }}
                      variant="outline"
                      className="border-border text-foreground hover:bg-secondary"
                    >
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="border-border bg-card">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-foreground">Payment Methods</CardTitle>
                    <CardDescription>Manage your payment options</CardDescription>
                  </div>
                  <Button
                    onClick={() => setIsAddingPayment(true)}
                    className="gap-2 bg-primary hover:bg-primary/90"
                  >
                    <Plus size={18} />
                    Add Card
                  </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                  {paymentMethods.length === 0 ? (
                    <p className="text-center text-muted-foreground py-4">No payment methods added yet</p>
                  ) : (
                    paymentMethods.map((payment) => (
                      <div
                        key={payment.id}
                        className="rounded-lg border border-border bg-gradient-to-r from-background to-secondary p-4"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <CreditCard size={20} className="text-primary" />
                              <div>
                                <p className="font-semibold text-foreground">
                                  {payment.brand} •••• {payment.last4}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  Expires {payment.expiry}
                                </p>
                              </div>
                            </div>
                            {payment.isDefault && (
                              <Badge className="mt-2 bg-accent text-accent-foreground">
                                Default
                              </Badge>
                            )}
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEditPayment(payment)}
                              className="text-primary hover:bg-primary/10"
                            >
                              <Edit2 size={18} />
                            </Button>
                            {!payment.isDefault && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleSetDefaultPayment(payment.id)}
                                className="text-muted-foreground hover:text-primary"
                              >
                                Set Default
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeletePayment(payment.id)}
                              className="text-destructive hover:bg-destructive/10"
                            >
                              <Trash2 size={18} />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle className="text-foreground">Preferences</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between py-3">
                  <div>
                    <p className="font-medium text-foreground">Email Notifications</p>
                    <p className="text-sm text-muted-foreground">Receive updates about orders and promotions</p>
                  </div>
                  <input type="checkbox" defaultChecked className="h-5 w-5 rounded border-primary" />
                </div>
                <div className="border-t border-border pt-6" />
                <div className="flex items-center justify-between py-3">
                  <div>
                    <p className="font-medium text-foreground">SMS Notifications</p>
                    <p className="text-sm text-muted-foreground">Get alerts on your phone</p>
                  </div>
                  <input type="checkbox" className="h-5 w-5 rounded border-primary" />
                </div>
                <div className="border-t border-border pt-6" />
                <div className="flex items-center justify-between py-3">
                  <div>
                    <p className="font-medium text-foreground">Newsletter</p>
                    <p className="text-sm text-muted-foreground">Subscribe to our weekly newsletter</p>
                  </div>
                  <input type="checkbox" defaultChecked className="h-5 w-5 rounded border-primary" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle className="text-foreground">Security</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-foreground" htmlFor="current-password">
                    Change Password
                  </Label>
                  <div className="relative mt-2">
                    <Input
                      id="current-password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter new password"
                      className="border-border bg-background pr-10 text-foreground"
                    />
                    <button
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
                <Button className="w-full bg-primary hover:bg-primary/90">Update Password</Button>
              </CardContent>
            </Card>

            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle className="text-foreground">Danger Zone</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Once you delete your account, there is no going back. Please be certain.
                </p>
                <Button variant="outline" className="w-full border-destructive text-destructive hover:bg-destructive/10 bg-transparent">
                  Delete Account
                </Button>
                <Button className="w-full gap-2 bg-destructive hover:bg-destructive/90">
                  <LogOut size={18} />
                  Logout
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
