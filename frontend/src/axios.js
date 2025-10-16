import axios from "axios";

// Create an axios instance with base URL
const instance = axios.create({
  baseURL: "http://127.0.0.1:8000", // Your FastAPI backend
});

// Add a request interceptor to include the token automatically
instance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
});

export default instance;
