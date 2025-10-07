import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Plus, Minus } from "lucide-react";

interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

interface OrderFormData {
  customerName: string;
  items: OrderItem[];
  paymentMethod: string;
  notes: string;
}

interface Order {
  id: string;
  customerName: string;
  items: number;
  total: number;
  status: "pending" | "processing" | "completed" | "cancelled";
  date: string;
  paymentMethod: string;
}

interface OrderFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (orderData: OrderFormData) => void;
  isEdit?: boolean;
  isView?: boolean;
  orderToEdit?: Order | null;
}

export function OrderForm({ isOpen, onClose, onSubmit, isEdit = false, isView = false, orderToEdit }: OrderFormProps) {
  const [formData, setFormData] = useState<OrderFormData>({
    customerName: "",
    items: [{ id: "1", name: "", quantity: 1, price: 0 }],
    paymentMethod: "",
    notes: "",
  });

  useEffect(() => {
    if (isOpen) {
      if (isEdit && orderToEdit) {
        // Pre-fill form for editing
        setFormData({
          customerName: orderToEdit.customerName,
          items: [], // Note: Since orderToEdit.items is a number, we can't pre-fill detailed items. In a real app, you'd have detailed item data.
          paymentMethod: orderToEdit.paymentMethod,
          notes: "",
        });
      } else {
        // Reset for new order
        setFormData({
          customerName: "",
          items: [{ id: "1", name: "", quantity: 1, price: 0 }],
          paymentMethod: "",
          notes: "",
        });
      }
    }
  }, [isOpen, isEdit, orderToEdit]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (!formData.customerName.trim()) {
      alert("Please enter customer name");
      return;
    }

    if (formData.items.some(item => !item.name.trim() || item.quantity <= 0 || item.price <= 0)) {
      alert("Please fill in all item details with valid values");
      return;
    }

    if (!formData.paymentMethod) {
      alert("Please select a payment method");
      return;
    }

    onSubmit(formData);

    // Reset form
    setFormData({
      customerName: "",
      items: [{ id: "1", name: "", quantity: 1, price: 0 }],
      paymentMethod: "",
      notes: "",
    });

    onClose();
  };

  const addItem = () => {
    const newItem: OrderItem = {
      id: (formData.items.length + 1).toString(),
      name: "",
      quantity: 1,
      price: 0,
    };
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, newItem],
    }));
  };

  const removeItem = (id: string) => {
    if (formData.items.length > 1) {
      setFormData(prev => ({
        ...prev,
        items: prev.items.filter(item => item.id !== id),
      }));
    }
  };

  const updateItem = (id: string, field: keyof OrderItem, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.map(item =>
        item.id === id ? { ...item, [field]: value } : item
      ),
    }));
  };

  const calculateTotal = () => {
    return formData.items.reduce((total, item) => total + (item.quantity * item.price), 0);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isView ? "View Order" : isEdit ? "Edit Order" : "Create New Order"}
          </DialogTitle>
          <DialogDescription>
            {isView
              ? "Review the order details below."
              : isEdit
              ? "Update the order details below."
              : "Enter the order details below. Add multiple items if needed."
            }
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Customer Information */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="customerName">Customer Name *</Label>
              <Input
                id="customerName"
                value={formData.customerName}
                onChange={(e) => setFormData(prev => ({ ...prev, customerName: e.target.value }))}
                placeholder="Enter customer name"
                required
              />
            </div>

            <div>
              <Label htmlFor="paymentMethod">Payment Method *</Label>
              <Select
                value={formData.paymentMethod}
                onValueChange={(value) => setFormData(prev => ({ ...prev, paymentMethod: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select payment method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Cash">Cash</SelectItem>
                  <SelectItem value="Card">Card</SelectItem>
                  <SelectItem value="UPI">UPI</SelectItem>
                  <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Order Items */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Order Items *</Label>
              <Button type="button" variant="outline" size="sm" onClick={addItem}>
                <Plus className="w-4 h-4 mr-2" />
                Add Item
              </Button>
            </div>

            {formData.items.map((item, index) => (
              <div key={item.id} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">Item {index + 1}</h4>
                  {formData.items.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeItem(item.id)}
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <Label htmlFor={`item-name-${item.id}`}>Item Name</Label>
                    <Input
                      id={`item-name-${item.id}`}
                      value={item.name}
                      onChange={(e) => updateItem(item.id, "name", e.target.value)}
                      placeholder="Enter item name"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor={`item-quantity-${item.id}`}>Quantity</Label>
                    <Input
                      id={`item-quantity-${item.id}`}
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => updateItem(item.id, "quantity", parseInt(e.target.value) || 1)}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor={`item-price-${item.id}`}>Price (₹)</Label>
                    <Input
                      id={`item-price-${item.id}`}
                      type="number"
                      min="0"
                      step="0.01"
                      value={item.price}
                      onChange={(e) => updateItem(item.id, "price", parseFloat(e.target.value) || 0)}
                      placeholder="0.00"
                      required
                    />
                  </div>
                </div>

                <div className="text-sm text-muted-foreground">
                  Subtotal: ₹{(item.quantity * item.price).toFixed(2)}
                </div>
              </div>
            ))}

            <div className="text-right font-semibold">
              Total: ₹{calculateTotal().toFixed(2)}
            </div>
          </div>

          {/* Notes */}
          <div>
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="Add any special notes or instructions..."
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" className="bg-gradient-primary hover:opacity-90">
              {isEdit ? "Update Order" : "Create Order"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
