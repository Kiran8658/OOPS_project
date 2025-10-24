// src/pages/Dashboard.tsx
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useNavigate } from "react-router-dom";
import {
  ShoppingCart,
  Package,
  AlertTriangle,
  TrendingUp,
  Bell,
  Eye,
  Zap,
} from "lucide-react";
import axios from "axios";

// ---------------------------
// ✅ Dashboard Main Component
// ---------------------------
export default function Dashboard() {
  const navigate = useNavigate();

  // Sample user info
  const user = {
    name: "John Doe",
    role: "Inventory Manager",
    avatarUrl: "",
    lastLogin: "2025-10-22 09:15 AM",
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fef5f1] via-[#fff8f6] to-[#fef5f1] p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
        <h1 className="text-3xl font-bold text-[#d8272d]">📊 Dashboard</h1>
        <div className="flex items-center gap-3">
          <Avatar className="w-12 h-12 bg-[#fef5f1] shadow-md">
            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-gray-900 font-semibold">{user.name}</p>
            <p className="text-gray-500 text-sm">{user.role}</p>
            <p className="text-gray-400 text-xs mt-1">Last login: {user.lastLogin}</p>
          </div>
        </div>
      </div>

      {/* Stats & Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
        <DashboardStats />
        <AlertsSummary />
      </div>

      {/* Recent Activity */}
      <RecentActivity />
    </div>
  );
}

// ---------------------------
// ✅ Dashboard Stats Section
// ---------------------------
interface Stats {
  totalRevenue: number;
  totalOrders: number;
  inventoryItems: number;
}

function DashboardStats() {
  const [stats, setStats] = useState<Stats>({
    totalRevenue: 0,
    totalOrders: 0,
    inventoryItems: 0,
  });
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/dashboard/stats", {
          withCredentials: true,
        });
        if (response.data && typeof response.data === "object") {
          setStats({
            totalRevenue: response.data.totalRevenue || 0,
            totalOrders: response.data.totalOrders || 0,
            inventoryItems: response.data.inventoryItems || 0,
          });
          setError(null);
        } else setError("Unexpected backend response.");
      } catch {
        setError("Failed to load stats. Showing placeholder data.");
        setStats({ totalRevenue: 125000, totalOrders: 180, inventoryItems: 320 });
      }
    };
    fetchStats();
  }, []);

  const statCard = (title: string, value: string | number, message: string, icon: JSX.Element, onClick: () => void) => (
    <Card
      className="p-5 flex flex-col justify-between rounded-xl shadow-md hover:shadow-lg cursor-pointer transition-all border border-gray-100 bg-white"
      onClick={onClick}
    >
      <div className="flex items-center justify-between mb-2">
        <p className="text-gray-600 text-sm">{title}</p>
        <div className="bg-[#fef5f1] p-2 rounded-full">{icon}</div>
      </div>
      <p className="text-2xl font-bold text-[#d8272d]">{value}</p>
      <p className="text-gray-500 text-sm mt-1">{message}</p>
    </Card>
  );

  return (
    <>
      {statCard(
        "Total Revenue",
        `₹${stats.totalRevenue.toLocaleString()}`,
        "Revenue generated till now",
        <TrendingUp className="w-5 h-5 text-[#d8272d]" />,
        () => navigate("/analytics")
      )}
      {statCard(
        "Total Orders",
        stats.totalOrders,
        "Orders processed till now",
        <ShoppingCart className="w-5 h-5 text-[#b81e23]" />,
        () => navigate("/orders")
      )}
      {statCard(
        "Total Items",
        stats.inventoryItems,
        "Items available in inventory",
        <Package className="w-5 h-5 text-[#d8272d]" />,
        () => navigate("/inventory")
      )}
    </>
  );
}

// ---------------------------
// ✅ Alerts Summary Section
// ---------------------------
interface AlertSummary {
  total: number;
  unread: number;
  highPriority: number;
  actionRequired: number;
}

