import { useState, useEffect } from "react";
import axios from "axios";

// ✅ Create Axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8080/api/dashboard/stats",
});

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  TrendingUp,
  TrendingDown,
  Package,
  ShoppingCart,
  AlertTriangle,
  DollarSign,
  RefreshCw,
  Filter,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatDetailModal } from "./StatDetailModal";

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  changeType: "positive" | "negative" | "neutral";
  icon: React.ReactNode;
  description?: string;
  onClick?: () => void;
}

const StatCard = ({ title, value, change, changeType, icon, description, onClick }: StatCardProps) => {
  const getChangeColor = () => {
    switch (changeType) {
      case "positive":
        return "text-green-600";
      case "negative":
        return "text-red-600";
      default:
        return "text-gray-500";
    }
  };

  const getChangeIcon = () => {
    switch (changeType) {
      case "positive":
        return <TrendingUp className="w-3 h-3" />;
      case "negative":
        return <TrendingDown className="w-3 h-3" />;
      default:
        return null;
    }
  };

  return (
    <Card
      className={`hover:shadow-lg transition-all duration-200 border-border/50 ${onClick ? "cursor-pointer hover:bg-muted/50" : ""}`}
      onClick={onClick}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <div className="text-primary">{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-foreground mb-1">{value}</div>
        <div className={`flex items-center text-xs ${getChangeColor()}`}>
          {getChangeIcon()}
          <span className="ml-1">{change}</span>
        </div>
        {description && <p className="text-xs text-muted-foreground mt-1">{description}</p>}
      </CardContent>
    </Card>
  );
};

interface DashboardStatsData {
  totalRevenue?: number;
  totalOrders?: number;
  inventoryItems?: number;
  lowStockAlerts?: number;
  revenueChange?: number;
  ordersChange?: number;
  inventoryChange?: number;
  newAlerts?: number;
}

export function DashboardStats() {
  const [stats, setStats] = useState<DashboardStatsData | null>(null);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedStat, setSelectedStat] = useState<string | null>(null);
  const [filterDateRange, setFilterDateRange] = useState("Last Month");

  const fetchStats = async () => {
    try {
      setLoading(true);
      // 🔥 Use Axios instance without double /api
      const res = await api.get("/dashboard/stats");
      setStats(res.data);
    } catch (err) {
      console.error("❌ Failed to fetch dashboard stats:", err);
      alert("Failed to load stats from backend. Check your server.");
      setStats(null); // fallback to null
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const openModal = (title: string) => {
    setSelectedStat(title);
    setModalOpen(true);
  };

  const closeModal = () => {
    setSelectedStat(null);
    setModalOpen(false);
  };

  const handleRefresh = () => {
    fetchStats();
  };

  const handleFilterChange = () => {
    setFilterDateRange((prev) => (prev === "Last Month" ? "Last Quarter" : "Last Month"));
  };

  const s: DashboardStatsData = {
    totalRevenue: stats?.totalRevenue ?? 0,
    revenueChange: stats?.revenueChange ?? 0,
    totalOrders: stats?.totalOrders ?? 0,
    ordersChange: stats?.ordersChange ?? 0,
    inventoryItems: stats?.inventoryItems ?? 0,
    inventoryChange: stats?.inventoryChange ?? 0,
    lowStockAlerts: stats?.lowStockAlerts ?? 0,
    newAlerts: stats?.newAlerts ?? 0,
  };

  const statDetailsData: Record<string, string> = {
    "Total Revenue": `Detailed revenue data:\n- This month: ₹${s.totalRevenue?.toLocaleString()}\n- Change: ${s.revenueChange}%`,
    "Total Orders": `Orders processed: ${s.totalOrders}\nChange: ${s.ordersChange}%`,
    "Inventory Items": `Total items: ${s.inventoryItems}\nChange: ${s.inventoryChange}%`,
    "Low Stock Alerts": `Current alerts: ${s.lowStockAlerts}\nNew alerts: ${s.newAlerts}`,
  };

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Dashboard Stats</h2>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" onClick={handleFilterChange} className="flex items-center space-x-1">
            <Filter className="w-4 h-4" />
            <span>{filterDateRange}</span>
          </Button>
          <Button variant="outline" size="sm" onClick={handleRefresh} disabled={loading} className="flex items-center space-x-1">
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            <span>{loading ? "Refreshing..." : "Refresh"}</span>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Revenue"
          value={`₹${s.totalRevenue?.toLocaleString() ?? "0"}`}
          change={`+${s.revenueChange ?? 0}% from last month`}
          changeType={s.revenueChange! >= 0 ? "positive" : "negative"}
          icon={<DollarSign className="w-5 h-5" />}
          description="Monthly revenue target: ₹50,000"
          onClick={() => openModal("Total Revenue")}
        />
        <StatCard
          title="Total Orders"
          value={`${s.totalOrders ?? 0}`}
          change={`+${s.ordersChange ?? 0}% from last month`}
          changeType={s.ordersChange! >= 0 ? "positive" : "negative"}
          icon={<ShoppingCart className="w-5 h-5" />}
          description="Average order value: ₹367"
          onClick={() => openModal("Total Orders")}
        />
        <StatCard
          title="Inventory Items"
          value={`${s.inventoryItems ?? 0}`}
          change={`${s.inventoryChange ?? 0}% from last month`}
          changeType={s.inventoryChange! < 0 ? "negative" : "positive"}
          icon={<Package className="w-5 h-5" />}
          description={`Items running low: ${s.lowStockAlerts}`}
          onClick={() => openModal("Inventory Items")}
        />
        <StatCard
          title="Low Stock Alerts"
          value={`${s.lowStockAlerts ?? 0}`}
          change={`+${s.newAlerts ?? 0} new alerts`}
          changeType="negative"
          icon={<AlertTriangle className="w-5 h-5" />}
          description="Requires immediate attention"
          onClick={() => openModal("Low Stock Alerts")}
        />
      </div>

      {selectedStat && (
        <StatDetailModal isOpen={modalOpen} onClose={closeModal} title={selectedStat} data={statDetailsData[selectedStat]} />
      )}
    </>
  );
}
