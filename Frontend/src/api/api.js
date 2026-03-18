import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000",
});

/* 🔐 Attach token (admin OR user/vendor) */
api.interceptors.request.use(
  (config) => {
    const token =
      localStorage.getItem("adminToken") || // admin
      localStorage.getItem("token");       // user / vendor

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      // 🔥 THIS IS THE KEY FIX
      delete config.headers.Authorization;
    }

    return config;
  },
  (error) => Promise.reject(error)
);



/* ================= AUTH APIS ================= */
export const login = (data) => api.post("/api/users/login", data);
export const register = (data) => api.post("/api/users/add", data);

export default api;
