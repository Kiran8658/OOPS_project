import { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface InventoryItem {
  id?: string;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  price: number;
  expiryDate?: string;
  status?: "in-stock" | "low-stock" | "out-of-stock" | "expiring-soon";
}

interface InventoryFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved: (item: InventoryItem) => void;
  initialData?: InventoryItem | null;
}

export function InventoryForm({
  isOpen,
  onClose,
  onSaved,
  initialData,
}: Readonly<InventoryFormProps>) {

  // ✅ All hooks must be inside component
  const [formData, setFormData] = useState<InventoryItem>({
    id: "",
    name: "",
    category: "",
    quantity: 0,
    unit: "",
    price: 0,
    expiryDate: undefined,
    status: "in-stock",
  });

  // ✅ Categories and units defined inside component (safe scope)
  const categories = ["Groceries", "Medicines", "Vegetables", "Stationery"];
  const units = ["kg", "tablets", "pieces", "liters"];

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({
        id: "",
        name: "",
        category: "",
        quantity: 0,
        unit: "",
        price: 0,
        expiryDate: undefined,
        status: "in-stock",
      });
    }
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.name.trim()) return alert("Please enter item name");
    if (!formData.category) return alert("Please select a category");
    if (formData.quantity < 0) return alert("Quantity cannot be negative");
    if (!formData.unit) return alert("Please select a unit");
    if (formData.price < 0) return alert("Price cannot be negative");

    // Determine status dynamically
    let status: InventoryItem["status"] = "in-stock";
    if (formData.quantity === 0) status = "out-of-stock";
    else if (formData.quantity <= 10) status = "low-stock";

    if (formData.expiryDate) {
      const expiry = new Date(formData.expiryDate);
      const now = new Date();
      const diffDays = (expiry.getTime() - now.getTime()) / (1000 * 3600 * 24);
      if (diffDays <= 30) status = "expiring-soon";
    }

    // ✅ Match backend JSON structure
    const payload = {
      name: formData.name,
      category: formData.category,
      quantity: formData.quantity,
      unit: formData.unit,
      price: formData.price,
      expiryDate: formData.expiryDate || null,
      status: status,
    };

    try {
      let response;
      if (formData.id) {
        // Update existing item
        response = await axios.put(
          `http://localhost:8080/api/inventory/${formData.id}`,
          payload
        );
      } else {
        // Add new item
        response = await axios.post(
          "http://localhost:8080/api/inventory",
          payload
        );
      }

      onSaved(response.data);
      onClose();
    } catch (error: any) {
      console.error("❌ Failed to save inventory item:", error);
      if (error.response) {
        alert(
          `Error ${error.response.status}: ${
            error.response.data?.message || "Check backend logs"
          }`
        );
      } else {
        alert("Network or server error while saving inventory item.");
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {formData.id ? "Edit Inventory Item" : "Add New Inventory Item"}
          </DialogTitle>
          <DialogDescription>
            Fill in the details of the inventory item.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="name">Item Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, name: e.target.value }))
              }
              placeholder="Enter item name"
              required
            />
          </div>

          <div>
            <Label htmlFor="category">Category *</Label>
            <Select
              value={formData.category}
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, category: value }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="quantity">Quantity *</Label>
            <Input
              id="quantity"
              type="number"
              min="0"
              value={formData.quantity}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  quantity: parseInt(e.target.value) || 0,
                }))
              }
              required
            />
          </div>

          <div>
            <Label htmlFor="unit">Unit *</Label>
            <Select
              value={formData.unit}
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, unit: value }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select unit" />
              </SelectTrigger>
              <SelectContent>
                {units.map((unit) => (
                  <SelectItem key={unit} value={unit}>
                    {unit}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="price">Price per Unit (₹) *</Label>
            <Input
              id="price"
              type="number"
              min="0"
              step="0.01"
              value={formData.price}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  price: parseFloat(e.target.value) || 0,
                }))
              }
              required
            />
          </div>

          <div>
            <Label htmlFor="expiryDate">Expiry Date</Label>
            <Input
              id="expiryDate"
              type="date"
              value={formData.expiryDate || ""}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  expiryDate: e.target.value || undefined,
                }))
              }
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-gradient-primary hover:opacity-90"
            >
              {formData.id ? "Update Item" : "Add Item"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
