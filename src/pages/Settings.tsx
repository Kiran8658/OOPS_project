import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
  Plus,
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

export default function SettingsPage() {
  const { toast } = useToast();

  const [theme, setTheme] = useState("system");
  const [notifications, setNotifications] = useState({
    lowStock: true,
    expiry: true,
    highDemand: false,
    system: true,
    email: true,
    sms: false,
  });

  // Apply theme on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "system";
    setTheme(savedTheme);
    applyTheme(savedTheme);
  }, []);

  const applyTheme = (value: string) => {
    document.documentElement.classList.remove("dark");
    if (value === "dark") {
      document.documentElement.classList.add("dark");
    } else if (value === "system") {
      const darkQuery = window.matchMedia("(prefers-color-scheme: dark)");
      if (darkQuery.matches) document.documentElement.classList.add("dark");
    }
  };

  const handleThemeChange = (value: string) => {
    setTheme(value);
    applyTheme(value);
    localStorage.setItem("theme", value);
  };

  const handleSave = () => {
    localStorage.setItem("notifications", JSON.stringify(notifications));
    toast({
      title: "Settings Saved",
      description: "Your preferences have been successfully updated.",
    });
  };

  const handleExport = () => {
    const blob = new Blob(["SmartShelf backup data"], { type: "text/plain" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "smartshelf-backup.txt";
    link.click();

    toast({
      title: "Data Exported",
      description: "Your SmartShelf data has been exported successfully.",
    });
  };

  const handleImport = () => {
    toast({
      title: "Import Data",
      description: "Feature coming soon — data import will be supported shortly.",
    });
  };

  const handleAddSensor = () => {
    toast({
      title: "New Sensor Added",
      description: "A new IoT shelf sensor has been added to the network.",
    });
  };

  const handleChangePassword = () => {
    toast({
      title: "Password Change",
      description: "You will receive an email to reset your password.",
    });
  };

  const handleTwoFactor = () => {
    toast({
      title: "2FA Enabled",
      description: "Two-factor authentication is now active for your account.",
    });
  };

  const handleDeleteAccount = () => {
    if (
      window.confirm(
        "⚠ Are you sure you want to delete your account? This action cannot be undone."
      )
    ) {
      toast({
        title: "Account Deleted",
        description: "Your SmartShelf account and data have been deleted.",
      });
    }
  };

  return (
    <div className="p-8 space-y-8 bg-gradient-to-br from-indigo-50 to-white min-h-screen">
      {/* Header */}
      <div className="flex items-center space-x-3">
        <Settings className="w-8 h-8 text-indigo-600" />
        <h1 className="text-3xl font-semibold text-gray-800">Settings</h1>
      </div>

      {/* Profile Settings */}
      <Card className="shadow-lg border-0">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-lg">
            <User className="w-5 h-5 text-blue-600" />
            <span>Profile Settings</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div>
            <Label>Full Name</Label>
            <Input placeholder="John Doe" />
          </div>
          <div>
            <Label>Email Address</Label>
            <Input placeholder="john@example.com" type="email" />
          </div>
          <div>
            <Label>Phone Number</Label>
            <Input placeholder="+91 98765 43210" />
          </div>
          <div>
            <Label>Role</Label>
            <Input placeholder="Store Manager" disabled />
          </div>
          <div className="md:col-span-2 flex justify-end">
            <Button
              onClick={handleSave}
              className="bg-gradient-to-r from-blue-600 to-indigo-500 hover:opacity-90 text-white shadow-md"
            >
              <Save className="w-4 h-4 mr-2" /> Save Changes
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Theme Settings */}
      <Card className="shadow-lg border-0">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-lg">
            <Palette className="w-5 h-5 text-purple-600" />
            <span>Theme & Display</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Label>Theme</Label>
          <Select value={theme} onValueChange={handleThemeChange}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select Theme" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="light">
                <div className="flex items-center">
                  <Sun className="w-4 h-4 mr-2" /> Light
                </div>
              </SelectItem>
              <SelectItem value="dark">
                <div className="flex items-center">
                  <Moon className="w-4 h-4 mr-2" /> Dark
                </div>
              </SelectItem>
              <SelectItem value="system">
                <div className="flex items-center">
                  <Monitor className="w-4 h-4 mr-2" /> System
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card className="shadow-lg border-0">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-lg">
            <Bell className="w-5 h-5 text-yellow-600" />
            <span>Notifications</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          {Object.keys(notifications).map((key) => (
            <div key={key} className="flex items-center justify-between">
              <Label className="capitalize">{key.replace(/([A-Z])/g, " $1")}</Label>
              <Switch
                checked={notifications[key as keyof typeof notifications]}
                onCheckedChange={(val) =>
                  setNotifications((prev) => ({ ...prev, [key]: val }))
                }
              />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Data Management */}
      <Card className="shadow-lg border-0">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-lg">
            <Database className="w-5 h-5 text-green-600" />
            <span>Data Management</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-4">
          <Button variant="outline" className="h-auto p-4" onClick={handleExport}>
            <Download className="w-6 h-6 mb-2" />
            Export Data
          </Button>
          <Button variant="outline" className="h-auto p-4" onClick={handleImport}>
            <Upload className="w-6 h-6 mb-2" />
            Import Data
          </Button>
          <Button variant="outline" className="h-auto p-4" onClick={handleAddSensor}>
            <Plus className="w-6 h-6 mb-2" />
            Add New Sensor
          </Button>
        </CardContent>
      </Card>

      {/* Security Settings */}
      <Card className="shadow-lg border-0">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-lg">
            <Shield className="w-5 h-5 text-red-600" />
            <span>Security</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-3">
            <Button variant="outline" onClick={handleChangePassword}>
              Change Password
            </Button>
            <Button variant="outline" onClick={handleTwoFactor}>
              Enable 2FA
            </Button>
          </div>
          <Separator className="my-2" />
          <Button variant="destructive" onClick={handleDeleteAccount}>
            <Trash2 className="w-4 h-4 mr-2" /> Delete Account
          </Button>
        </CardContent>
      </Card>

      {/* Connectivity */}
      <Card className="shadow-lg border-0">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-lg">
            <Wifi className="w-5 h-5 text-sky-600" />
            <span>Connectivity</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between">
            <span>SmartShelf Hub</span>
            <Badge variant="outline" className="bg-green-100 text-green-700 border-green-300">
              Connected
            </Badge>
          </div>
          <div className="flex items-center justify-between">
            <span>IoT Shelf Sensor A1</span>
            <Badge variant="outline" className="bg-green-100 text-green-700 border-green-300">
              Active
            </Badge>
          </div>
          <div className="flex items-center justify-between">
            <span>Backup Sensor B3</span>
            <Badge variant="outline" className="bg-yellow-100 text-yellow-700 border-yellow-300">
              Idle
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
