import { useEffect, useState } from "react";
import { getOrders, addOrder, deleteOrder } from "../api/orderService";
import { Download, Eye, Trash2, PlusCircle, RefreshCcw } from "lucide-react";
import "./Orders.css";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newOrder, setNewOrder] = useState({
    customerName: "",
    items: "",
    totalAmount: "",
    paymentMethod: "",
    date: "",
    status: "Pending",
  });

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const data = await getOrders();
      setOrders(Array.isArray(data) ? data : data.orders || []);
    } catch {
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async () => {
    if (!newOrder.customerName || !newOrder.items || !newOrder.totalAmount || !newOrder.paymentMethod || !newOrder.date) {
      alert("Please fill all fields");
      return;
    }
    try {
      const saved = await addOrder(newOrder);
      setNewOrder({
        customerName: "",
        items: "",
        totalAmount: "",
        paymentMethod: "",
        date: "",
        status: "Pending",
      });
      if (saved && saved.id) setOrders([...orders, saved]);
      else loadOrders();
    } catch (error) {
      alert("Failed to add order: " + (error?.message || "Unknown error"));
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteOrder(id);
      setOrders(orders.filter((o) => o.id !== id));
    } catch {
      alert("Failed to delete order.");
    }
  };

  const getStatusBadge = (status) =>
    status === "Completed" ? (
      <span className="status-badge completed">✔ Completed</span>
    ) : (
      <span className="status-badge pending">⏳ Pending</span>
    );

  return (
    <div className="orders-page">
      <div className="orders-header">
        <div>
          <h2 className="orders-title">📦 Orders Management</h2>
          <p className="orders-subtitle">Manage and track customer orders efficiently.</p>
        </div>
        <div className="orders-actions">
          <button className="btn-refresh" onClick={loadOrders}>
            <RefreshCcw size={18} /> Refresh
          </button>
        </div>
      </div>

      <div className="orders-table-wrapper">
        <table className="orders-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Customer</th>
              <th>Items</th>
              <th>Total</th>
              <th>Payment</th>
              <th>Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            <tr className="new-row">
              <td className="muted">Auto</td>
              <td>
                <input
                  placeholder="Customer Name"
                  value={newOrder.customerName}
                  onChange={(e) =>
                    setNewOrder({ ...newOrder, customerName: e.target.value })
                  }
                />
              </td>
              <td>
                <input
                  type="number"
                  placeholder="Items"
                  value={newOrder.items}
                  onChange={(e) =>
                    setNewOrder({ ...newOrder, items: e.target.value })
                  }
                />
              </td>
              <td>
                <input
                  type="number"
                  placeholder="Amount"
                  value={newOrder.totalAmount}
                  onChange={(e) =>
                    setNewOrder({ ...newOrder, totalAmount: e.target.value })
                  }
                />
              </td>
              <td>
                <select
                  value={newOrder.paymentMethod}
                  onChange={(e) =>
                    setNewOrder({ ...newOrder, paymentMethod: e.target.value })
                  }
                >
                  <option value="">Select</option>
                  <option value="Cash">Cash</option>
                  <option value="Card">Card</option>
                  <option value="UPI">UPI</option>
                </select>
              </td>
              <td>
                <input
                  type="date"
                  value={newOrder.date}
                  onChange={(e) =>
                    setNewOrder({ ...newOrder, date: e.target.value })
                  }
                />
              </td>
              <td>
                <select
                  value={newOrder.status}
                  onChange={(e) =>
                    setNewOrder({ ...newOrder, status: e.target.value })
                  }
                >
                  <option value="Pending">Pending</option>
                  <option value="Completed">Completed</option>
                </select>
              </td>
              <td>
                <button
                  className="btn-save"
                  onClick={handleAdd}
                  disabled={
                    !newOrder.customerName ||
                    !newOrder.items ||
                    !newOrder.totalAmount ||
                    !newOrder.paymentMethod ||
                    !newOrder.date
                  }
                >
                  <PlusCircle size={16} /> Add
                </button>
              </td>
            </tr>

            {loading ? (
              <tr>
                <td colSpan="8" className="no-data">Loading orders...</td>
              </tr>
            ) : orders.length > 0 ? (
              orders.map((o) => (
                <tr key={o.id}>
                  <td>{o.orderId || o.id}</td>
                  <td>{o.customerName}</td>
                  <td>{o.items}</td>
                  <td>₹{o.totalAmount}</td>
                  <td>{o.paymentMethod}</td>
                  <td>{o.date}</td>
                  <td>{getStatusBadge(o.status)}</td>
                  <td className="actions">
                    <button className="btn-icon view"><Eye size={16} /></button>
                    <button className="btn-icon download"><Download size={16} /></button>
                    <button className="btn-icon delete" onClick={() => handleDelete(o.id)}>
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="no-data">No orders found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
