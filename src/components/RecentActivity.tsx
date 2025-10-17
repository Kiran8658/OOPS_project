import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useNavigate } from "react-router-dom";
import { ShoppingCart, Package, AlertTriangle, TrendingUp } from "lucide-react";

// Define the shape of each activity item
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

// Mock activity data (replace later with API call)
const activityItems: ActivityItem[] = [
  {
    id: "1",
    type: "order",
    title: "New Order #ORD-1234",
    description: "Customer purchased 5 items worth ₹1,250",
    time: "2 minutes ago",
    badge: { text: "Completed", variant: "default" },
  },
  {
    id: "2",
    type: "alert",
    title: "Low Stock Alert",
    description: "Rice (Basmati) - Only 5 kg remaining",
    time: "15 minutes ago",
    badge: { text: "Critical", variant: "destructive" },
  },
  {
    id: "3",
    type: "inventory",
    title: "Stock Updated",
    description: "Added 50 units of Wheat Flour (10kg)",
    time: "1 hour ago",
    badge: { text: "Updated", variant: "secondary" },
  },
  {
    id: "4",
    type: "order",
    title: "Bulk Order #ORD-1233",
    description: "Local restaurant ordered supplies worth ₹15,000",
    time: "2 hours ago",
    badge: { text: "Processing", variant: "outline" },
  },
  {
    id: "5",
    type: "analytics",
    title: "Weekly Report Generated",
    description: "Sales increased by 12% compared to last week",
    time: "3 hours ago",
    badge: { text: "Generated", variant: "secondary" },
  },
];

// Utility to render correct icon
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
    default:
      return <div className="w-4 h-4 bg-muted rounded-full" />;
  }
};

export function RecentActivity() {
  const navigate = useNavigate();

  // When user clicks an activity, navigate accordingly
  const handleActivityClick = (type: ActivityItem["type"]) => {
    const routeMap: Record<ActivityItem["type"], string> = {
      order: "/orders",
      inventory: "/inventory",
      alert: "/alerts",
      analytics: "/analytics",
    };
    navigate(routeMap[type]);
  };

  return (
    <Card className="col-span-1 shadow-sm hover:shadow-md transition-shadow duration-300">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-foreground">
          Recent Activity
        </CardTitle>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          {activityItems.map((item) => (
            <button
              key={item.id}
              type="button"
              className="flex items-start space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer w-full text-left focus:outline-none focus:ring-2 focus:ring-primary"
              onClick={() => handleActivityClick(item.type)}
            >
              <Avatar className="w-8 h-8 bg-muted flex items-center justify-center">
                <AvatarFallback className="bg-transparent">
                  {getActivityIcon(item.type)}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-foreground truncate">
                    {item.title}
                  </p>
                  {item.badge && (
                    <Badge variant={item.badge.variant} className="ml-2 text-xs">
                      {item.badge.text}
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-1 truncate">
                  {item.description}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {item.time}
                </p>
              </div>
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
