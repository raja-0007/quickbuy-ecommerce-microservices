import { CreditCard, Edit2, Plus, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { TabsContent } from '@/components/ui/tabs'

export default function ProfilePaymentsTab({
  isAddingPayment,
  editingPaymentId,
  paymentForm,
  setPaymentForm,
  handleUpdatePayment,
  handleAddPayment,
  setIsAddingPayment,
  setEditingPaymentId,
  paymentMethods,
  handleEditPayment,
  handleSetDefaultPayment,
  handleDeletePayment,
}) {
  return (
    <TabsContent value="payments" className="space-y-6">
      {isAddingPayment || editingPaymentId ? (
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="text-foreground">{editingPaymentId ? 'Edit Card' : 'Add New Card'}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-foreground" htmlFor="brand">
                Card Brand
              </Label>
              <select
                id="brand"
                value={paymentForm.brand}
                onChange={(e) => setPaymentForm({ ...paymentForm, brand: e.target.value })}
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
                onChange={(e) => setPaymentForm({ ...paymentForm, last4: e.target.value.slice(0, 4) })}
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
                onChange={(e) => setPaymentForm({ ...paymentForm, expiry: e.target.value })}
                className="mt-1 border-border bg-background text-foreground"
                placeholder="12/25"
              />
            </div>
            <div className="flex gap-3 pt-4">
              <Button
                onClick={() => (editingPaymentId ? handleUpdatePayment(editingPaymentId) : handleAddPayment())}
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
            <Button onClick={() => setIsAddingPayment(true)} className="gap-2 bg-primary hover:bg-primary/90">
              <Plus size={18} />
              Add Card
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {paymentMethods.length === 0 ? (
              <p className="py-4 text-center text-muted-foreground">No payment methods added yet</p>
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
                          <p className="font-semibold text-foreground">{payment.brand} .... {payment.last4}</p>
                          <p className="text-sm text-muted-foreground">Expires {payment.expiry}</p>
                        </div>
                      </div>
                      {payment.isDefault && <Badge className="mt-2 bg-accent text-accent-foreground">Default</Badge>}
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
  )
}
