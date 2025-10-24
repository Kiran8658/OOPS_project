import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
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
  TableRow,
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
  Edit,
  Trash2,
  AlertTriangle,
  Package,
} from "lucide-react";
import { InventoryForm } from "@/components/InventoryForm";

interface InventoryItem {
  id: string;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  price: number;
  expiryDate?: string;
  status: "in-stock" | "low-stock" | "out-of-stock" | "expiring-soon";
}

const getStatusBadge = (status: string) => {
  switch (status) {
    case "in-stock":
      return (
        <Badge variant="secondary" className="bg-green-100 text-green-700 border-green-600">
          In Stock
        </Badge>
      );
    case "low-stock":
      return (
        <Badge variant="outline" className="border-yellow-400 text-yellow-500">
          Low Stock
        </Badge>
      );
    case "out-of-stock":
      return (
        <Badge variant="destructive" className="bg-[#ffe5e5] text-[#b81e23] border-[#d8272d]">
          Out of Stock
        </Badge>
      );
    case "expiring-soon":
      return (
        <Badge variant="outline" className="border-orange-400 text-orange-600">
          Expiring Soon
        </Badge>
      );
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

export default function Inventory() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);

  const API_URL = "http://localhost:8080/api/inventory";

  const fetchInventory = async () => {
    try {
      const response = await axios.get(API_URL);
      if (Array.isArray(response.data)) setInventory(response.data);
      else if (Array.isArray(response.data.inventory))
        setInventory(response.data.inventory);
      else setInventory([]);
    } catch (error) {
      console.error("Error fetching inventory:", error);
      setInventory([]);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  useEffect(() => {
    const add = searchParams.get("add");
    const edit = searchParams.get("edit");
    if (add === "true") {
      setIsFormOpen(true);
      setEditingItem(null);
    } else if (edit) {
      const itemToEdit = inventory.find((item) => item.id === edit);
      if (itemToEdit) {
        setEditingItem(itemToEdit);
        setIsFormOpen(true);
      }
    } else {
      setIsFormOpen(false);
      setEditingItem(null);
    }
  }, [searchParams, inventory]);

  const filteredInventory = inventory.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "all" || item.category === categoryFilter;
    const matchesStatus = statusFilter === "all" || item.status === statusFilter;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const categories = [...new Set(inventory.map((item) => item.category))];
  const statuses = [...new Set(inventory.map((item) => item.status))];

  const handleAddClick = () => setSearchParams({ add: "true" });
  const handleEditClick = (id: string) => setSearchParams({ edit: id });
  const handleDeleteClick = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      try {
        await axios.delete(`${API_URL}/${id}`);
        setInventory((prev) => prev.filter((item) => item.id !== id));
      } catch (error) {
        console.error("Error deleting item:", error);
      }
    }
  };

  const handleFormSubmit = async (item: InventoryItem) => {
    try {
      if (item.id) {
        const response = await axios.put(`${API_URL}/${item.id}`, item);
        setInventory((prev) => prev.map((i) => (i.id === item.id ? response.data : i)));
      } else {
        const response = await axios.post(API_URL, item);
        setInventory((prev) => [...prev, response.data]);
      }
      setSearchParams({});
    } catch (error) {
      console.error("Error saving item:", error);
    }
  };

  return (
    <div className="space-y-8 text-gray-800 bg-gradient-to-br from-[#fef5f1] via-[#fff8f6] to-[#fef5f1] p-6 rounded-xl shadow-sm">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#d8272d]">Inventory Management</h1>
          <p className="text-gray-600 mt-2">
            Manage your stock levels, track expiry dates, and monitor inventory status.
          </p>
        </div>
        <Button
          onClick={handleAddClick}
          className="bg-[#d8272d] hover:bg-[#b81e23] text-white shadow-lg mt-4 md:mt-0 px-5 py-2 rounded-lg"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add New Item
        </Button>
      </div>

      {/* Filters */}
      <Card className="border border-gray-200 bg-white shadow-lg rounded-2xl">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search inventory items..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 border-gray-300 rounded-lg"
              />
            </div>

            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full md:w-48 border-gray-300 rounded-lg">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48 border-gray-300 rounded-lg">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                {statuses.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status
                      .split("-")
                      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                      .join(" ")}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Inventory Table */}
      <Card className="border border-gray-200 bg-white shadow-xl rounded-2xl">
        <CardHeader>
          <CardTitle className="flex items-center text-[#d8272d]">
            <Package className="w-5 h-5 mr-2 text-[#d8272d]" />
            Inventory Items ({filteredInventory.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-xl border border-gray-200 overflow-x-auto">
            <Table>
              <TableHeader className="bg-[#fdf2f2]">
                <TableRow>
                  <TableHead>Item Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Price per Unit</TableHead>
                  <TableHead>Expiry Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInventory.length > 0 ? (
                  filteredInventory.map((item) => (
                    <TableRow key={item.id} className="hover:bg-[#fff3f3] transition-all">
                      <TableCell className="font-medium">{item.name}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-gray-700 border-gray-300">
                          {item.category}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          {item.quantity} {item.unit}
                          {item.quantity <= 10 && item.quantity > 0 && (
                            <AlertTriangle className="w-4 h-4 ml-2 text-yellow-500" />
                          )}
                        </div>
                      </TableCell>
                      <TableCell>₹{item.price}</TableCell>
                      <TableCell>
                        {item.expiryDate ? (
                          <span
                            className={
                              new Date(item.expiryDate) <
                              new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
                                ? "text-[#b81e23] font-medium"
                                : "text-gray-600"
                            }
                          >
                            {new Date(item.expiryDate).toLocaleDateString()}
                          </span>
                        ) : (
                          <span className="text-gray-500">-</span>
                        )}
                      </TableCell>
                      <TableCell>{getStatusBadge(item.status)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditClick(item.id)}
                            className="text-[#d8272d] hover:text-[#b81e23]"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-[#b81e23] hover:text-[#d8272d]"
                            onClick={() => handleDeleteClick(item.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                      No inventory items found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Inventory Form */}
      <InventoryForm
        isOpen={isFormOpen}
        onClose={() => setSearchParams({})}
        onSaved={handleFormSubmit}
        initialData={editingItem}
      />
    </div>
  );
}
