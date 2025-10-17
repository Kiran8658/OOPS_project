import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useNavigate } from "react-router-dom";
import { ShoppingCart, Package, AlertTriangle, TrendingUp } from "lucide-react";
import axios from "axios";

interface ActivityItem {
  id: string;
  type: "order" | "inventory" | "alert" | "analytics";
  title: string;
  description: string;
  time: string;
  badge?: { text: string; variant: "default" | "secondary" | "destructive" | "outline" };
}

interface RecentActivityProps {
  activities?: ActivityItem[]; // optional prop
}

export function RecentActivity({ activities: propActivities }: RecentActivityProps) {
  const [activities, setActivities] = useState<ActivityItem[]>(propActivities || []);
  const navigate = useNavigate();

  useEffect(() => {
    if (!propActivities) {
      // Fetch from backend only if propActivities not provided
      const fetchActivities = async () => {
        try {
          const res = await axios.get<ActivityItem[]>(
            "http://localhost:8080/api/dashboard/recent-activity"
          );
          setActivities(res.data);
        } catch (error) {
          console.error("Failed to fetch recent activity:", error);
          // fallback mock data
          setActivities([
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
          ]);
        }
      };
      fetchActivities();
    }
  }, [propActivities]);

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
        <CardTitle className="text-lg font-semibold text-foreground">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
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
