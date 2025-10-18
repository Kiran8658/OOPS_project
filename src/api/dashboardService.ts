import axios from "axios";

export const fetchDashboardStats = async () => {
  const response = await axios.get("http://localhost:8080/api/dashboard/stats", { withCredentials: true });
  return response.data;
};

export const fetchRecentActivity = async () => {
  const response = await axios.get("http://localhost:8080/api/dashboard/recent-activity", { withCredentials: true });
  return response.data;
};
