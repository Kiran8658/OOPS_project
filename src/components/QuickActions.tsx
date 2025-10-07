import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  ShoppingCart,
  Package,
  FileText,
  AlertTriangle,
  BarChart3
} from "lucide-react";

interface QuickActionProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  onClick: () => void;
  variant?: "default" | "primary" | "secondary" | "accent";
}

const QuickAction = ({ title, description, icon, onClick, variant = "default" }: QuickActionProps) => {
  const getButtonClasses = () => {
    switch (variant) {
      case "primary":
        return "bg-gradient-primary hover:opacity-90 text-white border-0 shadow-md hover:shadow-lg";
      case "secondary":
        return "bg-gradient-secondary hover:opacity-90 text-white border-0 shadow-md hover:shadow-lg";
      case "accent":
        return "bg-gradient-accent hover:opacity-90 text-white border-0 shadow-md hover:shadow-lg";
      default:
        return "bg-muted hover:bg-muted/80 text-foreground border border-border";
    }
  };

  return (
    <Card className="hover:shadow-lg transition-all duration-200 cursor-pointer group" onClick={onClick}>
      <CardContent className="p-6">
        <div className="flex items-center space-x-4">
          <Button
            size="lg"
            className={`w-12 h-12 p-0 ${getButtonClasses()} group-hover:scale-105 transition-transform`}
            onClick={(e) => {
              e.stopPropagation();
              onClick();
            }}
          >
            {icon}
          </Button>
          <div className="flex-1">
            <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
              {title}
            </h3>
            <p className="text-sm text-muted-foreground">
              {description}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export function QuickActions() {
  const navigate = useNavigate();

  const handleAddInventory = () => {
    navigate("/inventory?add=true");
  };

  const handleCreateOrder = () => {
    navigate("/orders?create=true");
  };

  const handleViewAlerts = () => {
    navigate("/alerts");
  };

  const handleGenerateReport = () => {
    navigate("/analytics?report=true");
  };

  const handleViewAnalytics = () => {
    navigate("/analytics");
  };

  const handleManageStock = () => {
    navigate("/inventory?manage=true");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-foreground">
          Quick Actions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <QuickAction
            title="Add New Item"
            description="Add products to your inventory"
            icon={<Plus className="w-5 h-5" />}
            onClick={handleAddInventory}
            variant="primary"
          />
          
          <QuickAction
            title="Create Order"
            description="Process a new customer order"
            icon={<ShoppingCart className="w-5 h-5" />}
            onClick={handleCreateOrder}
            variant="secondary"
          />
          
          <QuickAction
            title="Manage Stock"
            description="Update inventory levels"
            icon={<Package className="w-5 h-5" />}
            onClick={handleManageStock}
          />
          
          <QuickAction
            title="View Alerts"
            description="Check low stock warnings"
            icon={<AlertTriangle className="w-5 h-5" />}
            onClick={handleViewAlerts}
          />
          
          <QuickAction
            title="Generate Report"
            description="Create sales & inventory reports"
            icon={<FileText className="w-5 h-5" />}
            onClick={handleGenerateReport}
            variant="accent"
          />
          
          <QuickAction
            title="Analytics"
            description="View detailed analytics"
            icon={<BarChart3 className="w-5 h-5" />}
            onClick={handleViewAnalytics}
          />
        </div>
      </CardContent>
    </Card>
  );
}