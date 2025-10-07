import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertTriangle,
  Clock,
  Package,
  TrendingDown,
  Search,
  Settings,
  Bell,
  CheckCircle,
  XCircle,
  Eye,
  Zap
} from "lucide-react";

interface Alert {
  id: string;
  title: string;
  description: string;
  type: "low-stock" | "expiry" | "high-demand" | "system" | "predictive";
  priority: "high" | "medium" | "low";
  timestamp: string;
  isRead: boolean;
  actionRequired: boolean;
}

const initialAlerts: Alert[] = [
  {
    id: "1",
    title: "Low Stock Alert",
    description: "Wheat Flour is running low (5 kg remaining)",
    type: "low-stock",
    priority: "high",
    timestamp: "2024-08-19T10:30:00",
    isRead: false,
    actionRequired: true
  },
  {
    id: "2",
    title: "Expiry Warning",
    description: "Paracetamol batch expires in 3 days",
    type: "expiry",
    priority: "medium",
    timestamp: "2024-08-19T09:15:00",
    isRead: false,
    actionRequired: true
  },
  {
    id: "3",
    title: "High Demand Detected",
    description: "Basmati Rice sales increased by 40% this week",
    type: "high-demand",
    priority: "medium",
    timestamp: "2024-08-19T08:00:00",
    isRead: true,
    actionRequired: false
  },
  {
    id: "4",
    title: "Predictive Restocking",
    description: "Tomatoes may run out in 2 days based on current trends",
    type: "predictive",
    priority: "medium",
    timestamp: "2024-08-18T16:45:00",
    isRead: false,
    actionRequired: true
  },
  {
    id: "5",
    title: "System Notification",
    description: "SmartShelf sensors updated successfully",
    type: "system",
    priority: "low",
    timestamp: "2024-08-18T12:00:00",
    isRead: true,
    actionRequired: false
  }
];

const getAlertIcon = (type: string) => {
  switch (type) {
    case "low-stock":
      return <Package className="w-5 h-5" />;
    case "expiry":
      return <Clock className="w-5 h-5" />;
    case "high-demand":
      return <TrendingDown className="w-5 h-5" />;
    case "predictive":
      return <Zap className="w-5 h-5" />;
    case "system":
      return <Settings className="w-5 h-5" />;
    default:
      return <Bell className="w-5 h-5" />;
  }
};

const getPriorityBadge = (priority: string) => {
  switch (priority) {
    case "high":
      return <Badge className="bg-destructive/10 text-destructive border-destructive/20">High Priority</Badge>;
    case "medium":
      return <Badge className="bg-warning/10 text-warning border-warning/20">Medium Priority</Badge>;
    case "low":
      return <Badge className="bg-success/10 text-success border-success/20">Low Priority</Badge>;
    default:
      return <Badge variant="outline">{priority}</Badge>;
  }
};

const getTypeBadge = (type: string) => {
  switch (type) {
    case "low-stock":
      return <Badge className="bg-destructive/10 text-destructive">Low Stock</Badge>;
    case "expiry":
      return <Badge className="bg-warning/10 text-warning">Expiry</Badge>;
    case "high-demand":
      return <Badge className="bg-info/10 text-info">High Demand</Badge>;
    case "predictive":
      return <Badge className="bg-primary/10 text-primary">AI Prediction</Badge>;
    case "system":
      return <Badge className="bg-muted/10 text-muted-foreground">System</Badge>;
    default:
      return <Badge variant="outline">{type}</Badge>;
  }
};

