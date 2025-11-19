import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000", // your backend base URL
});

// 🔒 Automatically attach token to every request if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 🧩 API Endpoints
export const register = (formData) => api.post("/add", formData);
export const login = (formData) => api.post("/login", formData);

export default api;