function AlertsSummary() {
  const [alerts, setAlerts] = useState<AlertSummary>({
    total: 25,
    unread: 12,
    highPriority: 8,
    actionRequired: 5,
  });
  const navigate = useNavigate();

  const alertCard = (title: string, value: number, message: string, icon: JSX.Element, onClick: () => void) => (
    <Card
      className="p-5 flex flex-col justify-between rounded-xl shadow-md hover:shadow-lg cursor-pointer transition-all border border-gray-100 bg-white"
      onClick={onClick}
    >
      <div className="flex items-center justify-between mb-2">
        <p className="text-gray-600 text-sm">{title}</p>
        <div className="bg-[#fef5f1] p-2 rounded-full">{icon}</div>
      </div>
      <p className="text-2xl font-bold text-[#d8272d]">{value}</p>
      <p className="text-gray-500 text-sm mt-1">{message}</p>
    </Card>
  );

  return (
    <>
      {alertCard("Total Alerts", alerts.total, "All alerts generated", <Bell className="w-5 h-5 text-[#d8272d]" />, () => navigate("/alerts"))}
      {alertCard("Unread", alerts.unread, "Unread alerts", <Eye className="w-5 h-5 text-indigo-600" />, () => navigate("/alerts"))}
      {alertCard("High Priority", alerts.highPriority, "High priority alerts", <AlertTriangle className="w-5 h-5 text-[#d8272d]" />, () => navigate("/alerts"))}
      {alertCard("Action Required", alerts.actionRequired, "Alerts requiring action", <Zap className="w-5 h-5 text-yellow-600" />, () => navigate("/alerts"))}
    </>
  );
}

// ---------------------------
// ✅ Recent Activity Section
// ---------------------------
interface ActivityItem {
  id: string;
  type: "order" | "inventory" | "alert" | "analytics";
  title: string;
  description: string;
  time: string;
  badge?: { text: string; variant: "default" | "secondary" | "destructive" | "outline" };
}

export function RecentActivity() {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const res = await axios.get<ActivityItem[]>("http://localhost:8080/api/dashboard/recent-activity", { withCredentials: true });
        if (Array.isArray(res.data)) setActivities(res.data);
        else setActivities([]);
      } catch {
        setActivities([
          { id: "1", type: "order", title: "Order #123 completed", description: "Customer order delivered successfully.", time: "2 hours ago", badge: { text: "Success", variant: "secondary" } },
          { id: "2", type: "inventory", title: "Inventory updated", description: "New stock added for item SKU-456.", time: "5 hours ago", badge: { text: "Updated", variant: "default" } },
        ]);
      }
    };
    fetchActivities();
  }, []);

  const handleActivityClick = (type: ActivityItem["type"]) => {
    switch (type) {
      case "order": navigate("/orders"); break;
      case "inventory": navigate("/inventory"); break;
      case "alert": navigate("/alerts"); break;
      case "analytics": navigate("/analytics"); break;
    }
  };

  const getActivityIcon = (type: ActivityItem["type"]) => {
    switch (type) {
      case "order": return <ShoppingCart className="w-5 h-5 text-[#d8272d]" />;
      case "inventory": return <Package className="w-5 h-5 text-[#b81e23]" />;
      case "alert": return <AlertTriangle className="w-5 h-5 text-red-500" />;
      case "analytics": return <TrendingUp className="w-5 h-5 text-[#d8272d]" />;
    }
  };

  return (
    <Card className="bg-white rounded-2xl border border-gray-100 shadow-lg hover:shadow-xl transition-all mt-6">
      <CardHeader className="border-b border-gray-100 pb-4">
        <CardTitle className="text-xl font-semibold text-[#d8272d]">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-3">
          {activities.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => handleActivityClick(item.type)}
              className="flex items-start space-x-3 p-4 rounded-xl hover:bg-[#fff5f3] transition-all cursor-pointer w-full text-left focus:outline-none focus:ring-2 focus:ring-[#d8272d]"
            >
              <Avatar className="w-10 h-10 bg-[#fef5f1] flex items-center justify-center rounded-lg shadow-sm">
                <AvatarFallback>{getActivityIcon(item.type)}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-gray-900 truncate">{item.title}</p>
                  {item.badge && (
                    <Badge
                      variant={item.badge.variant}
                      className="ml-2 text-xs bg-[#d8272d]/10 text-[#d8272d] px-2 py-0.5 rounded"
                    >
                      {item.badge.text}
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-gray-600 mt-1">{item.description}</p>
                <p className="text-xs text-gray-500 mt-1">{item.time}</p>
              </div>
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
