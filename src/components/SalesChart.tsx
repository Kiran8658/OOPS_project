import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChartContainer, ChartTooltip } from "@/components/ui/chart-simple";
import { useNavigate } from "react-router-dom";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  BarChart,
  Bar
} from "recharts";
import { Calendar, BarChart3, TrendingUp } from "lucide-react";

const weeklySalesData = [
  { name: "Mon", sales: 4000, orders: 24 },
  { name: "Tue", sales: 3000, orders: 18 },
  { name: "Wed", sales: 5000, orders: 32 },
  { name: "Thu", sales: 2780, orders: 17 },
  { name: "Fri", sales: 1890, orders: 12 },
  { name: "Sat", sales: 6390, orders: 41 },
  { name: "Sun", sales: 4490, orders: 28 },
];

const monthlySalesData = [
  { name: "Week 1", sales: 25000, orders: 156 },
  { name: "Week 2", sales: 32000, orders: 198 },
  { name: "Week 3", sales: 28000, orders: 175 },
  { name: "Week 4", sales: 35000, orders: 220 },
];

const categoryData = [
  { name: "Groceries", value: 35, sales: 15000 },
  { name: "Medicines", value: 25, sales: 12000 },
  { name: "Vegetables", value: 20, sales: 8000 },
  { name: "Stationery", value: 10, sales: 4000 },
  { name: "Others", value: 10, sales: 3000 },
];

export function SalesChart() {
  const navigate = useNavigate();
  const [timePeriod, setTimePeriod] = useState<'weekly' | 'monthly'>('weekly');
  const [chartType, setChartType] = useState<'line' | 'bar'>('line');

  const currentSalesData = timePeriod === 'weekly' ? weeklySalesData : monthlySalesData;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg font-semibold">
            {timePeriod === 'weekly' ? 'Weekly' : 'Monthly'} Sales Trend
          </CardTitle>
          <div className="flex gap-2">
            <Button
              variant={timePeriod === 'weekly' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setTimePeriod('weekly')}
            >
              <Calendar className="w-4 h-4 mr-1" />
              Weekly
            </Button>
            <Button
              variant={timePeriod === 'monthly' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setTimePeriod('monthly')}
            >
              <Calendar className="w-4 h-4 mr-1" />
              Monthly
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center mb-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/analytics')}
              className="text-primary hover:text-primary/80"
            >
              <TrendingUp className="w-4 h-4 mr-2" />
              View Detailed Analytics
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setChartType(chartType === 'line' ? 'bar' : 'line')}
            >
              <BarChart3 className="w-4 h-4 mr-2" />
              {chartType === 'line' ? 'Bar Chart' : 'Line Chart'}
            </Button>
          </div>
          <ChartContainer>
            {chartType === 'line' ? (
              <LineChart data={currentSalesData}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis
                  dataKey="name"
                  className="text-xs"
                  tick={{ fill: 'hsl(var(--muted-foreground))' }}
                />
                <YAxis
                  className="text-xs"
                  tick={{ fill: 'hsl(var(--muted-foreground))' }}
                />
                <ChartTooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                    color: 'hsl(var(--card-foreground))'
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="sales"
                  stroke="hsl(var(--primary))"
                  strokeWidth={3}
                  dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: 'hsl(var(--primary))', strokeWidth: 2 }}
                />
              </LineChart>
            ) : (
              <BarChart data={currentSalesData}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis
                  dataKey="name"
                  className="text-xs"
                  tick={{ fill: 'hsl(var(--muted-foreground))' }}
                />
                <YAxis
                  className="text-xs"
                  tick={{ fill: 'hsl(var(--muted-foreground))' }}
                />
                <ChartTooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                    color: 'hsl(var(--card-foreground))'
                  }}
                />
                <Bar
                  dataKey="sales"
                  fill="hsl(var(--primary))"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            )}
          </ChartContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Sales by Category</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer>
            <BarChart data={categoryData}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis 
                dataKey="name" 
                className="text-xs"
                tick={{ fill: 'hsl(var(--muted-foreground))' }}
                angle={-45}
                textAnchor="end"
                height={60}
              />
              <YAxis 
                className="text-xs"
                tick={{ fill: 'hsl(var(--muted-foreground))' }}
              />
              <ChartTooltip 
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                  color: 'hsl(var(--card-foreground))'
                }}
              />
              <Bar 
                dataKey="sales" 
                fill="hsl(var(--secondary))"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
}