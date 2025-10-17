import { useEffect, useState } from "react";
import { DashboardStats } from "@/components/DashboardStats";
import { WeeklySalesChart } from "@/components/WeeklySalesChart";
import { SalesByCategoryChart } from "@/components/SalesByCategoryChart";
import { QuickActions } from "@/components/QuickActions";
import { RecentActivity } from "@/components/RecentActivity";
import axios from "axios";

// Types
interface Stats {
  totalRevenue: number;
  revenueChange: number;
  monthlyTarget: number;
  totalOrders: number;
  ordersChange: number;
  avgOrderValue: number;
  inventoryItems: number;
  inventoryChange: number;
  lowStockAlerts: number;
  newAlerts: number;
}

interface SalesData {
  day?: string; // For weekly
  category?: string; // For category chart
  value: number;
}

interface Activity {
  id: string;
  type: string;
  message: string;
  status: string;
  timestamp: string;
}

export default function Dashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [weeklySales, setWeeklySales] = useState<SalesData[]>([]);
  const [categorySales, setCategorySales] = useState<SalesData[]>([]);
  const [recentActivity, setRecentActivity] = useState<Activity[]>([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Stats
        const statsRes = await axios.get("http://localhost:8080/api/dashboard/stats");
        setStats(statsRes.data);

        // Weekly sales
        const weeklyRes = await axios.get("http://localhost:8080/api/dashboard/weekly-sales");
        setWeeklySales(weeklyRes.data);

        // Sales by category
        const categoryRes = await axios.get("http://localhost:8080/api/dashboard/sales-category");
        setCategorySales(categoryRes.data);

        // Recent activity
        const activityRes = await axios.get("http://localhost:8080/api/dashboard/recent-activity");
        setRecentActivity(activityRes.data);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };
    fetchDashboardData();
  }, []);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-hero bg-clip-text text-transparent">
            Dashboard
          </h1>
          <p className="text-muted-foreground mt-2">
            Welcome back! Here's what's happening with your business today.
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm text-muted-foreground">Today</p>
          <p className="text-lg font-semibold text-foreground">
            {new Date().toLocaleDateString("en-IN", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric"
            })}
          </p>
        </div>
      </div>

      {/* Dashboard Stats */}
      {stats && <DashboardStats stats={stats} />}

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <WeeklySalesChart data={weeklySales} />
        <SalesByCategoryChart data={categorySales} />
      </div>

      {/* Quick Actions and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <QuickActions />
        </div>
        <RecentActivity activities={recentActivity} />
      </div>
    </div>
  );
}
