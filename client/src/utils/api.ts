import axios from "axios";
import { getToken } from "./auth";

const axiosClient = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api",
    withCredentials: true,
});

// attach token automatically
axiosClient.interceptors.request.use((config) => {
  const token = getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default axiosClient;