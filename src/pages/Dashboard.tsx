import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useNavigate } from "react-router-dom";
import { ShoppingCart, Package, AlertTriangle, TrendingUp } from "lucide-react";
import axios from "axios";

// ---------------------------
// ✅ Dashboard Main Component
// ---------------------------
export default function Dashboard() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
      <DashboardStats />
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
        } else {
          setError("Unexpected backend response.");
        }
      } catch (err) {
        console.error("Failed to load stats:", err);
        setError("Failed to load stats from backend. Check your server.");
      }
    };

    fetchStats();
  }, []);

  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-foreground">
          Dashboard Overview
        </CardTitle>
      </CardHeader>
      <CardContent>
        {error ? (
          <p className="text-destructive text-sm">{error}</p>
        ) : (
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-muted-foreground text-sm">Total Revenue</p>
              <p className="text-2xl font-bold text-primary">
                ₹{stats.totalRevenue.toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground text-sm">Total Orders</p>
              <p className="text-2xl font-bold text-secondary">{stats.totalOrders}</p>
            </div>
            <div>
              <p className="text-muted-foreground text-sm">Total Items</p>
              <p className="text-2xl font-bold text-accent">{stats.inventoryItems}</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
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
  badge?: {
    text: string;
    variant: "default" | "secondary" | "destructive" | "outline";
  };
}

export function RecentActivity() {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const res = await axios.get<ActivityItem[]>(
          "http://localhost:8080/api/dashboard/recent-activity",
          { withCredentials: true }
        );
        if (Array.isArray(res.data)) {
          setActivities(res.data);
          setError(null);
        } else {
          console.error("Unexpected response format:", res.data);
          setError("Unexpected response from backend.");
        }
      } catch (err) {
        console.error("Failed to fetch recent activity:", err);
        setError("Failed to load recent activity. Check backend.");
      }
    };
    fetchActivities();
  }, []);

  const handleActivityClick = (type: ActivityItem["type"]) => {
    switch (type) {
      case "order":
        navigate("/orders");
        break;
      case "inventory":
        navigate("/inventory");
        break;
      case "alert":
        navigate("/alerts");
        break;
      case "analytics":
        navigate("/analytics");
        break;
    }
  };

  const getActivityIcon = (type: ActivityItem["type"]) => {
    switch (type) {
      case "order":
        return <ShoppingCart className="w-4 h-4 text-primary" />;
      case "inventory":
        return <Package className="w-4 h-4 text-secondary" />;
      case "alert":
        return <AlertTriangle className="w-4 h-4 text-destructive" />;
      case "analytics":
        return <TrendingUp className="w-4 h-4 text-accent" />;
    }
  };

  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-foreground">
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        {error && <p className="text-destructive text-sm mb-2">{error}</p>}
        <div className="space-y-4">
          {activities.map((item) => (
            <button
              key={item.id}
              type="button"
              className="flex items-start space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer w-full text-left focus:outline-none focus:ring-2 focus:ring-primary"
              onClick={() => handleActivityClick(item.type)}
            >
              <Avatar className="w-8 h-8 bg-muted">
                <AvatarFallback className="bg-transparent">{getActivityIcon(item.type)}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-foreground truncate">{item.title}</p>
                  {item.badge && (
                    <Badge variant={item.badge.variant} className="ml-2 text-xs">
                      {item.badge.text}
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-1">{item.description}</p>
                <p className="text-xs text-muted-foreground mt-1">{item.time}</p>
              </div>
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
