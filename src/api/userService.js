import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL; // or process.env.REACT_APP_API_URL

export const getUsers = async () => {
  const response = await axios.get(`${API_URL}/users`);
  return response.data;
};

export const addUser = async (user) => {
  const response = await axios.post(`${API_URL}/users`, user);
  return response.data;
};
