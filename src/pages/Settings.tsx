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
  Trash2,
  Sun,
  Moon,
  Monitor,
  Plus,
  Home,
  Camera,
  Globe,
  Clock,
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

export default function SettingsPage() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("profile");
  const [theme, setTheme] = useState("system");
  const [notifications, setNotifications] = useState({
    lowStock: true,
    expiry: true,
    highDemand: false,
    system: true,
    email: true,
    sms: false,
    push: true,
  });

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "system";
    setTheme(savedTheme);
    applyTheme(savedTheme);
  }, []);

  const applyTheme = (value: string) => {
    document.documentElement.classList.remove("dark");
    if (value === "dark") document.documentElement.classList.add("dark");
    else if (value === "system") {
      if (window.matchMedia("(prefers-color-scheme: dark)").matches)
        document.documentElement.classList.add("dark");
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

  const menuItems = [
    { id: "profile", label: "Profile", icon: <User className="w-5 h-5" /> },
    { id: "shop", label: "Shop Details", icon: <Home className="w-5 h-5" /> },
    { id: "settings", label: "App Settings", icon: <Palette className="w-5 h-5" /> },
    { id: "notifications", label: "Notifications", icon: <Bell className="w-5 h-5" /> },
    { id: "connectivity", label: "Connectivity", icon: <Wifi className="w-5 h-5" /> },
    { id: "security", label: "Security", icon: <Shield className="w-5 h-5" /> },
  ];

  return (
    <div className="flex min-h-screen bg-gray-200">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md border-r p-4">
        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
          <Settings className="w-6 h-6 text-indigo-600" /> Settings
        </h2>
        <nav className="flex flex-col gap-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              className={`flex items-center gap-2 p-2 rounded hover:bg-indigo-100 ${
                activeTab === item.id ? "bg-indigo-100 font-semibold" : ""
              }`}
              onClick={() => setActiveTab(item.id)}
            >
              {item.icon} {item.label}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 space-y-8 overflow-auto bg-gray-200">
        {/* PROFILE */}
        {activeTab === "profile" && (
          <Card className="shadow-lg border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5 text-blue-600" /> Profile Details
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <Label>Full Name</Label>
                <Input placeholder="John Doe" />
              </div>
              <div className="flex flex-col gap-1">
                <Label>Email</Label>
                <Input placeholder="john@example.com" type="email" />
              </div>
              <div className="flex flex-col gap-1">
                <Label>Phone</Label>
                <Input placeholder="+91 98765 43210" />
              </div>
              <div className="flex flex-col gap-1">
                <Label>Username</Label>
                <Input placeholder="johndoe123" />
              </div>
              <div className="flex flex-col gap-1">
                <Label>Address</Label>
                <Input placeholder="Street, City, State, ZIP" />
              </div>
              <div className="flex flex-col gap-1">
                <Label>Profile Picture</Label>
                <Button variant="outline" className="flex items-center gap-2">
                  <Camera className="w-4 h-4" /> Upload
                </Button>
              </div>
              <div className="flex justify-end">
                <Button
                  onClick={handleSave}
                  className="bg-gradient-to-r from-blue-600 to-indigo-500 text-white shadow-md"
                >
                  <Save className="w-4 h-4 mr-2" /> Save Profile
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* SHOP */}
        {activeTab === "shop" && (
          <Card className="shadow-lg border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Home className="w-5 h-5 text-green-600" /> Shop Details
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <Label>Shop Name</Label>
                <Input placeholder="SmartShelf Store" />
              </div>
              <div className="flex flex-col gap-1">
                <Label>Location</Label>
                <Input placeholder="City, State" />
              </div>
              <div className="flex flex-col gap-1">
                <Label>ZIP / Postal Code</Label>
                <Input placeholder="123456" />
              </div>
              <div className="flex flex-col gap-1">
                <Label>Country</Label>
                <Input placeholder="India" />
              </div>
              <div className="flex flex-col gap-1">
                <Label>Shop Phone</Label>
                <Input placeholder="+91 98765 43210" />
              </div>
              <div className="flex flex-col gap-1">
                <Label>Opening Hours</Label>
                <Input placeholder="09:00 AM - 09:00 PM" />
              </div>
              <div className="flex flex-col gap-1">
                <Label>Manager Name</Label>
                <Input placeholder="Jane Doe" />
              </div>
              <div className="flex justify-end">
                <Button
                  onClick={handleSave}
                  className="bg-gradient-to-r from-green-600 to-green-500 text-white shadow-md"
                >
                  <Save className="w-4 h-4 mr-2" /> Save Shop
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* APP SETTINGS */}
        {activeTab === "settings" && (
          <Card className="shadow-lg border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="w-5 h-5 text-purple-600" /> App Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <Label>Theme</Label>
                <Select value={theme} onValueChange={handleThemeChange}>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Select Theme" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">
                      <div className="flex items-center gap-2">
                        <Sun className="w-4 h-4" /> Light
                      </div>
                    </SelectItem>
                    <SelectItem value="dark">
                      <div className="flex items-center gap-2">
                        <Moon className="w-4 h-4" /> Dark
                      </div>
                    </SelectItem>
                    <SelectItem value="system">
                      <div className="flex items-center gap-2">
                        <Monitor className="w-4 h-4" /> System
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col gap-1">
                <Label>Language</Label>
                <Select>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="English" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="hi">Hindi</SelectItem>
                    <SelectItem value="es">Spanish</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <Label>Auto Backup</Label>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>
        )}

        {/* NOTIFICATIONS */}
        {activeTab === "notifications" && (
          <Card className="shadow-lg border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-yellow-600" /> Notifications
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              {Object.keys(notifications).map((key) => (
                <div
                  key={key}
                  className="flex items-center justify-between w-full"
                >
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
        )}

        {/* CONNECTIVITY */}
        {activeTab === "connectivity" && (
          <Card className="shadow-lg border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wifi className="w-5 h-5 text-sky-600" /> Connectivity
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
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
              <div className="flex items-center justify-between">
                <Label>Network Type</Label>
                <span>Wi-Fi 5GHz</span>
              </div>
              <div className="flex items-center justify-between">
                <Label>Last Sync</Label>
                <span>Today, 12:45 PM</span>
              </div>
            </CardContent>
          </Card>
        )}

        {/* SECURITY */}
        {activeTab === "security" && (
          <Card className="shadow-lg border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-red-600" /> Security
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <Button variant="outline">Change Password</Button>
                <Button variant="outline">Enable 2FA</Button>
              </div>
              <div className="flex flex-col gap-1">
                <Label>Security Questions</Label>
                <Input placeholder="Mother's maiden name?" />
              </div>
              <div>
                <Label>Active Sessions</Label>
                <span className="text-gray-600">2 devices logged in</span>
              </div>
              <Separator className="my-2" />
              <Button variant="destructive" onClick={handleDeleteAccount}>
                <Trash2 className="w-4 h-4 mr-2" /> Delete Account
              </Button>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
