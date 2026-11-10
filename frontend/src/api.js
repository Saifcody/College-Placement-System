import axios from "axios";

// In production (Vercel), VITE_API_URL is set via .env.production or Vercel env vars.
// In local development, falls back to the production Render URL so the app works
// without needing a local backend running.
const BASE_URL =
  (import.meta.env.VITE_API_URL ||
    "https://college-placement-system-q3ay.onrender.com") + "/api";

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
});

// Automatically attach the JWT token from localStorage to every request.
// Individual pages may also set Authorization headers — that is fine and
// consistent with this interceptor.
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

export default api;