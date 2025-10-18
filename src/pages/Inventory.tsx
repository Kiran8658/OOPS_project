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
        <Badge variant="secondary" className="bg-success/10 text-success">
          In Stock
        </Badge>
      );
    case "low-stock":
      return (
        <Badge variant="outline" className="border-warning text-warning">
          Low Stock
        </Badge>
      );
    case "out-of-stock":
      return <Badge variant="destructive">Out of Stock</Badge>;
    case "expiring-soon":
      return (
        <Badge
          variant="outline"
          className="border-destructive text-destructive"
        >
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

  // Fetch inventory from backend
  const fetchInventory = async () => {
    try {
      const response = await axios.get(API_URL);
      console.log("Fetched inventory:", response.data); // ✅ Debug log

      // ✅ Fix: handle both array and object formats safely
      if (Array.isArray(response.data)) {
        setInventory(response.data);
      } else if (Array.isArray(response.data.inventory)) {
        setInventory(response.data.inventory);
      } else {
        console.error("Unexpected response format:", response.data);
        setInventory([]);
      }
    } catch (error) {
      console.error("Error fetching inventory:", error);
      setInventory([]); // ✅ Prevent .filter() crash on error
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

  // ✅ Fix: Ensure inventory is always an array before filtering
  const filteredInventory = Array.isArray(inventory)
    ? inventory.filter((item) => {
        const matchesSearch = item.name
          .toLowerCase()
          .includes(searchTerm.toLowerCase());
        const matchesCategory =
          categoryFilter === "all" || item.category === categoryFilter;
        const matchesStatus =
          statusFilter === "all" || item.status === statusFilter;
        return matchesSearch && matchesCategory && matchesStatus;
      })
    : [];

  const categories = Array.isArray(inventory)
    ? [...new Set(inventory.map((item) => item.category))]
    : [];

  const statuses = Array.isArray(inventory)
    ? [...new Set(inventory.map((item) => item.status))]
    : [];

  const handleAddClick = () => {
    setSearchParams({ add: "true" });
  };

  const handleEditClick = (id: string) => {
    setSearchParams({ edit: id });
  };

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
        setInventory((prev) =>
          prev.map((i) => (i.id === item.id ? response.data : i))
        );
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Inventory Management
          </h1>
          <p className="text-muted-foreground mt-2">
            Manage your stock levels, track expiry dates, and monitor inventory
            status.
          </p>
        </div>
        <Button
          onClick={handleAddClick}
          className="bg-gradient-primary hover:opacity-90 text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add New Item
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search inventory items..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>

            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full md:w-48">
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
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                {statuses.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status
                      .split("-")
                      .map(
                        (word) => word.charAt(0).toUpperCase() + word.slice(1)
                      )
                      .join(" ")}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Inventory Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Package className="w-5 h-5 mr-2 text-primary" />
            Inventory Items ({filteredInventory.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
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
                {filteredInventory.map((item) => (
                  <TableRow key={item.id} className="hover:bg-muted/50">
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{item.category}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        {item.quantity} {item.unit}
                        {item.quantity <= 10 && item.quantity > 0 && (
                          <AlertTriangle className="w-4 h-4 ml-2 text-warning" />
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
                              ? "text-destructive font-medium"
                              : "text-muted-foreground"
                          }
                        >
                          {new Date(item.expiryDate).toLocaleDateString()}
                        </span>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell>{getStatusBadge(item.status)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditClick(item.id)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-destructive hover:text-destructive"
                          onClick={() => handleDeleteClick(item.id)}
                        >
                          <Trash2 className="w-4 h-4" />
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

      {/* ✅ Fixed this section */}
      <InventoryForm
        isOpen={isFormOpen}
        onClose={() => setSearchParams({})}
        onSaved={handleFormSubmit} // ✅ corrected prop name
        initialData={editingItem}
      />
    </div>
  );
}
