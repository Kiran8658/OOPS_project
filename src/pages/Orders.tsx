import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Plus,
  Search,
  ShoppingCart,
  Eye,
  Download,
  Calendar,
  TrendingUp,
  Package
} from "lucide-react";
import { OrderForm } from "@/components/OrderForm";

interface Order {
  id: string;
  customerName: string;
  items: number;
  total: number;
  status: "pending" | "processing" | "completed" | "cancelled";
  date: string;
  paymentMethod: string;
}

const mockOrders: Order[] = [
  {
    id: "ORD-001",
    customerName: "Rajesh Kumar",
    items: 5,
    total: 850,
    status: "completed",
    date: "2024-08-19",
    paymentMethod: "UPI"
  },
  {
    id: "ORD-002", 
    customerName: "Priya Sharma",
    items: 3,
    total: 420,
    status: "processing",
    date: "2024-08-19",
    paymentMethod: "Cash"
  },
  {
    id: "ORD-003",
    customerName: "Amit Singh", 
    items: 8,
    total: 1250,
    status: "pending",
    date: "2024-08-18",
    paymentMethod: "Card"
  },
  {
    id: "ORD-004",
    customerName: "Sunita Patel",
    items: 2,
    total: 180,
    status: "cancelled",
    date: "2024-08-18", 
    paymentMethod: "UPI"
  }
];

const getStatusBadge = (status: string) => {
  switch (status) {
    case "completed":
      return <Badge className="bg-success/10 text-success border-success/20">Completed</Badge>;
    case "processing":
      return <Badge className="bg-info/10 text-info border-info/20">Processing</Badge>;
    case "pending":
      return <Badge className="bg-warning/10 text-warning border-warning/20">Pending</Badge>;
    case "cancelled":
      return <Badge variant="destructive">Cancelled</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

export default function Orders() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isOrderFormOpen, setIsOrderFormOpen] = useState(false);
  const [orders, setOrders] = useState<Order[]>(mockOrders);

  // Check for create query parameter on component mount
  useEffect(() => {
    const createParam = searchParams.get('create');
    if (createParam === 'true') {
      setIsOrderFormOpen(true);
      // Remove the query parameter from URL
      setSearchParams({});
    }
  }, [searchParams, setSearchParams]);

  const filteredOrders = orders.filter((order) => {
    const matchesSearch = order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || order.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const totalRevenue = orders.reduce((sum, order) =>
    order.status === "completed" ? sum + order.total : sum, 0
  );

  const [orderToEdit, setOrderToEdit] = useState<Order | null>(null);
  const [isViewMode, setIsViewMode] = useState(false);

  const handleNewOrder = (orderData: any) => {
    const newOrder: Order = {
      id: `ORD-${String(orders.length + 1).padStart(3, '0')}`,
      customerName: orderData.customerName,
      items: orderData.items.length,
      total: orderData.items.reduce((sum: number, item: any) => sum + (item.quantity * item.price), 0),
      status: "pending",
      date: new Date().toISOString().split('T')[0],
      paymentMethod: orderData.paymentMethod,
    };

    setOrders(prev => [newOrder, ...prev]);
  };

  const handleEditOrder = (order: Order) => {
    setOrderToEdit(order);
    setIsViewMode(false);
    setIsOrderFormOpen(true);
  };

  const handleViewOrder = (order: Order) => {
    setOrderToEdit(order);
    setIsViewMode(true);
    setIsOrderFormOpen(true);
  };

  const handleDeleteOrder = (orderId: string) => {
    if (confirm("Are you sure you want to delete this order?")) {
      setOrders(prev => prev.filter(order => order.id !== orderId));
    }
  };

  function calculateOrderTotal(items: any[]): number {
    return items.reduce((sum: number, item: any) => sum + (item.quantity * item.price), 0);
  }
  
  const handleUpdateOrder = (updatedOrderData: any) => {
      setOrders(prev =>
        prev.map(order =>
          order.id === orderToEdit?.id
            ? {
                ...order,
                customerName: updatedOrderData.customerName,
                items: updatedOrderData.items.length,
                total: calculateOrderTotal(updatedOrderData.items),
                paymentMethod: updatedOrderData.paymentMethod,
                notes: updatedOrderData.notes,
              }
            : order
        )
      );
      setOrderToEdit(null);
      setIsOrderFormOpen(false);
    };

  const handleDownloadOrder = (order: Order) => {
    const orderDetails = `
Order ID: ${order.id}
Customer: ${order.customerName}
Items: ${order.items}
Total: ₹${order.total}
Payment Method: ${order.paymentMethod}
Date: ${new Date(order.date).toLocaleDateString()}
Status: ${order.status}
    `;
    const blob = new Blob([orderDetails], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${order.id}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-hero bg-clip-text text-transparent">
            Order Management
          </h1>
          <p className="text-muted-foreground mt-2">
            Track and manage customer orders with SmartShelf analytics.
          </p>
        </div>
        <Button
          className="bg-gradient-primary hover:opacity-90 text-white shadow-lg"
          onClick={() => setIsOrderFormOpen(true)}
        >
          <Plus className="w-4 h-4 mr-2" />
          New Order
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-primary text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/80 text-sm">Total Orders</p>
                <p className="text-2xl font-bold">{orders.length}</p>
              </div>
              <ShoppingCart className="w-8 h-8 text-white/80" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-success text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/80 text-sm">Revenue Today</p>
                <p className="text-2xl font-bold">₹{totalRevenue}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-white/80" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-secondary text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/80 text-sm">Completed</p>
                <p className="text-2xl font-bold">
                  {orders.filter(o => o.status === "completed").length}
                </p>
              </div>
              <Package className="w-8 h-8 text-white/80" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-accent text-accent-foreground">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-accent-foreground/80 text-sm">Pending</p>
                <p className="text-2xl font-bold">
                  {orders.filter(o => o.status === "pending").length}
                </p>
              </div>
              <Calendar className="w-8 h-8 text-accent-foreground/80" />
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
                  placeholder="Search orders by customer or order ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Orders Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <ShoppingCart className="w-5 h-5 mr-2 text-primary" />
            Orders ({filteredOrders.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Payment</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.map((order) => (
                  <TableRow key={order.id} className="hover:bg-muted/50">
                    <TableCell className="font-medium">{order.id}</TableCell>
                    <TableCell>{order.customerName}</TableCell>
                    <TableCell>{order.items} items</TableCell>
                    <TableCell className="font-medium">₹{order.total}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{order.paymentMethod}</Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(order.date).toLocaleDateString()}
                    </TableCell>
                    <TableCell>{getStatusBadge(order.status)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                    <Button variant="ghost" size="sm" onClick={() => handleViewOrder(order)}>
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDownloadOrder(order)}>
                      <Download className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleEditOrder(order)}>
                      Edit
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDeleteOrder(order.id)}>
                      Delete
                    </Button>
                  </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <OrderForm
        isOpen={isOrderFormOpen}
        isEdit={!!orderToEdit && !isViewMode}
        isView={isViewMode}
        orderToEdit={orderToEdit}
        onClose={() => {
          setIsOrderFormOpen(false);
          setOrderToEdit(null);
          setIsViewMode(false);
        }}
        onSubmit={orderToEdit ? handleUpdateOrder : handleNewOrder}
      />
    </div>
  );
}
