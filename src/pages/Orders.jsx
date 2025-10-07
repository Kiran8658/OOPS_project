import { useEffect, useState } from "react";
import { getOrders, addOrder, deleteOrder } from "../api/orderService";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [newOrder, setNewOrder] = useState({
    customerName: "",
    totalAmount: "",
    status: "Pending",
  });

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const data = await getOrders();
      if (Array.isArray(data)) setOrders(data);
      else if (data.orders && Array.isArray(data.orders)) setOrders(data.orders);
      else setOrders([]);
    } catch {
      setOrders([]);
    }
  };

  const handleAdd = async () => {
    if (!newOrder.customerName || !newOrder.totalAmount) {
      alert("Please fill all fields");
      return;
    }
    try {
      const saved = await addOrder(newOrder);
      setNewOrder({ customerName: "", totalAmount: "", status: "Pending" });
      if (saved && saved.id) {
        setOrders([...orders, saved]);
      } else {
        loadOrders();
      }
    } catch (error) {
      console.error("Failed to add order:", error);
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

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Orders</h2>
      <table className="w-full border-collapse border">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">ID</th>
            <th className="border p-2">Customer</th>
            <th className="border p-2">Amount</th>
            <th className="border p-2">Status</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
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
      placeholder="Amount"
      value={newOrder.totalAmount}
      onChange={e => setNewOrder({ ...newOrder, totalAmount: e.target.value })}
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
        (!newOrder.customerName || !newOrder.totalAmount)
          ? "bg-gray-300 cursor-not-allowed"
          : "bg-green-600 hover:bg-green-700"
      }`}
      onClick={handleAdd}
      disabled={!newOrder.customerName || !newOrder.totalAmount}
    >
      Save
    </button>
  </td>
</tr>
          {/* Use the entry row from step 1 */}
          {/* Render Existing Orders */}
          {orders.length > 0 ? (
            orders.map(o => (
              <tr key={o.id}>
                <td className="border p-2">{o.id}</td>
                <td className="border p-2">{o.customerName}</td>
                <td className="border p-2">₹{o.totalAmount}</td>
                <td className="border p-2">{o.status}</td>
                <td className="border p-2">
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
              <td colSpan="5" className="border p-2 text-center text-gray-500">No orders found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
