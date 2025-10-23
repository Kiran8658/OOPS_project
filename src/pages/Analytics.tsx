import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { fetchAnalytics, addAnalytics } from "../lib/api";

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
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  BarChart3,
  PieChart as PieChartIcon,
  Download,
  Target,
  Zap,
  Loader2,
  PlusCircle,
} from "lucide-react";

export default function Analytics() {
  const [timeRange, setTimeRange] = useState("30days");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [analytics, setAnalytics] = useState<any[]>([]);
  const [salesData, setSalesData] = useState<any[]>([]);
  const [categoryData, setCategoryData] = useState<any[]>([]);
  const [topProducts, setTopProducts] = useState<any[]>([]);

  // ---------------------------
  // FETCH ANALYTICS DATA
  // ---------------------------
  useEffect(() => {
    fetchAnalyticsData();
  }, [timeRange]);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await fetchAnalytics(); // ✅ Backend API call (GET /api/analytics)
      console.log("Fetched Analytics:", data);

      setAnalytics(data || []);

      // Optional: You can split data into charts if your backend provides structured data
      setSalesData(
        data?.salesTrend || [
          { month: "Jan", sales: 45000 },
          { month: "Feb", sales: 52000 },
          { month: "Mar", sales: 48000 },
          { month: "Apr", sales: 61000 },
          { month: "May", sales: 55000 },
          { month: "Jun", sales: 67000 },
        ]
      );

      setCategoryData(
        data?.categoryDistribution || [
          { name: "Groceries", value: 40, color: "#2563eb" },
          { name: "Medicines", value: 25, color: "#10b981" },
          { name: "Vegetables", value: 20, color: "#f59e0b" },
          { name: "Stationery", value: 15, color: "#ef4444" },
        ]
      );

      setTopProducts(
        data?.topProducts || [
          { name: "Basmati Rice", sales: 150, revenue: 18000, trend: "up" },
          { name: "Wheat Flour", sales: 120, revenue: 5400, trend: "up" },
          { name: "Paracetamol", sales: 300, revenue: 600, trend: "down" },
          { name: "Notebooks", sales: 80, revenue: 4000, trend: "up" },
          { name: "Tomatoes", sales: 200, revenue: 12000, trend: "down" },
        ]
      );
    } catch (err: any) {
      console.error("Error fetching analytics:", err);
      setError(err?.response?.data?.message || "Failed to load analytics data");
    } finally {
      setLoading(false);
    }
  };

  // ---------------------------
  // ADD NEW ANALYTICS ENTRY
  // ---------------------------
  const handleAddAnalytics = async () => {
    const newAnalyticsData = {
      reportDate: new Date().toISOString(),
      sales: Math.floor(Math.random() * 100000),
      profitMargin: (Math.random() * 40).toFixed(2),
      topCategory: "Groceries",
    };

    try {
      await addAnalytics(newAnalyticsData); // ✅ POST /api/analytics
      fetchAnalyticsData(); // Refresh data after insert
    } catch (err) {
      console.error("Error adding analytics:", err);
    }
  };

  // Default KPI cards if backend doesn’t provide any
  const defaultKPIs = [
    {
      title: "Revenue Growth",
      value: "+12.5%",
      subtitle: "vs last month",
      icon: <Target className="w-8 h-8 text-blue-600" />,
    },
    {
      title: "Order Volume",
      value: "+8.2%",
      subtitle: "180 orders",
      icon: <BarChart3 className="w-8 h-8 text-green-600" />,
    },
    {
      title: "Customer Satisfaction",
      value: "94%",
      subtitle: "+2% this week",
      icon: <Zap className="w-8 h-8 text-yellow-500" />,
    },
    {
      title: "Profit Margin",
      value: "28.3%",
      subtitle: "-1.2% vs target",
      icon: <PieChartIcon className="w-8 h-8 text-red-500" />,
    },
  ];

  return (
    <div className="space-y-8 text-gray-900">
      {error && (
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800">
            ⚠️ {error} - Using sample data for preview
          </p>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Analytics Dashboard
          </h1>
          <p className="text-gray-600 mt-1">
            Comprehensive insights powered by SmartShelf.
          </p>
        </div>
        <div className="flex gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-40 border-gray-300">
              <SelectValue placeholder="Select Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7days">Last 7 days</SelectItem>
              <SelectItem value="30days">Last 30 days</SelectItem>
              <SelectItem value="90days">Last 3 months</SelectItem>
              <SelectItem value="1year">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Button
            className="bg-green-600 hover:bg-green-700 text-white"
            onClick={handleAddAnalytics}
          >
            <PlusCircle className="w-4 h-4 mr-2" />
            Add Data
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {defaultKPIs.map((item, i) => (
            <Card key={i} className="border border-gray-200 shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">{item.title}</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {item.value}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">{item.subtitle}</p>
                  </div>
                  {item.icon}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Trend */}
        <Card className="border border-gray-200">
          <CardHeader>
            <CardTitle className="flex items-center text-gray-900">
              <BarChart3 className="w-5 h-5 mr-2 text-blue-600" />
              Sales Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center h-[300px]">
                <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="month" stroke="#374151" />
                  <YAxis stroke="#374151" />
                  <Tooltip formatter={(value) => [`₹${value}`, "Sales"]} />
                  <Bar dataKey="sales" fill="#2563eb" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Category Distribution */}
        <Card className="border border-gray-200">
          <CardHeader>
            <CardTitle className="flex items-center text-gray-900">
              <PieChartIcon className="w-5 h-5 mr-2 text-blue-600" />
              Sales by Category
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center h-[300px]">
                <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
              </div>
            ) : (
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
            )}
          </CardContent>
        </Card>
      </div>

      {/* Top Products */}
      <Card className="border border-gray-200">
        <CardHeader>
          <CardTitle className="flex items-center text-gray-900">
            <TrendingUp className="w-5 h-5 mr-2 text-blue-600" />
            Top Performing Products
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
            </div>
          ) : (
            <div className="space-y-4">
              {topProducts.map((product, index) => (
                <div
                  key={product.name}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">
                        {product.name}
                      </h4>
                      <p className="text-sm text-gray-500">
                        {product.sales} units sold
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="font-medium text-gray-900">
                        ₹{product.revenue.toLocaleString()}
                      </p>
                      <div className="flex items-center justify-end">
                        {product.trend === "up" ? (
                          <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
                        ) : (
                          <TrendingDown className="w-4 h-4 text-red-600 mr-1" />
                        )}
                        <Badge
                          variant="outline"
                          className={`text-xs ${
                            product.trend === "up"
                              ? "border-green-500 text-green-600"
                              : "border-red-500 text-red-600"
                          }`}
                        >
                          {product.trend === "up" ? "Growing" : "Declining"}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
