// src/api/auth.ts
import axios from "axios";

// Base URL for your backend auth endpoints
const API_URL = "http://localhost:8080/api/auth";

export interface AuthUser {
  username: string;
  password: string;
  email?: string; // Optional for login, required for registration
}

/**
 * Register a new user
 */
export const register = async (user: AuthUser) => {
  try {
    const response = await axios.post(`${API_URL}/register`, user, {
      headers: { "Content-Type": "application/json" },
    });
    return response.data; // returns the saved user object without password
  } catch (error: any) {
    // Backend sends { "error": "message" } or ResponseEntity body
    throw new Error(error.response?.data?.error || "Registration failed");
  }
};

/**
 * Login an existing user
 */
export const login = async (user: AuthUser) => {
  try {
    const response = await axios.post(`${API_URL}/login`, user, {
      headers: { "Content-Type": "application/json" },
    });
    return response.data; // returns the user object without password
  } catch (error: any) {
    throw new Error(error.response?.data?.error || "Login failed");
  }
};
