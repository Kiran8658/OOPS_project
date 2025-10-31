import { useState, useEffect } from "react";
import axios from "axios";
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
  const [error, setError] = useState(null);

  const [salesData, setSalesData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [topProducts, setTopProducts] = useState([]);

  const [kpis, setKpis] = useState([
    {
      title: "Revenue Growth",
      value: "+12.5%",
      subtitle: "vs last month",
      icon: <Target className="w-8 h-8 text-[#d8272d]" />,
    },
    {
      title: "Order Volume",
      value: "+8.2%",
      subtitle: "180 orders",
      icon: <BarChart3 className="w-8 h-8 text-[#b81e23]" />,
    },
    {
      title: "Customer Satisfaction",
      value: "94%",
      subtitle: "+2% this week",
      icon: <Zap className="w-8 h-8 text-[#ff6b6b]" />,
    },
    {
      title: "Profit Margin",
      value: "28.3%",
      subtitle: "-1.2% vs target",
      icon: <PieChartIcon className="w-8 h-8 text-[#d8272d]" />,
    },
  ]);

  useEffect(() => {
    fetchAnalyticsData();
  }, [timeRange]);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch data from your backend
      const [ordersRes, inventoryRes] = await Promise.all([
        axios.get("http://localhost:5000/api/orders"),
        axios.get("http://localhost:5000/api/inventory"),
      ]);

      const orders = ordersRes.data || [];
      const inventory = inventoryRes.data || [];

      // ---- Compute Revenue and Order Trends ----
      const monthlySales = {};
      let totalRevenue = 0;

      orders.forEach((order) => {
        const date = new Date(order.date);
        const month = date.toLocaleString("default", { month: "short" });
        const amount = order.totalAmount || 0;
        monthlySales[month] = (monthlySales[month] || 0) + amount;
        totalRevenue += amount;
      });

      const salesTrend = Object.entries(monthlySales).map(([month, sales]) => ({
        month,
        sales,
      }));

      // ---- Category Distribution ----
      const categoryMap = {};
      inventory.forEach((item) => {
        categoryMap[item.category] = (categoryMap[item.category] || 0) + item.stock;
      });

      const categoryDistribution = Object.entries(categoryMap).map(
        ([name, value], index) => ({
          name,
          value,
          color: ["#d8272d", "#b81e23", "#ff6b6b", "#ff9b9b", "#ffa07a"][index % 5],
        })
      );

      // ---- Top Products ----
      const topProducts = orders
        .flatMap((order) =>
          order.items.map((i) => ({
            name: i.name,
            sales: i.quantity,
            revenue: i.quantity * i.price,
          }))
        )
        .reduce((acc, curr) => {
          const existing = acc.find((x) => x.name === curr.name);
          if (existing) {
            existing.sales += curr.sales;
            existing.revenue += curr.revenue;
          } else {
            acc.push(curr);
          }
          return acc;
        }, [])
        .sort((a, b) => b.sales - a.sales)
        .slice(0, 5)
        .map((p, i) => ({
          ...p,
          trend: i % 2 === 0 ? "up" : "down",
        }));

      // ---- KPI Updates ----
      const updatedKPIs = [...kpis];
      updatedKPIs[0].value = `${((totalRevenue / 100000) * 100).toFixed(1)}%`;
      updatedKPIs[1].subtitle = `${orders.length} orders`;
      updatedKPIs[3].value = `${(Math.random() * 30 + 10).toFixed(1)}%`;
      setKpis(updatedKPIs);

      // ---- Update State ----
      setSalesData(salesTrend);
      setCategoryData(categoryDistribution);
      setTopProducts(topProducts);
    } catch (err) {
      console.error("Error fetching analytics:", err);
      setError("⚠️ Failed to load analytics. Showing sample data.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddAnalytics = async () => {
    alert("Add Analytics clicked — integrate if you want to push reports to backend.");
  };

  return (
    <div className="space-y-8 p-6 bg-gradient-to-br from-[#fef5f1] via-[#fff8f6] to-[#fef5f1] min-h-screen rounded-xl">
      {error && (
        <div className="p-4 bg-[#fff3f3] border border-[#f1d1d1] rounded-lg text-[#b81e23]">
          {error}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#b81e23]">Analytics Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Comprehensive insights powered by SmartShelf.
          </p>
        </div>

        <div className="flex gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-40 border-[#d8272d] text-[#b81e23]">
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
            className="bg-[#d8272d] hover:bg-[#b81e23] text-white font-semibold"
            onClick={handleAddAnalytics}
          >
            <PlusCircle className="w-4 h-4 mr-2" />
            Add Data
          </Button>
          <Button className="border border-[#d8272d] text-[#d8272d] hover:bg-[#d8272d] hover:text-white font-semibold">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-[#d8272d]" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {kpis.map((item, i) => (
            <Card
              key={i}
              className="border border-[#f1d1d1] shadow-md hover:shadow-lg transition rounded-2xl bg-white"
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">{item.title}</p>
                    <p className="text-2xl font-bold text-[#b81e23]">{item.value}</p>
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
      {!loading && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Sales Trend */}
          <Card className="border border-[#f1d1d1] shadow-md rounded-2xl">
            <CardHeader>
              <CardTitle className="flex items-center text-[#b81e23]">
                <BarChart3 className="w-5 h-5 mr-2 text-[#d8272d]" />
                Sales Trend
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[320px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={salesData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f3d6d6" />
                    <XAxis dataKey="month" stroke="#b81e23" />
                    <YAxis stroke="#b81e23" />
                    <Tooltip formatter={(value) => [`₹${value}`, "Sales"]} />
                    <Bar dataKey="sales" fill="#d8272d" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Sales by Category */}
          <Card className="border border-[#f1d1d1] shadow-md rounded-2xl">
            <CardHeader>
              <CardTitle className="flex items-center text-[#b81e23]">
                <PieChartIcon className="w-5 h-5 mr-2 text-[#d8272d]" />
                Sales by Category
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[320px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}`}
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Top Products */}
      {!loading && (
        <Card className="border border-[#f1d1d1] shadow-md rounded-2xl">
          <CardHeader>
            <CardTitle className="flex items-center text-[#b81e23]">
              <TrendingUp className="w-5 h-5 mr-2 text-[#d8272d]" />
              Top Performing Products
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topProducts.map((product, index) => (
                <div
                  key={product.name}
                  className="flex items-center justify-between p-4 border border-[#f1d1d1] rounded-lg hover:bg-[#fff5f5] transition"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 rounded-full bg-[#ffe5e5] flex items-center justify-center text-[#b81e23] font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <h4 className="font-medium text-[#b81e23]">{product.name}</h4>
                      <p className="text-sm text-gray-500">
                        {product.sales} units sold
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="font-medium text-[#b81e23]">
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
          </CardContent>
        </Card>
      )}
    </div>
  );
}
