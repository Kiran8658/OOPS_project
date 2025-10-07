import axios, {
  AxiosError,
  InternalAxiosRequestConfig, // ✅ use this instead of AxiosRequestConfig
} from "axios";


const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8080/api",
  headers: { "Content-Type": "application/json" },
});
API.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem("token");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

// ---------------------------
// PRODUCT API
// ---------------------------
export const fetchProducts = async () => {
  const response = await API.get("/products");
  return response.data;
};
export const fetchProductById = async (id: string) => {
  const response = await API.get(`/products/${id}`);
  return response.data;
};

export const addProduct = async (product: any) => {
  const response = await API.post("/products", product);
  return response.data;
};

export const updateProduct = async (id: string, product: any) => {
  const response = await API.put(`/products/${id}`, product);
  return response.data;
};

export const deleteProduct = async (id: string) => {
  const response = await API.delete(`/products/${id}`);
  return response.data;
};

// ---------------------------
// USER API (Login/Register)
// ---------------------------
export const registerUser = async (user: any) => {
  const response = await API.post("/auth/register", user);
  return response.data;
};

export const loginUser = async (credentials: any) => {
  const response = await API.post("/auth/login", credentials);
  const data = response.data;

  // ✅ Save JWT token after login
  if (data?.token) {
    localStorage.setItem("token", data.token);
  }

  return data;
};

// Fetch all users (admin only)
export const fetchUsers = async () => {
  const response = await API.get("/users");
  return response.data;
};

// ---------------------------
// ORDER API
// ---------------------------
export const fetchOrders = async () => {
  const response = await API.get("/orders");
  return response.data;
};

export const fetchOrderById = async (id: string) => {
  const response = await API.get(`/orders/${id}`);
  return response.data;
};

export const addOrder = async (order: any) => {
  const response = await API.post("/orders", order);
  return response.data;
};

export const updateOrder = async (id: string, order: any) => {
  const response = await API.put(`/orders/${id}`, order);
  return response.data;
};

export const deleteOrder = async (id: string) => {
  const response = await API.delete(`/orders/${id}`);
  return response.data;
};

// ---------------------------
// INVENTORY API
// ---------------------------
export const fetchInventory = async () => {
  const response = await API.get("/inventory");
  return response.data;
};

export const addInventoryItem = async (item: any) => {
  const response = await API.post("/inventory", item);
  return response.data;
};

export const updateInventoryItem = async (id: string, item: any) => {
  const response = await API.put(`/inventory/${id}`, item);
  return response.data;
};

export const deleteInventoryItem = async (id: string) => {
  const response = await API.delete(`/inventory/${id}`);
  return response.data;
};

// ---------------------------
// LOGOUT FUNCTION
// ---------------------------
// ✅ Clear token and user session
export const logoutUser = () => {
  localStorage.removeItem("token");
};

// ---------------------------
// EXPORT DEFAULT
// ---------------------------
export default API;
