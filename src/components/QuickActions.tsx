import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  ShoppingCart,
  Package,
  FileText,
  AlertTriangle,
  BarChart3,
} from "lucide-react";

// Type definition for QuickAction component
interface QuickActionProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  onClick: () => void;
  variant?: "default" | "primary" | "secondary" | "accent";
}

// Individual quick-action button card
const QuickAction: React.FC<QuickActionProps> = ({
  title,
  description,
  icon,
  onClick,
  variant = "default",
}) => {
  const getButtonClasses = () => {
    switch (variant) {
      case "primary":
        return "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-md hover:shadow-lg hover:opacity-90";
      case "secondary":
        return "bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-md hover:shadow-lg hover:opacity-90";
      case "accent":
        return "bg-gradient-to-r from-pink-500 to-rose-600 text-white shadow-md hover:shadow-lg hover:opacity-90";
      default:
        return "bg-muted hover:bg-muted/80 text-foreground border border-border";
    }
  };

  return (
    <Card
      onClick={onClick}
      className="hover:shadow-lg transition-all duration-200 cursor-pointer group"
    >
      <CardContent className="p-5 flex items-center space-x-4">
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

        <div className="flex-1 text-left">
          <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
            {title}
          </h3>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </CardContent>
    </Card>
  );
};

// Container for all quick actions
export const QuickActions: React.FC = () => {
  const navigate = useNavigate();

  const actions = [
    {
      title: "Add New Item",
      desc: "Add products to your inventory",
      icon: <Plus className="w-5 h-5" />,
      onClick: () => navigate("/inventory?add=true"),
      variant: "primary",
    },
    {
      title: "Create Order",
      desc: "Process a new customer order",
      icon: <ShoppingCart className="w-5 h-5" />,
      onClick: () => navigate("/orders?create=true"),
      variant: "secondary",
    },
    {
      title: "Manage Stock",
      desc: "Update inventory levels",
      icon: <Package className="w-5 h-5" />,
      onClick: () => navigate("/inventory?manage=true"),
    },
    {
      title: "View Alerts",
      desc: "Check low stock warnings",
      icon: <AlertTriangle className="w-5 h-5" />,
      onClick: () => navigate("/alerts"),
    },
    {
      title: "Generate Report",
      desc: "Create sales & inventory reports",
      icon: <FileText className="w-5 h-5" />,
      onClick: () => navigate("/analytics?report=true"),
      variant: "accent",
    },
    {
      title: "Analytics",
      desc: "View detailed analytics",
      icon: <BarChart3 className="w-5 h-5" />,
      onClick: () => navigate("/analytics"),
    },
  ];

  return (
    <Card className="shadow-sm hover:shadow-md transition-shadow">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-foreground">
          Quick Actions
        </CardTitle>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {actions.map((action, idx) => (
            <QuickAction
              key={idx}
              title={action.title}
              description={action.desc}
              icon={action.icon}
              onClick={action.onClick}
              variant={action.variant as any}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
