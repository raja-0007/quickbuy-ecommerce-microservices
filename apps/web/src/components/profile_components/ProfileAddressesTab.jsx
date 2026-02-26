import { Edit2, MapPin, Plus, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { TabsContent } from '@/components/ui/tabs'

export default function ProfileAddressesTab({
  isAddingAddress,
  editingAddressId,
  addressForm,
  setAddressForm,
  handleUpdateAddress,
  handleAddAddress,
  setIsAddingAddress,
  setEditingAddressId,
  addresses,
  handleEditAddress,
  handleSetDefaultAddress,
  handleDeleteAddress,
}) {
  return (
    <TabsContent value="addresses" className="space-y-6">
      {isAddingAddress || editingAddressId ? (
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="text-foreground">{editingAddressId ? 'Edit Address' : 'Add New Address'}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-foreground" htmlFor="type">
                Address Type
              </Label>
              <select
                id="type"
                value={addressForm.type}
                onChange={(e) => setAddressForm({ ...addressForm, type: e.target.value })}
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
                onChange={(e) => setAddressForm({ ...addressForm, street: e.target.value })}
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
                  onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
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
                  onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })}
                  className="mt-1 border-border bg-background text-foreground"
                  placeholder="CA"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div>
                <Label className="text-foreground" htmlFor="zip">
                  ZIP Code
                </Label>
                <Input
                  id="zip"
                  value={addressForm.zip}
                  onChange={(e) => setAddressForm({ ...addressForm, zip: e.target.value })}
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
                  onChange={(e) => setAddressForm({ ...addressForm, country: e.target.value })}
                  className="mt-1 border-border bg-background text-foreground"
                  placeholder="USA"
                />
              </div>
              <div>
                <Label className="text-foreground" htmlFor="phone">
                  Phone
                </Label>
                <Input
                  id="phone"
                  value={addressForm.phone}
                  onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })}
                  className="mt-1 border-border bg-background text-foreground"
                  placeholder="Ex. 1234567896"
                />
              </div>
            </div>
            <div className="flex gap-3 pt-4">
              <Button
                onClick={() => (editingAddressId ? handleUpdateAddress(editingAddressId) : handleAddAddress())}
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
                    country: 'IN',
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
            <Button onClick={() => setIsAddingAddress(true)} className="gap-2 bg-primary hover:bg-primary/90">
              <Plus size={18} />
              Add Address
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {addresses.length === 0 ? (
              <p className="py-4 text-center text-muted-foreground">No addresses added yet</p>
            ) : (
              addresses.map((address) => (
                <div key={address.id} className="rounded-lg border border-border bg-background p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex flex-1 items-start gap-3">
                      <MapPin size={20} className="mt-1 flex-shrink-0 text-primary" />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold text-foreground">{address.type}</h4>
                          {address.isDefault && <Badge className="bg-accent text-accent-foreground">Default</Badge>}
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
  )
}
