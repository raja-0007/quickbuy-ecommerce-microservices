'use client'

import React, { useState } from 'react'
import { Settings as SettingsIcon, Save } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState({
    platformName: 'ShopHub',
    commissionPercentage: 5,
    taxRate: 18,
    minOrderValue: 100,
    maxOrderValue: 500000,
    enableUserRegistration: true,
    enableSellerRegistration: true,
    enableReviews: true,
    enableWishlist: true,
    maintenanceMode: false,
    requireEmailVerification: true,
    maxUploadSize: 10,
  })

  const [saved, setSaved] = useState(false)

  const handleInputChange = (e) => {
    const { name, value, type } = e.target
    setSettings((prev) => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) : value,
    }))
    setSaved(false)
  }

  const handleToggle = (name) => {
    setSettings((prev) => ({
      ...prev,
      [name]: !prev[name],
    }))
    setSaved(false)
  }

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Platform Settings</h1>
          <p className="text-muted-foreground mt-2">Manage platform configuration and preferences</p>
        </div>

        {/* General Settings */}
        <Card className="border-border bg-card mb-6">
          <CardHeader>
            <CardTitle className="text-foreground flex items-center gap-2">
              <SettingsIcon className="h-5 w-5" />
              General Settings
            </CardTitle>
            <CardDescription>Basic platform configuration</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label htmlFor="platformName" className="text-foreground">
                Platform Name
              </Label>
              <Input
                id="platformName"
                name="platformName"
                value={settings.platformName}
                onChange={handleInputChange}
                className="mt-2"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="commissionPercentage" className="text-foreground">
                  Commission Percentage (%)
                </Label>
                <Input
                  id="commissionPercentage"
                  name="commissionPercentage"
                  type="number"
                  value={settings.commissionPercentage}
                  onChange={handleInputChange}
                  className="mt-2"
                />
              </div>
              <div>
                <Label htmlFor="taxRate" className="text-foreground">
                  Tax Rate (%)
                </Label>
                <Input
                  id="taxRate"
                  name="taxRate"
                  type="number"
                  value={settings.taxRate}
                  onChange={handleInputChange}
                  className="mt-2"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="minOrderValue" className="text-foreground">
                  Minimum Order Value (₹)
                </Label>
                <Input
                  id="minOrderValue"
                  name="minOrderValue"
                  type="number"
                  value={settings.minOrderValue}
                  onChange={handleInputChange}
                  className="mt-2"
                />
              </div>
              <div>
                <Label htmlFor="maxOrderValue" className="text-foreground">
                  Maximum Order Value (₹)
                </Label>
                <Input
                  id="maxOrderValue"
                  name="maxOrderValue"
                  type="number"
                  value={settings.maxOrderValue}
                  onChange={handleInputChange}
                  className="mt-2"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="maxUploadSize" className="text-foreground">
                Maximum File Upload Size (MB)
              </Label>
              <Input
                id="maxUploadSize"
                name="maxUploadSize"
                type="number"
                value={settings.maxUploadSize}
                onChange={handleInputChange}
                className="mt-2"
              />
            </div>
          </CardContent>
        </Card>

        {/* Feature Toggles */}
        <Card className="border-border bg-card mb-6">
          <CardHeader>
            <CardTitle className="text-foreground">Feature Toggles</CardTitle>
            <CardDescription>Enable or disable platform features</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { key: 'enableUserRegistration', label: 'Allow User Registration' },
              { key: 'enableSellerRegistration', label: 'Allow Seller Registration' },
              { key: 'enableReviews', label: 'Enable Product Reviews' },
              { key: 'enableWishlist', label: 'Enable Wishlist Feature' },
              { key: 'requireEmailVerification', label: 'Require Email Verification' },
            ].map(({ key, label }) => (
              <div key={key} className="flex items-center justify-between p-4 rounded-lg border border-border">
                <Label className="text-foreground cursor-pointer">{label}</Label>
                <Switch
                  checked={settings[key]}
                  onCheckedChange={() => handleToggle(key)}
                />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Maintenance Mode */}
        <Card className="border-border bg-card mb-6">
          <CardHeader>
            <CardTitle className="text-foreground">Maintenance</CardTitle>
            <CardDescription>System maintenance options</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between p-4 rounded-lg border border-red-200 bg-red-50">
              <div>
                <Label className="text-foreground font-semibold">Maintenance Mode</Label>
                <p className="text-sm text-muted-foreground mt-1">
                  When enabled, only admins can access the platform
                </p>
              </div>
              <Switch
                checked={settings.maintenanceMode}
                onCheckedChange={() => handleToggle('maintenanceMode')}
              />
            </div>
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="flex gap-3">
          <Button
            onClick={handleSave}
            className="gap-2 bg-primary hover:bg-primary/90"
          >
            <Save className="h-4 w-4" />
            Save Settings
          </Button>
          {saved && (
            <div className="flex items-center text-green-600 font-medium">
              ✓ Settings saved successfully
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
