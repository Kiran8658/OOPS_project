import { useEffect, useState } from "react";
import { getOrders, addOrder, deleteOrder } from "../api/orderService";
import "./Orders.css";

export default function Orders() {
  const [orders, setOrders] = useState([]);
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
      const data = await getOrders();
      setOrders(Array.isArray(data) ? data : data.orders || []);
    } catch {
      setOrders([]);
    }
  };

  const handleAdd = async () => {
    if (
      !newOrder.customerName ||
      !newOrder.items ||
      !newOrder.totalAmount ||
      !newOrder.paymentMethod ||
      !newOrder.date
    ) {
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
      <span className="status-badge completed">Completed</span>
    ) : (
      <span className="status-badge pending">Pending</span>
    );

  return (
    <div className="orders-container">
      <h2 className="orders-title">📦 Orders Management</h2>
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
            {/* New Order Input Row */}
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
                <input
                  placeholder="Payment"
                  value={newOrder.paymentMethod}
                  onChange={(e) =>
                    setNewOrder({ ...newOrder, paymentMethod: e.target.value })
                  }
                />
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
                  Save
                </button>
              </td>
            </tr>

            {/* Existing Orders */}
            {orders.length > 0 ? (
              orders.map((o) => (
                <tr key={o.id}>
                  <td>{o.orderId || o.id}</td>
                  <td>{o.customerName}</td>
                  <td>{o.items}</td>
                  <td>₹{o.totalAmount}</td>
                  <td>{o.paymentMethod}</td>
                  <td>{o.date}</td>
                  <td>{getStatusBadge(o.status)}</td>
                  <td>
                    <button className="btn-view">👁</button>
                    <button className="btn-download">⬇</button>
                    <button
                      className="btn-delete"
                      onClick={() => handleDelete(o.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="no-data">
                  No orders found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