export default function Alerts() {
  const [alerts, setAlerts] = useState(initialAlerts);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");

  const filteredAlerts = alerts.filter((alert) => {
    const matchesSearch = alert.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         alert.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === "all" || alert.type === typeFilter;
    const matchesPriority = priorityFilter === "all" || alert.priority === priorityFilter;

    return matchesSearch && matchesType && matchesPriority;
  });

  const unreadCount = alerts.filter(alert => !alert.isRead).length;
  const highPriorityCount = alerts.filter(alert => alert.priority === "high").length;
  const actionRequiredCount = alerts.filter(alert => alert.actionRequired).length;

  const toggleRead = (id: string) => {
    setAlerts((prev) =>
      prev.map((alert) =>
        alert.id === id ? { ...alert, isRead: !alert.isRead } : alert
      )
    );
  };

  const deleteAlert = (id: string) => {
    setAlerts((prev) => prev.filter((alert) => alert.id !== id));
  };

  const takeAction = (id: string) => {
    setAlerts((prev) =>
      prev.map((alert) =>
        alert.id === id ? { ...alert, actionRequired: false, isRead: true } : alert
      )
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-hero bg-clip-text text-transparent">
            Smart Alerts
          </h1>
          <p className="text-muted-foreground mt-2">
            AI-powered notifications and predictive insights for your business.
          </p>
        </div>
        <Button className="bg-gradient-primary hover:opacity-90 text-white">
          <Settings className="w-4 h-4 mr-2" />
          Alert Settings
        </Button>
      </div>

      {/* Alert Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-primary text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/80 text-sm">Total Alerts</p>
                <p className="text-2xl font-bold">{alerts.length}</p>
              </div>
              <Bell className="w-8 h-8 text-white/80" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-accent text-accent-foreground">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-accent-foreground/80 text-sm">Unread</p>
                <p className="text-2xl font-bold">{unreadCount}</p>
              </div>
              <Eye className="w-8 h-8 text-accent-foreground/80" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-secondary text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/80 text-sm">High Priority</p>
                <p className="text-2xl font-bold">{highPriorityCount}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-white/80" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-info text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/80 text-sm">Action Required</p>
                <p className="text-2xl font-bold">{actionRequiredCount}</p>
              </div>
              <Zap className="w-8 h-8 text-white/80" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search alerts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>

            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="low-stock">Low Stock</SelectItem>
                <SelectItem value="expiry">Expiry</SelectItem>
                <SelectItem value="high-demand">High Demand</SelectItem>
                <SelectItem value="predictive">AI Predictions</SelectItem>
                <SelectItem value="system">System</SelectItem>
              </SelectContent>
            </Select>

            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priorities</SelectItem>
                <SelectItem value="high">High Priority</SelectItem>
                <SelectItem value="medium">Medium Priority</SelectItem>
                <SelectItem value="low">Low Priority</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Alerts List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Bell className="w-5 h-5 mr-2 text-primary" />
            Alerts ({filteredAlerts.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredAlerts.map((alert) => (
              <div
                key={alert.id}
                className={`p-4 border rounded-lg hover:bg-muted/50 transition-colors ${
                  !alert.isRead ? 'bg-primary/5 border-primary/20' : ''
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    <div className={`p-2 rounded-lg ${
                      alert.priority === 'high' ? 'bg-destructive/10 text-destructive' :
                      alert.priority === 'medium' ? 'bg-warning/10 text-warning' :
                      'bg-success/10 text-success'
                    }`}>
                      {getAlertIcon(alert.type)}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium">{alert.title}</h4>
                        {!alert.isRead && (
                          <div className="w-2 h-2 bg-primary rounded-full"></div>
                        )}
                      </div>
                      <p className="text-muted-foreground text-sm mb-2">{alert.description}</p>
                      <div className="flex items-center gap-2 flex-wrap">
                        {getTypeBadge(alert.type)}
                        {getPriorityBadge(alert.priority)}
                        {alert.actionRequired && (
                          <Badge className="bg-warning/10 text-warning">Action Required</Badge>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 ml-4">
                    <span className="text-xs text-muted-foreground">
                      {new Date(alert.timestamp).toLocaleString()}
                    </span>
                    <div className="flex gap-1">
                      {alert.actionRequired && (
                        <Button size="sm" className="bg-gradient-primary text-white" onClick={() => takeAction(alert.id)}>
                          Take Action
                        </Button>
                      )}
                      <Button variant="ghost" size="sm" onClick={() => toggleRead(alert.id)}>
                        {alert.isRead ? <CheckCircle className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </Button>
                      <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive" onClick={() => deleteAlert(alert.id)}>
                        <XCircle className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
