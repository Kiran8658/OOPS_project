// src/pages/SettingsPage.tsx
import { useState } from "react";
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
  Wifi,
  Save,
  Trash2,
  Camera,
  Home,
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

export default function SettingsPage() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("profile");
  const [theme, setTheme] = useState("light");
  const [notifications, setNotifications] = useState({
    lowStock: true,
    expiry: true,
    highDemand: false,
    system: true,
    email: true,
    sms: false,
    push: true,
  });

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
    <div className="flex min-h-screen bg-gradient-to-br from-[#fef5f1] via-[#fff8f6] to-[#fef5f1] text-gray-900 font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md border-r border-gray-200 p-4">
        <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-[#d8272d]">
          <Settings className="w-6 h-6" /> Settings
        </h2>
        <nav className="flex flex-col gap-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              className={`flex items-center gap-2 p-2 rounded transition-colors ${
                activeTab === item.id
                  ? "bg-gradient-to-r from-[#d8272d] to-[#b81e23] text-white font-semibold"
                  : "hover:bg-[#feeaea] text-[#d8272d]"
              }`}
              onClick={() => setActiveTab(item.id)}
            >
              {item.icon} {item.label}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 space-y-8 overflow-auto">
        {/* PROFILE */}
        {activeTab === "profile" && (
          <Card className="shadow-md border border-gray-200 bg-white rounded-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-[#d8272d]">
                <User className="w-5 h-5" /> Profile Details
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              {["Full Name", "Email", "Phone", "Username", "Address"].map((field) => (
                <div key={field} className="flex flex-col gap-1">
                  <Label>{field}</Label>
                  <Input placeholder={field} />
                </div>
              ))}
              <div className="flex flex-col gap-1">
                <Label>Profile Picture</Label>
                <Button
                  variant="outline"
                  className="flex items-center gap-2 border-gray-300 text-[#d8272d]"
                >
                  <Camera className="w-4 h-4" /> Upload
                </Button>
              </div>
              <div className="flex justify-end">
                <Button
                  onClick={handleSave}
                  className="bg-gradient-to-r from-[#d8272d] to-[#b81e23] text-white shadow-md flex items-center hover:opacity-90"
                >
                  <Save className="w-4 h-4 mr-2" /> Save Profile
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* SHOP */}
        {activeTab === "shop" && (
          <Card className="shadow-md border border-gray-200 bg-white rounded-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-[#d8272d]">
                <Home className="w-5 h-5" /> Shop Details
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              {["Shop Name", "Location", "ZIP / Postal Code", "Country", "Shop Phone", "Opening Hours", "Manager Name"].map((field) => (
                <div key={field} className="flex flex-col gap-1">
                  <Label>{field}</Label>
                  <Input placeholder={field} />
                </div>
              ))}
              <div className="flex justify-end">
                <Button
                  onClick={handleSave}
                  className="bg-gradient-to-r from-[#d8272d] to-[#b81e23] text-white shadow-md flex items-center hover:opacity-90"
                >
                  <Save className="w-4 h-4 mr-2" /> Save Shop
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* APP SETTINGS */}
        {activeTab === "settings" && (
          <Card className="shadow-md border border-gray-200 bg-white rounded-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-[#d8272d]">
                <Palette className="w-5 h-5" /> App Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <Label>Theme</Label>
                <Select value={theme} onValueChange={setTheme}>
                  <SelectTrigger className="w-[200px] border-gray-300">
                    <SelectValue placeholder="Light (Fixed)" />
                  </SelectTrigger>
                </Select>
              </div>
              <div className="flex flex-col gap-1">
                <Label>Language</Label>
                <Select>
                  <SelectTrigger className="w-[200px] border-gray-300">
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
          <Card className="shadow-md border border-gray-200 bg-white rounded-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-[#d8272d]">
                <Bell className="w-5 h-5" /> Notifications
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
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
        )}

        {/* CONNECTIVITY */}
        {activeTab === "connectivity" && (
          <Card className="shadow-md border border-gray-200 bg-white rounded-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-[#d8272d]">
                <Wifi className="w-5 h-5" /> Connectivity
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
            </CardContent>
          </Card>
        )}

        {/* SECURITY */}
        {activeTab === "security" && (
          <Card className="shadow-md border border-gray-200 bg-white rounded-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-[#d8272d]">
                <Shield className="w-5 h-5" /> Security
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <Button variant="outline" className="text-[#d8272d]">Change Password</Button>
                <Button variant="outline" className="text-[#d8272d]">Enable 2FA</Button>
              </div>
              <div className="flex flex-col gap-1">
                <Label>Security Questions</Label>
                <Input placeholder="Mother's maiden name?" />
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
