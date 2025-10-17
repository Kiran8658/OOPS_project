import axios from "axios";

// ✅ Use your .env base URL or default to Spring Boot localhost
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8080/api",
});

// ✅ Get all orders
export const getOrders = async () => {
  const response = await API.get("/orders");
  return response.data;
};

// ✅ Add a new order
export const addOrder = async (order) => {
  try {
    const response = await API.post("/orders", order);
    return response.data;
  } catch (error) {
    console.error("Error adding order:", error);
    throw error;
  }
};

// ✅ Delete order by ID
export const deleteOrder = async (id) => {
  try {
    await API.delete(`/orders/${id}`);
  } catch (error) {
    console.error("Error deleting order:", error);
    throw error;
  }
};
