import { useEffect, useState } from "react";
import { getOrders, addOrder, deleteOrder } from "../api/orderService";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [newOrder, setNewOrder] = useState({
    customerName: "",
    items: "",
    totalAmount: "",
    paymentMethod: "",
    date: "",
    status: "Pending"
  });

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const data = await getOrders();
      setOrders(Array.isArray(data) ? data : (data.orders || []));
    } catch {
      setOrders([]);
    }
  };

  const handleAdd = async () => {
    if (!newOrder.customerName || !newOrder.items || !newOrder.totalAmount || !newOrder.paymentMethod || !newOrder.date) {
      alert("Please fill all fields");
      return;
    }
    try {
      const saved = await addOrder(newOrder);
      setNewOrder({ customerName: "", items: "", totalAmount: "", paymentMethod: "", date: "", status: "Pending" });
      if (saved && saved.id) setOrders([...orders, saved]);
      else loadOrders();
    } catch (error) {
      alert("Failed to add order: " + (error?.message || "Unknown error"));
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteOrder(id);
      setOrders(orders.filter(o => o.id !== id));
    } catch {
      alert("Failed to delete order.");
    }
  };

  const getStatusBadge = (status) =>
    status === "Completed"
      ? <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs">Completed</span>
      : <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs">Pending</span>;

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Orders</h2>
      <table className="w-full border-collapse border">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">Order ID</th>
            <th className="border p-2">Customer</th>
            <th className="border p-2">Items</th>
            <th className="border p-2">Total</th>
            <th className="border p-2">Payment</th>
            <th className="border p-2">Date</th>
            <th className="border p-2">Status</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {/* Row for new entry */}
          <tr>
            <td className="border p-2 text-gray-400">Auto</td>
            <td className="border p-2">
              <input
                className="border p-2"
                placeholder="Customer Name"
                value={newOrder.customerName}
                onChange={e => setNewOrder({ ...newOrder, customerName: e.target.value })}
              />
            </td>
            <td className="border p-2">
              <input
                className="border p-2"
                type="number"
                placeholder="No. of items"
                value={newOrder.items}
                onChange={e => setNewOrder({ ...newOrder, items: e.target.value })}
              />
            </td>
            <td className="border p-2">
              <input
                className="border p-2"
                type="number"
                placeholder="Amount"
                value={newOrder.totalAmount}
                onChange={e => setNewOrder({ ...newOrder, totalAmount: e.target.value })}
              />
            </td>
            <td className="border p-2">
              <input
                className="border p-2"
                placeholder="Payment"
                value={newOrder.paymentMethod}
                onChange={e => setNewOrder({ ...newOrder, paymentMethod: e.target.value })}
              />
            </td>
            <td className="border p-2">
              <input
                className="border p-2"
                type="date"
                value={newOrder.date}
                onChange={e => setNewOrder({ ...newOrder, date: e.target.value })}
              />
            </td>
            <td className="border p-2">
              <select
                className="border p-2"
                value={newOrder.status}
                onChange={e => setNewOrder({ ...newOrder, status: e.target.value })}
              >
                <option value="Pending">Pending</option>
                <option value="Completed">Completed</option>
              </select>
            </td>
            <td className="border p-2">
              <button
                className={`px-4 py-2 rounded text-white ${
                  (!newOrder.customerName || !newOrder.items || !newOrder.totalAmount || !newOrder.paymentMethod || !newOrder.date)
                    ? "bg-gray-300 cursor-not-allowed"
                    : "bg-green-600 hover:bg-green-700"
                }`}
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
          {/* Render Existing Orders */}
          {orders.length > 0 ? (
            orders.map(o => (
              <tr key={o.id}>
                <td className="border p-2">{o.orderId || o.id}</td>
                <td className="border p-2">{o.customerName}</td>
                <td className="border p-2">{o.items}</td>
                <td className="border p-2">₹{o.totalAmount}</td>
                <td className="border p-2">{o.paymentMethod}</td>
                <td className="border p-2">{o.date}</td>
                <td className="border p-2">{getStatusBadge(o.status)}</td>
                <td className="border p-2 flex gap-2">
                  <button className="text-sky-600 hover:underline" title="View">
                    <span role="img" aria-label="View">&#128065;</span>
                  </button>
                  <button className="text-gray-600" title="Download">
                    <span role="img" aria-label="Download">&#128229;</span>
                  </button>
                  <button
                    className="bg-red-600 text-white px-3 py-1 rounded"
                    onClick={() => handleDelete(o.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="8" className="border p-2 text-center text-gray-500">No orders found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
