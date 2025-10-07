import axios from "axios";

const API_URL = "http://localhost:8080/api/orders"; // your backend base URL

export const getOrders = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

export async function addOrder(order) {
  const res = await fetch('http://localhost:8080/orders', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(order)
  });
  if (!res.ok) {
    const errText = await res.text();
    throw new Error(errText || "Failed");
  }
  return res.json();
}

export const deleteOrder = async (id) => {
  await axios.delete(`${API_URL}/${id}`);
};
