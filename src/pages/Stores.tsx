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
  Store,
  Plus,
  Search,
  MapPin,
  Phone,
  Mail,
  Users,
  TrendingUp,
  Package,
  Edit,
  Trash2,
  Eye,
} from "lucide-react";

// Mock data
interface StoreData {
  id: string;
  name: string;
  address: string;
  city: string;
  phone: string;
  email: string;
  manager: string;
  type: "grocery" | "medical" | "stationery" | "vegetables" | "general";
  status: "active" | "inactive" | "maintenance";
  revenue: number;
  orders: number;
  inventory: number;
  rating: number;
}

const mockStores: StoreData[] = [
  {
    id: "ST001",
    name: "Downtown Grocery Hub",
    address: "123 Main Street, Central Market",
    city: "Mumbai",
    phone: "+91 98765 43210",
    email: "downtown@smartshelf.com",
    manager: "Rajesh Kumar",
    type: "grocery",
    status: "active",
    revenue: 125000,
    orders: 450,
    inventory: 1200,
    rating: 4.8,
  },
  {
    id: "ST002",
    name: "MediCare Plus Pharmacy",
    address: "456 Health Avenue, Medical District",
    city: "Delhi",
    phone: "+91 98765 43211",
    email: "medicare@smartshelf.com",
    manager: "Dr. Priya Sharma",
    type: "medical",
    status: "active",
    revenue: 89000,
    orders: 320,
    inventory: 850,
    rating: 4.9,
  },
  {
    id: "ST003",
    name: "Fresh Veggie Market",
    address: "789 Green Street, Farmer's Market",
    city: "Bangalore",
    phone: "+91 98765 43212",
    email: "freshveggie@smartshelf.com",
    manager: "Amit Singh",
    type: "vegetables",
    status: "maintenance",
    revenue: 45000,
    orders: 180,
    inventory: 400,
    rating: 4.5,
  },
  {
    id: "ST004",
    name: "Smart Stationery World",
    address: "321 Education Lane, Student Quarter",
    city: "Pune",
    phone: "+91 98765 43213",
    email: "stationery@smartshelf.com",
    manager: "Sunita Patel",
    type: "stationery",
    status: "active",
    revenue: 67000,
    orders: 290,
    inventory: 950,
    rating: 4.6,
  },
];

// Utility badges
const getStatusBadge = (status: string) => {
  switch (status) {
    case "active":
      return <Badge className="bg-green-100 text-green-700 border border-green-300">Active</Badge>;
    case "inactive":
      return <Badge className="bg-red-100 text-red-700 border border-red-300">Inactive</Badge>;
    case "maintenance":
      return <Badge className="bg-yellow-100 text-yellow-800 border border-yellow-300">Maintenance</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

const getTypeBadge = (type: string) => {
  const colors: Record<string, string> = {
    grocery: "bg-blue-100 text-blue-800",
    medical: "bg-green-100 text-green-800",
    stationery: "bg-purple-100 text-purple-800",
    vegetables: "bg-emerald-100 text-emerald-800",
    general: "bg-gray-100 text-gray-800",
  };
  return (
    <Badge className={`${colors[type] || "bg-gray-100 text-gray-700"} border`}>
      {type.charAt(0).toUpperCase() + type.slice(1)}
    </Badge>
  );
};

export default function Stores() {
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredStores = mockStores.filter((store) => {
    const matchesSearch =
      store.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      store.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      store.manager.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === "all" || store.type === typeFilter;
    const matchesStatus = statusFilter === "all" || store.status === statusFilter;
    return matchesSearch && matchesType && matchesStatus;
  });

  const totalRevenue = mockStores.reduce((sum, store) => sum + store.revenue, 0);
  const activeStores = mockStores.filter((store) => store.status === "active").length;
  const totalOrders = mockStores.reduce((sum, store) => sum + store.orders, 0);

  return (
    <div className="space-y-6 text-gray-900">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Store Management</h1>
          <p className="text-gray-600 mt-2">
            Manage all your SmartShelf-enabled stores from one central dashboard.
          </p>
        </div>
        <Button className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-md hover:shadow-lg">
          <Plus className="w-4 h-4 mr-2" />
          Add New Store
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-blue-50 border border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between text-blue-900">
              <div>
                <p className="text-sm">Total Stores</p>
                <p className="text-2xl font-bold">{mockStores.length}</p>
              </div>
              <Store className="w-8 h-8 opacity-75" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-green-50 border border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between text-green-900">
              <div>
                <p className="text-sm">Active Stores</p>
                <p className="text-2xl font-bold">{activeStores}</p>
              </div>
              <Users className="w-8 h-8 opacity-75" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-purple-50 border border-purple-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between text-purple-900">
              <div>
                <p className="text-sm">Total Revenue</p>
                <p className="text-2xl font-bold">₹{totalRevenue.toLocaleString()}</p>
              </div>
              <TrendingUp className="w-8 h-8 opacity-75" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-amber-50 border border-amber-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between text-amber-900">
              <div>
                <p className="text-sm">Total Orders</p>
                <p className="text-2xl font-bold">{totalOrders}</p>
              </div>
              <Package className="w-8 h-8 opacity-75" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6 bg-white">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search stores by name, city, or manager..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 border-gray-300 text-gray-800"
              />
            </div>

            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full md:w-48 text-gray-800 border-gray-300">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="grocery">Grocery</SelectItem>
                <SelectItem value="medical">Medical</SelectItem>
                <SelectItem value="stationery">Stationery</SelectItem>
                <SelectItem value="vegetables">Vegetables</SelectItem>
                <SelectItem value="general">General</SelectItem>
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48 text-gray-800 border-gray-300">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="maintenance">Maintenance</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Stores List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredStores.map((store) => (
          <Card key={store.id} className="hover:shadow-md border border-gray-200 transition-all bg-white text-gray-900">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Store className="w-5 h-5 text-blue-600" />
                    {store.name}
                  </CardTitle>
                  <div className="flex items-center gap-2 mt-2">
                    {getTypeBadge(store.type)}
                    {getStatusBadge(store.status)}
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button variant="ghost" size="sm">
                    <Eye className="w-4 h-4 text-gray-700" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Edit className="w-4 h-4 text-blue-700" />
                  </Button>
                  <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="space-y-2 text-sm text-gray-700">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-gray-500" />
                  <span>{store.address}, {store.city}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-gray-500" />
                  <span>{store.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-gray-500" />
                  <span>{store.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-gray-500" />
                  <span>Manager: {store.manager}</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-200">
                <div className="text-center">
                  <p className="text-lg font-bold text-blue-700">₹{store.revenue.toLocaleString()}</p>
                  <p className="text-xs text-gray-500">Revenue</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold text-green-700">{store.orders}</p>
                  <p className="text-xs text-gray-500">Orders</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold text-purple-700">{store.inventory}</p>
                  <p className="text-xs text-gray-500">Items</p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                <span className="text-sm text-gray-600">Customer Rating</span>
                <div className="flex items-center gap-1">
                  <span className="font-medium text-gray-800">{store.rating}</span>
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className={`text-sm ${i < Math.floor(store.rating) ? "text-yellow-500" : "text-gray-300"}`}>
                      ★
                    </span>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
