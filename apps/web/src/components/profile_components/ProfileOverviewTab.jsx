import Image from 'next/image'
import Link from 'next/link'
import { Edit2, ShoppingBag, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { TabsContent } from '@/components/ui/tabs'

export default function ProfileOverviewTab({
  profile,
  session,
  profileForm,
  isEditingProfile,
  setIsEditingProfile,
  handleProfileChange,
  handleUpdateProfile,
  setProfileForm,
  orders,
}) {
  return (
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
              <p className="mt-1 font-medium text-foreground">{profile?.firstName || session.user.name}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Last Name</p>
              <p className="mt-1 font-medium text-foreground">{profile?.lastName || '-'}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Email</p>
              <p className="mt-1 font-medium text-foreground">{profile?.email || session.user.email}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Phone</p>
              <p className="mt-1 font-medium text-foreground">{profile?.phone || '-'}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Member Since</p>
              <p className="mt-1 font-medium text-foreground">{profile?.joinDate || '-'}</p>
            </div>
          </div>
        </CardContent>
      </Card>

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
                  value={profileForm?.firstName || session.user.name}
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
                  value={profileForm?.lastName || ''}
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
                readOnly
                value={profileForm?.email || session.user.email}
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
                inputMode="numeric"
                maxLength="10"
                placeholder="123-456-7890"
                value={profileForm?.phone || ''}
                onChange={handleProfileChange}
                required
                className="mt-1 border-border bg-background text-foreground"
              />
            </div>
            <div className="flex gap-3 pt-4">
              <Button onClick={handleUpdateProfile} className="bg-primary hover:bg-primary/90">
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
          <div id="orders" className="space-y-3 scroll-mt-[100px]">
            {orders.map((order) => (
              <div key={order._id} className="rounded-lg border border-border bg-background p-4">
                <div className="mb-4 flex items-center justify-between">
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
                    className={order.status === 'DELIVERED' ? 'bg-green-500 text-white' : 'bg-amber-500 text-white'}
                  >
                    {order.status === 'DELIVERED' ? 'Delivered' : 'Processing'}
                  </Badge>
                </div>

                <div className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                  {order.items.map((item, idx) => (
                    <div
                      key={idx}
                      className="group flex flex-col rounded-lg border border-border bg-muted/50 p-3 transition-all hover:border-primary hover:shadow-md"
                    >
                      <div className="relative mb-2 overflow-hidden rounded bg-background">
                        <div className="relative h-24 w-full">
                          <Image
                            src={item.imageUrl || '/placeholder.svg'}
                            alt={item.title}
                            fill
                            className="object-contain transition-transform group-hover:scale-105"
                          />
                        </div>

                        {item.discountPercentage > 0 && (
                          <div className="absolute right-1 top-1 rounded bg-accent px-1.5 py-0.5 text-xs font-semibold text-accent-foreground">
                            -{item.discountPercentage.toFixed(0)}%
                          </div>
                        )}
                      </div>

                      <div className="flex flex-1 flex-col">
                        <p className="line-clamp-2 text-xs font-semibold text-foreground">{item.title}</p>
                        <p className="mt-0.5 text-xs text-muted-foreground">{item.brand}</p>
                        <p className="mt-1 text-xs font-medium text-primary">Qty: {item.quantity}</p>

                        <div className="mt-auto pt-2">
                          <p className="text-xs font-bold text-foreground">Rs {item.totalPrice.toFixed(2)}</p>
                        </div>
                      </div>

                      <div className="mt-2 flex flex-col gap-1">
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-7 border-primary bg-transparent text-xs text-primary hover:bg-primary/10 hover:text-foreground"
                        >
                          View
                        </Button>
                        {order.status === 'DELIVERED' && (
                          <Button size="sm" className="h-7 bg-accent text-xs text-accent-foreground hover:bg-accent/90">
                            Buy
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div className="rounded-lg bg-muted/30 p-3">
                    <div className="space-y-1 text-xs">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Subtotal</span>
                        <span className="font-medium text-foreground">Rs {order.priceDetails.subTotal.toFixed(2)}</span>
                      </div>
                      {order.priceDetails.tax > 0 && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Tax</span>
                          <span className="font-medium text-foreground">Rs {order.priceDetails.tax.toFixed(2)}</span>
                        </div>
                      )}
                      {order.priceDetails.shipping > 0 && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Shipping</span>
                          <span className="font-medium text-foreground">Rs {order.priceDetails.shipping.toFixed(2)}</span>
                        </div>
                      )}
                      <div className="flex justify-between border-t border-border pt-1 font-semibold">
                        <span className="text-foreground">Total</span>
                        <span className="text-sm text-primary">Rs {order.priceDetails.total.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-lg bg-muted/30 p-3">
                    <div className="space-y-1 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Payment</span>
                        <span className="font-medium text-foreground">{order.paymentDetails.method}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Status</span>
                        <Badge variant="outline" className="h-5 border-primary text-xs text-primary">
                          {order.paymentDetails.status}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-3 flex items-center justify-between rounded bg-muted p-2 text-xs">
                  <span className="text-muted-foreground">Paid via {order.paymentDetails.method}</span>
                  <Badge variant="outline" className="border-primary text-primary">
                    {order.paymentDetails.status}
                  </Badge>
                </div>

                <div className="mt-3 flex gap-2">
                  {order.status === 'DELIVERED' ? (
                    <Button size="sm" className="flex-1 bg-primary text-sm hover:bg-primary/90">
                      Buy All Items Again
                    </Button>
                  ) : (
                    <Button size="sm" className="flex-1 bg-accent text-sm text-accent-foreground hover:bg-accent/90">
                      Check Delivery Status
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
          {orders.length > 0 && (
            <div className="mt-4 flex justify-center">
              <Link href="/orders">
                <Button className="bg-primary hover:bg-primary/90">View All Orders</Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </TabsContent>
  )
}
