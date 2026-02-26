import { Eye, EyeOff, LogOut, Moon, Sun } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { TabsContent } from '@/components/ui/tabs'

export default function ProfileSettingsTab({ theme, handleThemeToggle, showPassword, setShowPassword }) {
  return (
    <TabsContent value="settings" className="space-y-6">
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="text-foreground">Preferences</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between py-3">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-muted p-2">
                {theme === 'dark' ? <Moon size={20} className="text-primary" /> : <Sun size={20} className="text-accent" />}
              </div>
              <div>
                <p className="font-medium text-foreground">Theme</p>
                <p className="text-sm text-muted-foreground">Switch between light and dark theme</p>
              </div>
            </div>
            <Switch className="bg-secondary" checked={theme === 'dark'} onCheckedChange={handleThemeToggle} />
          </div>
          <div className="border-t border-border pt-6" />
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
          <Button
            variant="outline"
            className="w-full border-destructive bg-transparent text-destructive hover:bg-destructive/10"
          >
            Delete Account
          </Button>
          <Button className="w-full gap-2 bg-destructive hover:bg-destructive/90">
            <LogOut size={18} />
            Logout
          </Button>
        </CardContent>
      </Card>
    </TabsContent>
  )
}
