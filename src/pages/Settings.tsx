import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Settings, 
  User, 
  Bell, 
  Shield, 
  Palette,
  Database,
  Wifi,
  Save,
  Download,
  Upload,
  Trash2,
  Monitor,
  Sun,
  Moon,
  Smartphone,
  Plus
} from "lucide-react";

export default function SettingsPage() {
  const [theme, setTheme] = useState("system");
  const [notifications, setNotifications] = useState({
    lowStock: true,
    expiry: true,
    highDemand: false,
    system: true,
    email: true,
    sms: false
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-hero bg-clip-text text-transparent">
            Settings
          </h1>
          <p className="text-muted-foreground mt-2">
            Configure your SmartShelf platform preferences and integrations.
          </p>
        </div>
        <Button className="bg-gradient-primary hover:opacity-90 text-white">
          <Save className="w-4 h-4 mr-2" />
          Save Changes
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Settings Navigation */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm text-muted-foreground uppercase tracking-wide">
                Settings Menu
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="secondary" className="w-full justify-start">
                <User className="w-4 h-4 mr-2" />
                Profile & Account
              </Button>
              <Button variant="ghost" className="w-full justify-start">
                <Bell className="w-4 h-4 mr-2" />
                Notifications
              </Button>
              <Button variant="ghost" className="w-full justify-start">
                <Palette className="w-4 h-4 mr-2" />
                Appearance
              </Button>
              <Button variant="ghost" className="w-full justify-start">
                <Database className="w-4 h-4 mr-2" />
                Data & Backup
              </Button>
              <Button variant="ghost" className="w-full justify-start">
                <Wifi className="w-4 h-4 mr-2" />
                Integrations
              </Button>
              <Button variant="ghost" className="w-full justify-start">
                <Shield className="w-4 h-4 mr-2" />
                Security
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Main Settings Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Profile & Account */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="w-5 h-5 mr-2 text-primary" />
                Profile & Account
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input id="firstName" placeholder="Enter first name" defaultValue="John" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input id="lastName" placeholder="Enter last name" defaultValue="Doe" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" type="email" placeholder="Enter email" defaultValue="john.doe@smartshelf.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input id="phone" placeholder="Enter phone number" defaultValue="+91 98765 43210" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="businessName">Business Name</Label>
                <Input id="businessName" placeholder="Enter business name" defaultValue="SmartShelf Demo Store" />
              </div>
            </CardContent>
          </Card>

          {/* Appearance */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Palette className="w-5 h-5 mr-2 text-primary" />
                Appearance
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Theme Preference</Label>
                <Select value={theme} onValueChange={setTheme}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">
                      <div className="flex items-center">
                        <Sun className="w-4 h-4 mr-2" />
                        Light Mode
                      </div>
                    </SelectItem>
                    <SelectItem value="dark">
                      <div className="flex items-center">
                        <Moon className="w-4 h-4 mr-2" />
                        Dark Mode
                      </div>
                    </SelectItem>
                    <SelectItem value="system">
                      <div className="flex items-center">
                        <Monitor className="w-4 h-4 mr-2" />
                        System Default
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Language</Label>
                <Select defaultValue="en">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="hi">हिंदी (Hindi)</SelectItem>
                    <SelectItem value="mr">मराठी (Marathi)</SelectItem>
                    <SelectItem value="ta">தமிழ் (Tamil)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Notifications */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Bell className="w-5 h-5 mr-2 text-primary" />
                Notification Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Low Stock Alerts</Label>
                    <p className="text-sm text-muted-foreground">Get notified when items are running low</p>
                  </div>
                  <Switch 
                    checked={notifications.lowStock}
                    onCheckedChange={(checked) => setNotifications(prev => ({...prev, lowStock: checked}))}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Expiry Warnings</Label>
                    <p className="text-sm text-muted-foreground">Alerts for products nearing expiry</p>
                  </div>
                  <Switch 
                    checked={notifications.expiry}
                    onCheckedChange={(checked) => setNotifications(prev => ({...prev, expiry: checked}))}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <Label>High Demand Alerts</Label>
                    <p className="text-sm text-muted-foreground">Notifications for trending products</p>
                  </div>
                  <Switch 
                    checked={notifications.highDemand}
                    onCheckedChange={(checked) => setNotifications(prev => ({...prev, highDemand: checked}))}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive alerts via email</p>
                  </div>
                  <Switch 
                    checked={notifications.email}
                    onCheckedChange={(checked) => setNotifications(prev => ({...prev, email: checked}))}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <Label>SMS Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive critical alerts via SMS</p>
                  </div>
                  <Switch 
                    checked={notifications.sms}
                    onCheckedChange={(checked) => setNotifications(prev => ({...prev, sms: checked}))}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* SmartShelf Integration */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Wifi className="w-5 h-5 mr-2 text-primary" />
                SmartShelf IoT Integration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
                    <Wifi className="w-5 h-5 text-success" />
                  </div>
                  <div>
                    <h4 className="font-medium">Shelf Sensor #1</h4>
                    <p className="text-sm text-muted-foreground">Grocery Section A</p>
                  </div>
                </div>
                <Badge className="bg-success/10 text-success">Connected</Badge>
              </div>
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center">
                    <Wifi className="w-5 h-5 text-warning" />
                  </div>
                  <div>
                    <h4 className="font-medium">Shelf Sensor #2</h4>
                    <p className="text-sm text-muted-foreground">Medicine Section</p>
                  </div>
                </div>
                <Badge className="bg-warning/10 text-warning">Offline</Badge>
              </div>
              <Button className="w-full bg-gradient-primary text-white">
                <Plus className="w-4 h-4 mr-2" />
                Add New Sensor
              </Button>
            </CardContent>
          </Card>

          {/* Data & Backup */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Database className="w-5 h-5 mr-2 text-primary" />
                Data & Backup
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button variant="outline" className="h-auto p-4">
                  <div className="flex flex-col items-center">
                    <Download className="w-6 h-6 mb-2" />
                    <span>Export Data</span>
                    <span className="text-xs text-muted-foreground">Download CSV/PDF reports</span>
                  </div>
                </Button>
                <Button variant="outline" className="h-auto p-4">
                  <div className="flex flex-col items-center">
                    <Upload className="w-6 h-6 mb-2" />
                    <span>Import Data</span>
                    <span className="text-xs text-muted-foreground">Upload inventory from CSV</span>
                  </div>
                </Button>
              </div>
              <div className="p-4 border rounded-lg bg-muted/20">
                <h4 className="font-medium mb-2">Automatic Backup</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Last backup: Today at 3:00 AM
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Daily automatic backup</span>
                  <Switch defaultChecked />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Security */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="w-5 h-5 mr-2 text-primary" />
                Security & Privacy
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button variant="outline" className="w-full justify-start">
                Change Password
              </Button>
              <Button variant="outline" className="w-full justify-start">
                Two-Factor Authentication
              </Button>
              <Button variant="outline" className="w-full justify-start">
                Active Sessions
              </Button>
              <Separator />
              <div className="p-4 border border-destructive/20 rounded-lg bg-destructive/5">
                <h4 className="font-medium text-destructive mb-2">Danger Zone</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Irreversible actions that will permanently delete your data.
                </p>
                <Button variant="destructive" size="sm">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Account
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}