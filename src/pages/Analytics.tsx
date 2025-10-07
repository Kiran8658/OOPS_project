import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from "recharts";
import { 
  TrendingUp, 
  TrendingDown, 
  BarChart3, 
  PieChart as PieChartIcon,
  Download,
  Calendar,
  Target,
  Zap
} from "lucide-react";

const salesData = [
  { month: "Jan", sales: 45000, orders: 120 },
  { month: "Feb", sales: 52000, orders: 140 },
  { month: "Mar", sales: 48000, orders: 130 },
  { month: "Apr", sales: 61000, orders: 165 },
  { month: "May", sales: 55000, orders: 145 },
  { month: "Jun", sales: 67000, orders: 180 }
];

const categoryData = [
  { name: "Groceries", value: 40, color: "hsl(var(--primary))" },
  { name: "Medicines", value: 25, color: "hsl(var(--secondary))" },
  { name: "Vegetables", value: 20, color: "hsl(var(--accent))" },
  { name: "Stationery", value: 15, color: "hsl(var(--success))" }
];

const topProducts = [
  { name: "Basmati Rice", sales: 150, revenue: 18000, trend: "up" },
  { name: "Wheat Flour", sales: 120, revenue: 5400, trend: "up" },
  { name: "Paracetamol", sales: 300, revenue: 600, trend: "down" },
  { name: "Notebooks", sales: 80, revenue: 4000, trend: "up" },
  { name: "Tomatoes", sales: 200, revenue: 12000, trend: "down" }
];

export default function Analytics() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-hero bg-clip-text text-transparent">
            Analytics Dashboard
          </h1>
          <p className="text-muted-foreground mt-2">
            Comprehensive business insights powered by SmartShelf AI.
          </p>
        </div>
        <div className="flex gap-2">
          <Select defaultValue="30days">
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7days">Last 7 days</SelectItem>
              <SelectItem value="30days">Last 30 days</SelectItem>
              <SelectItem value="90days">Last 3 months</SelectItem>
              <SelectItem value="1year">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Button className="bg-gradient-accent text-accent-foreground">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-primary text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/80 text-sm">Revenue Growth</p>
                <p className="text-2xl font-bold">+12.5%</p>
                <div className="flex items-center mt-1">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  <span className="text-sm">vs last month</span>
                </div>
              </div>
              <Target className="w-8 h-8 text-white/80" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-success text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/80 text-sm">Order Volume</p>
                <p className="text-2xl font-bold">+8.2%</p>
                <div className="flex items-center mt-1">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  <span className="text-sm">180 orders</span>
                </div>
              </div>
              <BarChart3 className="w-8 h-8 text-white/80" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-secondary text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/80 text-sm">Customer Satisfaction</p>
                <p className="text-2xl font-bold">94%</p>
                <div className="flex items-center mt-1">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  <span className="text-sm">+2% this week</span>
                </div>
              </div>
              <Zap className="w-8 h-8 text-white/80" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-info text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/80 text-sm">Profit Margin</p>
                <p className="text-2xl font-bold">28.3%</p>
                <div className="flex items-center mt-1">
                  <TrendingDown className="w-4 h-4 mr-1" />
                  <span className="text-sm">-1.2% vs target</span>
                </div>
              </div>
              <PieChartIcon className="w-8 h-8 text-white/80" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Trend */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="w-5 h-5 mr-2 text-primary" />
              Sales Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => [`₹${value}`, "Sales"]} />
                <Bar dataKey="sales" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Category Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <PieChartIcon className="w-5 h-5 mr-2 text-primary" />
              Sales by Category
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}%`}
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Top Products */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <TrendingUp className="w-5 h-5 mr-2 text-primary" />
            Top Performing Products
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topProducts.map((product, index) => (
              <div key={product.name} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                    {index + 1}
                  </div>
                  <div>
                    <h4 className="font-medium">{product.name}</h4>
                    <p className="text-sm text-muted-foreground">{product.sales} units sold</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="font-medium">₹{product.revenue.toLocaleString()}</p>
                    <div className="flex items-center">
                      {product.trend === "up" ? (
                        <TrendingUp className="w-4 h-4 text-success mr-1" />
                      ) : (
                        <TrendingDown className="w-4 h-4 text-destructive mr-1" />
                      )}
                      <Badge variant={product.trend === "up" ? "outline" : "destructive"} className="text-xs">
                        {product.trend === "up" ? "Growing" : "Declining"}
                      </Badge>
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