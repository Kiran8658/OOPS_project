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
  Eye
} from "lucide-react";

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
    rating: 4.8
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
    rating: 4.9
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
    rating: 4.5
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
    rating: 4.6
  }
];

const getStatusBadge = (status: string) => {
  switch (status) {
    case "active":
      return <Badge className="bg-success/10 text-success border-success/20">Active</Badge>;
    case "inactive":
      return <Badge variant="destructive">Inactive</Badge>;
    case "maintenance":
      return <Badge className="bg-warning/10 text-warning border-warning/20">Maintenance</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

const getTypeBadge = (type: string) => {
  const typeColors = {
    grocery: "bg-primary/10 text-primary",
    medical: "bg-success/10 text-success", 
    stationery: "bg-accent/10 text-accent-foreground",
    vegetables: "bg-secondary/10 text-secondary-foreground",
    general: "bg-muted/10 text-muted-foreground"
  };
  
  return <Badge className={typeColors[type as keyof typeof typeColors] || "bg-muted/10 text-muted-foreground"}>
    {type.charAt(0).toUpperCase() + type.slice(1)}
  </Badge>;
};

export default function Stores() {
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredStores = mockStores.filter((store) => {
    const matchesSearch = store.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         store.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         store.manager.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === "all" || store.type === typeFilter;
    const matchesStatus = statusFilter === "all" || store.status === statusFilter;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  const totalRevenue = mockStores.reduce((sum, store) => sum + store.revenue, 0);
  const activeStores = mockStores.filter(store => store.status === "active").length;
  const totalOrders = mockStores.reduce((sum, store) => sum + store.orders, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-hero bg-clip-text text-transparent">
            Store Management
          </h1>
          <p className="text-muted-foreground mt-2">
            Manage all your SmartShelf-enabled stores from one central dashboard.
          </p>
        </div>
        <Button className="bg-gradient-primary hover:opacity-90 text-white shadow-lg">
          <Plus className="w-4 h-4 mr-2" />
          Add New Store
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-primary text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/80 text-sm">Total Stores</p>
                <p className="text-2xl font-bold">{mockStores.length}</p>
              </div>
              <Store className="w-8 h-8 text-white/80" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-success text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/80 text-sm">Active Stores</p>
                <p className="text-2xl font-bold">{activeStores}</p>
              </div>
              <Users className="w-8 h-8 text-white/80" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-secondary text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/80 text-sm">Total Revenue</p>
                <p className="text-2xl font-bold">₹{totalRevenue.toLocaleString()}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-white/80" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-accent text-accent-foreground">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-accent-foreground/80 text-sm">Total Orders</p>
                <p className="text-2xl font-bold">{totalOrders}</p>
              </div>
              <Package className="w-8 h-8 text-accent-foreground/80" />
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
                  placeholder="Search stores by name, city, or manager..."
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
                <SelectItem value="grocery">Grocery</SelectItem>
                <SelectItem value="medical">Medical</SelectItem>
                <SelectItem value="stationery">Stationery</SelectItem>
                <SelectItem value="vegetables">Vegetables</SelectItem>
                <SelectItem value="general">General</SelectItem>
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48">
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

      {/* Stores Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredStores.map((store) => (
          <Card key={store.id} className="hover:shadow-lg transition-all duration-200">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Store className="w-5 h-5 text-primary" />
                    {store.name}
                  </CardTitle>
                  <div className="flex items-center gap-2 mt-2">
                    {getTypeBadge(store.type)}
                    {getStatusBadge(store.status)}
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button variant="ghost" size="sm">
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Contact Info */}
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <span>{store.address}, {store.city}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    <span>{store.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    <span>{store.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-muted-foreground" />
                    <span>Manager: {store.manager}</span>
                  </div>
                </div>

                {/* Performance Metrics */}
                <div className="grid grid-cols-3 gap-4 pt-4 border-t">
                  <div className="text-center">
                    <p className="text-lg font-bold text-primary">₹{store.revenue.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">Revenue</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-bold text-secondary">{store.orders}</p>
                    <p className="text-xs text-muted-foreground">Orders</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-bold text-accent-foreground">{store.inventory}</p>
                    <p className="text-xs text-muted-foreground">Items</p>
                  </div>
                </div>

                {/* Rating */}
                <div className="flex items-center justify-between pt-2 border-t">
                  <span className="text-sm text-muted-foreground">Customer Rating</span>
                  <div className="flex items-center gap-1">
                    <span className="font-medium">{store.rating}</span>
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className={`text-sm ${i < Math.floor(store.rating) ? 'text-warning' : 'text-muted'}`}>
                          ★
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}