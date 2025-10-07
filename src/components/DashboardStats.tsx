import { useState } from "react";
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
        return "text-success";
      case "negative":
        return "text-destructive";
      default:
        return "text-muted-foreground";
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
      className={`hover:shadow-lg transition-all duration-200 border-border/50 ${onClick ? 'cursor-pointer hover:bg-muted/50' : ''}`}
      onClick={onClick}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <div className="text-primary">{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-foreground mb-1">{value}</div>
        <div className={`flex items-center text-xs ${getChangeColor()}`}>
          {getChangeIcon()}
          <span className="ml-1">{change}</span>
        </div>
        {description && (
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        )}
      </CardContent>
    </Card>
  );
};

export function DashboardStats() {
  // State for modal visibility and selected stat
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedStat, setSelectedStat] = useState<string | null>(null);

  // State for filters (example: date range)
  const [filterDateRange, setFilterDateRange] = useState<string>("Last Month");

  // Dummy detailed data for each stat
  const statDetailsData: Record<string, string> = {
    "Total Revenue": "Detailed revenue data...\n- Jan: ₹40,000\n- Feb: ₹45,231\n- Mar: ₹50,000",
    "Total Orders": "Detailed orders data...\n- Jan: 1,100\n- Feb: 1,234\n- Mar: 1,300",
    "Inventory Items": "Detailed inventory data...\n- Total items: 856\n- Low stock: 12",
    "Low Stock Alerts": "Detailed alerts data...\n- New alerts: 3\n- Total alerts: 12",
  };

  const openModal = (statTitle: string) => {
    setSelectedStat(statTitle);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedStat(null);
  };

  const handleRefresh = () => {
    console.log("Refreshing stats...");
    // Simulate refresh by updating dummy data or state if needed
    alert("Refreshing stats...");
  };

  const handleFilterChange = () => {
    console.log("Filter changed");
    // Simulate filter change by toggling date range for demo
    setFilterDateRange(prev => (prev === "Last Month" ? "Last Quarter" : "Last Month"));
    alert("Filter changed to " + (filterDateRange === "Last Month" ? "Last Quarter" : "Last Month"));
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
          <Button variant="outline" size="sm" onClick={handleRefresh} className="flex items-center space-x-1">
            <RefreshCw className="w-4 h-4" />
            <span>Refresh</span>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Revenue"
          value="₹45,231"
          change="+12.5% from last month"
          changeType="positive"
          icon={<DollarSign className="w-5 h-5" />}
          description="Monthly revenue target: ₹50,000"
          onClick={() => openModal("Total Revenue")}
        />

        <StatCard
          title="Total Orders"
          value="1,234"
          change="+8.2% from last month"
          changeType="positive"
          icon={<ShoppingCart className="w-5 h-5" />}
          description="Average order value: ₹367"
          onClick={() => openModal("Total Orders")}
        />

        <StatCard
          title="Inventory Items"
          value="856"
          change="-2.1% from last month"
          changeType="negative"
          icon={<Package className="w-5 h-5" />}
          description="Items running low: 12"
          onClick={() => openModal("Inventory Items")}
        />

        <StatCard
          title="Low Stock Alerts"
          value="12"
          change="+3 new alerts"
          changeType="negative"
          icon={<AlertTriangle className="w-5 h-5" />}
          description="Requires immediate attention"
          onClick={() => openModal("Low Stock Alerts")}
        />
      </div>

      {selectedStat && (
        <StatDetailModal
          isOpen={modalOpen}
          onClose={closeModal}
          title={selectedStat}
          data={statDetailsData[selectedStat]}
        />
      )}
    </>
  );
}
