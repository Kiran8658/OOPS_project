import axios from "axios";

// Base URL of your backend auth endpoints
const API_URL = "http://localhost:8080/api/auth";

/**
 * Register a new user
 * @param user Object containing username, email, password
 * @returns Axios response
 */
export const register = async (user: { username: string; email: string; password: string }) => {
  try {
    const response = await axios.post(`${API_URL}/register`, user, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error: any) {
    // Throw backend error for the frontend to handle
    throw error.response?.data || "Registration failed";
  }
};

/**
 * Login an existing user
 * @param user Object containing email and password
 * @returns Axios response
 */
export const login = async (user: { email: string; password: string }) => {
  try {
    const response = await axios.post(`${API_URL}/login`, user, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error: any) {
    // Throw backend error for the frontend to handle
    throw error.response?.data || "Login failed";
  }
};
