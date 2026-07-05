import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
});

// FORCE attach token EVERY request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (!token) {
    console.log("NO TOKEN FOUND");
  }

  config.headers = config.headers || {};
  config.headers.Authorization = token ? `Bearer ${token}` : "";

  return config;
});

export default api;