import { useEffect, useState } from "react";
import { getOrders, addOrder, deleteOrder } from "../api/orderService";
import axios from "axios";
import { Download, Eye, Trash2, PlusCircle, RefreshCcw } from "lucide-react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api";

export default function Orders() {
  const [orders, setOrders] = useState<any[]>([]);
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
      const payload = {
        customerName: newOrder.customerName,
        items: newOrder.items,
        totalAmount: parseFloat(newOrder.totalAmount),
        paymentMethod: newOrder.paymentMethod,
        status: newOrder.status,
        date: newOrder.date, // ✅ fixed field name
      };

      const saved = await addOrder(payload);
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
    } catch (error: any) {
      alert("Failed to add order: " + (error?.message || "Unknown error"));
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this order?")) return;
    try {
      await deleteOrder(id);
      setOrders(orders.filter((o) => o.id !== id));
      alert("Order deleted successfully");
    } catch {
      alert("Failed to delete order.");
    }
  };

  // 👁 View details (for now, simple alert)
  const handleView = (order: any) => {
    alert(
      `Order Details:\n\nCustomer: ${order.customerName}\nItems: ${order.items}\nAmount: ₹${order.totalAmount}\nPayment: ${order.paymentMethod}\nStatus: ${order.status}\nDate: ${new Date(order.date).toLocaleDateString("en-IN")}`
    );
  };

  // ⬇ Download invoice
  const handleDownload = async (id: number) => {
    try {
      const res = await axios.get(`${API_BASE_URL}/orders/${id}/invoice`, {
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `order_${id}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      alert("Failed to download invoice");
    }
  };

  const getStatusBadge = (status: string) =>
    status === "Completed" ? (
      <span className="status-badge completed">✔ Completed</span>
    ) : (
      <span className="status-badge pending">⏳ Pending</span>
    );

  return (
    <div className="orders-page">
      {/* ---------- HEADER ---------- */}
      <div className="orders-header">
        <div>
          <h2 className="orders-title">
            <span className="icon">📦</span> Orders Management
          </h2>
          <p className="orders-subtitle">
            Manage and track customer orders efficiently.
          </p>
        </div>
        <div className="orders-actions">
          <button className="btn-refresh" onClick={loadOrders}>
            <RefreshCcw size={18} /> Refresh
          </button>
        </div>
      </div>

      {/* ---------- TABLE ---------- */}
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
            {/* ---------- NEW ORDER INPUT ROW ---------- */}
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
                  type="text"
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

            {/* ---------- EXISTING ORDERS ---------- */}
            {loading ? (
              <tr>
                <td colSpan={8} className="no-data">
                  Loading orders...
                </td>
              </tr>
            ) : orders.length > 0 ? (
              orders.map((o) => (
                <tr key={o.id}>
                  <td>{o.id}</td>
                  <td>{o.customerName}</td>
                  <td>{o.items || "—"}</td>
                  <td>₹{o.totalAmount}</td>
                  <td>{o.paymentMethod || "—"}</td>
                  <td>
                    {o.date
                      ? new Date(o.date).toLocaleDateString("en-IN")
                      : "—"}
                  </td>
                  <td>{getStatusBadge(o.status)}</td>
                  <td className="actions">
                    <button
                      className="btn-icon view"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleView(o);
                      }}
                    >
                      <Eye size={16} />
                    </button>
                    <button
                      className="btn-icon download"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDownload(o.id);
                      }}
                    >
                      <Download size={16} />
                    </button>
                    <button
                      className="btn-icon delete"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(o.id);
                      }}
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={8} className="no-data">
                  No orders found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ---------- STYLES ---------- */}
      <style jsx>{`
        .orders-page {
          padding: 2rem;
          background: linear-gradient(to bottom right, #fef5f1, #fff8f6);
          min-height: 100vh;
          font-family: "Inter", sans-serif;
          color: #1f1f1f;
        }

        .orders-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
        }

        .orders-title {
          font-size: 2rem;
          font-weight: 800;
          color: #b91c1c;
          display: flex;
          align-items: center;
          gap: 0.4rem;
        }

        .orders-subtitle {
          color: #6b6b6b;
        }

        .btn-refresh {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          background: #b91c1c;
          color: #fff;
          border: none;
          padding: 0.6rem 1rem;
          border-radius: 0.5rem;
          font-weight: 600;
          cursor: pointer;
          transition: 0.2s;
        }
        .btn-refresh:hover {
          background: #991b1b;
        }

        .orders-table-wrapper {
          background: #fff;
          border-radius: 1rem;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);
          overflow-x: auto;
        }

        table {
          width: 100%;
          border-collapse: collapse;
        }

        th,
        td {
          padding: 0.9rem;
          text-align: left;
          border-bottom: 1px solid #f1dada;
          color: #1f1f1f;
        }

        th {
          background: #fff5f5;
          font-weight: 700;
          color: #b91c1c;
        }

        tr:hover {
          background: #fff2f1;
        }

        input,
        select {
          width: 100%;
          padding: 0.4rem 0.6rem;
          border: 1px solid #e6e6e6;
          border-radius: 0.4rem;
          background: #ffffff;
          color: #1f1f1f;
        }

        input:focus,
        select:focus {
          border-color: #b91c1c;
          box-shadow: 0 0 0 2px rgba(185, 28, 28, 0.2);
        }

        .btn-save {
          background: #b91c1c;
          color: #fff;
          border: none;
          padding: 0.4rem 0.8rem;
          border-radius: 0.5rem;
          font-weight: 600;
          cursor: pointer;
          transition: 0.2s;
        }
        .btn-save:hover:not(:disabled) {
          background: #991b1b;
        }

        .status-badge {
          padding: 0.3rem 0.7rem;
          border-radius: 0.4rem;
          font-weight: 600;
          font-size: 0.85rem;
        }

        .completed {
          background: rgba(16, 185, 129, 0.15);
          color: #059669;
        }

        .pending {
          background: rgba(234, 179, 8, 0.15);
          color: #b45309;
        }

        .actions {
          display: flex;
          gap: 0.4rem;
        }

        .btn-icon {
          background: #f3f4f6;
          border: none;
          border-radius: 0.4rem;
          padding: 0.4rem;
          cursor: pointer;
        }

        .btn-icon.view:hover {
          background: #ffe4e2;
        }
        .btn-icon.download:hover {
          background: #fff2c7;
        }
        .btn-icon.delete:hover {
          background: #fca5a5;
        }

        .no-data {
          text-align: center;
          padding: 1rem;
          color: #6b6b6b;
        }
      `}</style>
    </div>
  );
}
