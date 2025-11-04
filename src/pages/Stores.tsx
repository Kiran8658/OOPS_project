import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
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
} from "lucide-react";
import {
  getStores,
  addStore,
  updateStore,
  deleteStore,
} from "@/api/storeService";

interface StoreData {
  id?: string | number;
  name: string;
  address: string;
  city: string;
  phone: string;
  email: string;
  manager: string;
  type: string;
  status: string;
  revenue: number;
  orders: number;
  inventory: number;
  rating: number;
}

// Utility: Status badge
const getStatusBadge = (status: string | null | undefined) => {
  if (!status) return <Badge className="bg-gray-100 text-gray-600">N/A</Badge>;
  const colors: Record<string, string> = {
    active: "bg-green-100 text-green-800 border-green-300",
    inactive: "bg-red-100 text-red-800 border-red-300",
    maintenance: "bg-yellow-100 text-yellow-800 border-yellow-300",
  };
  return (
    <Badge className={`border ${colors[status] || "bg-gray-100 text-gray-700"}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  );
};

// Utility: Type badge
const getTypeBadge = (type: string | null | undefined) => {
  if (!type) return <Badge className="bg-gray-100 text-gray-600">N/A</Badge>;
  const colors: Record<string, string> = {
    grocery: "bg-blue-100 text-blue-800",
    medical: "bg-green-100 text-green-800",
    stationery: "bg-purple-100 text-purple-800",
    vegetables: "bg-emerald-100 text-emerald-800",
    general: "bg-gray-100 text-gray-800",
  };
  return (
    <Badge className={`border ${colors[type] || "bg-gray-100 text-gray-700"}`}>
      {type.charAt(0).toUpperCase() + type.slice(1)}
    </Badge>
  );
};

export default function Stores() {
  const [stores, setStores] = useState<StoreData[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(false);
  const [openForm, setOpenForm] = useState(false);
  const [newStore, setNewStore] = useState<StoreData>({
    name: "",
    address: "",
    city: "",
    phone: "",
    email: "",
    manager: "",
    type: "general",
    status: "active",
    revenue: 0,
    orders: 0,
    inventory: 0,
    rating: 0,
  });

  const fetchStores = async () => {
    setLoading(true);
    try {
      const data = await getStores();
      if (Array.isArray(data)) {
        setStores(
          data.map((store) => ({
            ...store,
            id: String(store.id ?? ""),
            type: store.type || "general",
            status: store.status || "active",
          }))
        );
      } else setStores([]);
    } catch (err) {
      console.error("❌ Error fetching stores:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStores();
  }, []);

  // ✅ Add new store
  const handleSaveStore = async () => {
    try {
      await addStore(newStore);
      await fetchStores();
      setOpenForm(false);
      alert("✅ Store added successfully!");
    } catch (err) {
      console.error("❌ Error adding store:", err);
      alert("Failed to save store!");
    }
  };

  // Edit store
  const handleEdit = async (id: string | number) => {
    const newName = prompt("Enter new name:");
    if (!newName) return;
    try {
      await updateStore(Number(id), { name: newName });
      await fetchStores();
    } catch (err) {
      console.error("❌ Error updating store:", err);
    }
  };

  // Delete store
  const handleDelete = async (id: string | number) => {
    if (!confirm("Are you sure to delete this store?")) return;
    try {
      await deleteStore(Number(id));
      await fetchStores();
    } catch (err) {
      console.error("❌ Error deleting store:", err);
    }
  };

  const filteredStores = stores.filter((store) => {
    const matchSearch =
      store.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      store.city.toLowerCase().includes(searchTerm.toLowerCase());
    const matchType = typeFilter === "all" || store.type === typeFilter;
    const matchStatus = statusFilter === "all" || store.status === statusFilter;
    return matchSearch && matchType && matchStatus;
  });

  const totalRevenue = stores.reduce((sum, s) => sum + (s.revenue || 0), 0);
  const activeStores = stores.filter((s) => s.status === "active").length;
  const totalOrders = stores.reduce((sum, s) => sum + (s.orders || 0), 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fef5f1] via-[#fff8f6] to-[#fef5f1] text-gray-900 p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Store Management</h1>
        <Button
          onClick={() => setOpenForm(true)}
          className="bg-gradient-to-r from-[#d8272d] to-[#b81e23] text-white shadow-lg"
        >
          <Plus className="w-4 h-4 mr-2" /> Add New Store
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <Card className="bg-[#fdecea] border-none">
          <CardContent className="p-6 flex justify-between">
            <div>
              <p className="text-sm text-[#b81e23]">Total Stores</p>
              <p className="text-2xl font-bold">{stores.length}</p>
            </div>
            <Store className="w-8 h-8 text-[#b81e23]" />
          </CardContent>
        </Card>
        <Card className="bg-green-100 border-none">
          <CardContent className="p-6 flex justify-between text-green-700">
            <div>
              <p className="text-sm">Active Stores</p>
              <p className="text-2xl font-bold">{activeStores}</p>
            </div>
            <Users className="w-8 h-8" />
          </CardContent>
        </Card>
        <Card className="bg-blue-100 border-none">
          <CardContent className="p-6 flex justify-between text-blue-700">
            <div>
              <p className="text-sm">Total Revenue</p>
              <p className="text-2xl font-bold">₹{totalRevenue}</p>
            </div>
            <TrendingUp className="w-8 h-8" />
          </CardContent>
        </Card>
        <Card className="bg-purple-100 border-none">
          <CardContent className="p-6 flex justify-between text-purple-700">
            <div>
              <p className="text-sm">Total Orders</p>
              <p className="text-2xl font-bold">{totalOrders}</p>
            </div>
            <Package className="w-8 h-8" />
          </CardContent>
        </Card>
      </div>

      {/* Search + Filter */}
      <Card className="mb-6">
        <CardContent className="flex flex-wrap gap-4 items-center p-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 text-gray-400" />
            <Input
              placeholder="Search stores..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Type" />
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
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
              <SelectItem value="maintenance">Maintenance</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Store Cards */}
      {loading ? (
        <p className="text-center text-gray-500">Loading stores...</p>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {filteredStores.map((store) => (
            <Card key={store.id}>
              <CardHeader className="flex justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Store className="w-5 h-5 text-[#d8272d]" /> {store.name}
                  </CardTitle>
                  <div className="flex gap-2 mt-2">
                    {getTypeBadge(store.type)}
                    {getStatusBadge(store.status)}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="ghost" onClick={() => handleEdit(store.id!)}>
                    <Edit className="w-4 h-4 text-[#d8272d]" />
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => handleDelete(store.id!)}>
                    <Trash2 className="w-4 h-4 text-red-600" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-700 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-gray-500" /> {store.address}, {store.city}
                </p>
                <p className="text-sm text-gray-700 flex items-center gap-2">
                  <Phone className="w-4 h-4 text-gray-500" /> {store.phone}
                </p>
                <p className="text-sm text-gray-700 flex items-center gap-2">
                  <Mail className="w-4 h-4 text-gray-500" /> {store.email}
                </p>
                <p className="text-sm text-gray-700 flex items-center gap-2">
                  <Users className="w-4 h-4 text-gray-500" /> Manager: {store.manager}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* ✅ Add Store Modal */}
      <Dialog open={openForm} onOpenChange={setOpenForm}>
        <DialogContent className="max-w-lg bg-white text-gray-900 rounded-xl border border-gray-200 shadow-lg">
          <DialogHeader>
            <DialogTitle className="text-center text-xl font-semibold text-gray-900">
              Add New Store
            </DialogTitle>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            {["name", "address", "city", "phone", "email", "manager"].map((field) => (
              <div key={field}>
                <Label className="capitalize text-gray-800 font-medium mb-1 block">
                  {field}
                </Label>
                <Input
                  className="bg-gray-50 border border-gray-300 text-gray-900 focus:border-[#d8272d] focus:ring-[#d8272d]"
                  value={(newStore as any)[field]}
                  onChange={(e) => setNewStore({ ...newStore, [field]: e.target.value })}
                />
              </div>
            ))}

            <div>
              <Label className="text-gray-800 font-medium mb-1 block">Type</Label>
              <Select
                value={newStore.type}
                onValueChange={(v) => setNewStore({ ...newStore, type: v })}
              >
                <SelectTrigger className="bg-gray-50 border-gray-300 text-gray-900">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="grocery">Grocery</SelectItem>
                  <SelectItem value="medical">Medical</SelectItem>
                  <SelectItem value="stationery">Stationery</SelectItem>
                  <SelectItem value="vegetables">Vegetables</SelectItem>
                  <SelectItem value="general">General</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-gray-800 font-medium mb-1 block">Status</Label>
              <Select
                value={newStore.status}
                onValueChange={(v) => setNewStore({ ...newStore, status: v })}
              >
                <SelectTrigger className="bg-gray-50 border-gray-300 text-gray-900">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button
              onClick={handleSaveStore}
              className="bg-gradient-to-r from-[#d8272d] to-[#b81e23] text-white w-full"
            >
              Save Store
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
