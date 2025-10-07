import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchProducts } from "@/lib/api"; // <-- your backend API fetch
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

export interface InventoryItem {
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
        <Badge variant="secondary" className="bg-green-100 text-green-700">
          In Stock
        </Badge>
      );
    case "low-stock":
      return (
        <Badge variant="outline" className="border-yellow-500 text-yellow-600">
          Low Stock
        </Badge>
      );
    case "out-of-stock":
      return <Badge variant="destructive">Out of Stock</Badge>;
    case "expiring-soon":
      return (
        <Badge variant="outline" className="border-red-500 text-red-600">
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
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);

  const queryClient = useQueryClient();

  // Fetch inventory from backend
  const {
    data: inventory = [],
    isLoading,
    isError,
  } = useQuery<InventoryItem[]>({
    queryKey: ["products"],
    queryFn: fetchProducts,
    staleTime: 1000 * 10,
    refetchOnWindowFocus: false,
  });

  // Handle URL param form open/close
  useEffect(() => {
    const add = searchParams.get("add");
    const edit = searchParams.get("edit");

    if (add === "true") {
      setIsFormOpen(true);
      setEditingItem(null);
    } else if (edit && inventory.length > 0) {
      const itemToEdit = inventory.find((i) => i.id === edit);
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
    const matchesSearch = item.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory =
      categoryFilter === "all" || item.category === categoryFilter;
    const matchesStatus = statusFilter === "all" || item.status === statusFilter;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const categories = Array.from(new Set(inventory.map((i) => i.category)));
  const statuses = Array.from(new Set(inventory.map((i) => i.status)));

  const handleAddClick = () => {
    setSearchParams({ add: "true" });
  };

  const handleEditClick = (id: string) => {
    setSearchParams({ edit: id });
  };

  // Delete Product
  const handleDeleteClick = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;

    try {
      const res = await fetch(`http://localhost:8080/api/products/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete item");

      await queryClient.invalidateQueries({ queryKey: ["products"] });
      setSearchParams({});
    } catch (err) {
      console.error("Error deleting item:", err);
      alert("Failed to delete item.");
    }
  };

  // Add or Update Product
  const handleFormSubmit = async (item: InventoryItem) => {
    try {
      const isEdit = !!item.id;
      const url = isEdit
        ? `http://localhost:8080/api/products/${item.id}`
        : `http://localhost:8080/api/products`;

      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(item),
      });

      if (!res.ok) throw new Error("Request failed");

      await queryClient.invalidateQueries({ queryKey: ["products"] });
      setSearchParams({});
      setIsFormOpen(false);
    } catch (error) {
      console.error("Error saving item:", error);
      alert("Error saving item. Check console for details.");
    }
  };

  if (isLoading) return <p>Loading inventory...</p>;
  if (isError) return <p>Error loading inventory.</p>;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-blue-500 bg-clip-text text-transparent">
            Inventory Management
          </h1>
          <p className="text-muted-foreground mt-2">
            Manage your stock levels, track expiry dates, and monitor inventory
            status.
          </p>
        </div>
        <Button
          onClick={handleAddClick}
          className="bg-gradient-to-r from-primary to-blue-500 text-white"
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
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search inventory items..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>

            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                {statuses.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s
                      .split("-")
                      .map((w) => w[0].toUpperCase() + w.slice(1))
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
                  <TableHead>Price</TableHead>
                  <TableHead>Expiry</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInventory.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{item.category}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        {item.quantity} {item.unit}
                        {item.quantity <= 10 && item.quantity > 0 && (
                          <AlertTriangle className="w-4 h-4 ml-2 text-yellow-600" />
                        )}
                      </div>
                    </TableCell>
                    <TableCell>₹{item.price}</TableCell>
                    <TableCell>
                      {item.expiryDate
                        ? new Date(item.expiryDate).toLocaleDateString()
                        : "-"}
                    </TableCell>
                    <TableCell>{getStatusBadge(item.status)}</TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditClick(item.id!)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-600"
                        onClick={() => handleDeleteClick(item.id!)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Add/Edit Form */}
      <InventoryForm
        isOpen={isFormOpen}
        onClose={() => setSearchParams({})}
        onSubmit={handleFormSubmit}
        initialData={editingItem}
      />
    </div>
  );
}

!