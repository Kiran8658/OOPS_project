import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useNavigate } from "react-router-dom";
import { ShoppingCart, Package, AlertTriangle, TrendingUp } from "lucide-react";
import axios, { AxiosError } from "axios";

// Define the shape of each activity item from backend
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
  const navigate = useNavigate();
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch activities from backend
  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const response = await axios.get<ActivityItem[]>(
          "http://localhost:8080/api/dashboard/recent-activity",
          { withCredentials: true } // in case you use cookies
        );
        setActivities(response.data);
        setLoading(false);
      } catch (err) {
        const axiosError = err as AxiosError;
        setError(axiosError.message);
        setLoading(false);
      }
    };

    fetchActivities();
  }, []);

  // Navigate based on activity type
  const handleActivityClick = (type: ActivityItem["type"]) => {
    const routeMap: Record<ActivityItem["type"], string> = {
      order: "/orders",
      inventory: "/inventory",
      alert: "/alerts",
      analytics: "/analytics",
    };
    navigate(routeMap[type]);
  };

  // Render correct icon
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

  if (loading) {
    return (
      <Card className="col-span-1 shadow-sm">
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>Loading...</CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="col-span-1 shadow-sm">
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>Error: {error}</CardContent>
      </Card>
    );
  }

  return (
    <Card className="col-span-1 shadow-sm hover:shadow-md transition-shadow duration-300">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-foreground">
          Recent Activity
        </CardTitle>
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
                <p className="text-xs text-muted-foreground mt-1">{item.time}</p>
              </div>
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
