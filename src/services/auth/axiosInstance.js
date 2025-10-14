import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { refreshAccessToken } from "./authService"; // Adjust path to your authService

const BASE_URL = import.meta.env.VITE_BASE_URL;

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // Required for refresh token cookie
  headers: {
    "Content-Type": "application/json",
  },
});

// State for token refresh
let isRefreshing = false;
let refreshSubscribers = [];

// Subscribe to token refresh completion
const subscribeToRefresh = (callback) => {
  refreshSubscribers.push(callback);
};

// Notify subscribers after refresh
const onRefreshed = (newToken) => {
  refreshSubscribers.forEach((callback) => callback(newToken));
  refreshSubscribers = [];
};

// Check if token is expired
const isTokenExpired = (token) => {
  if (!token) return true;
  try {
    const decoded = jwtDecode(token);
    const currentTime = Date.now() / 1000;
    return decoded.exp < currentTime + 30; // 30-second buffer before expiry
  } catch (error) {
    return true; // Invalid token = treat as expired
  }
};

// Request Interceptor
api.interceptors.request.use(
  async (config) => {
    let token = localStorage.getItem("accessToken");

    if (token && isTokenExpired(token)) {
      if (!isRefreshing) {
        isRefreshing = true;
        try {
          const newToken = await refreshAccessToken();
          localStorage.setItem("accessToken", newToken);
          isRefreshing = false;
          onRefreshed(newToken);
        } catch (error) {
          isRefreshing = false;
          localStorage.removeItem("accessToken");
          localStorage.removeItem("user");
          window.location.href = "/login"; // Redirect to login
          return Promise.reject(error);
        }
      }

      // Queue request until refresh completes
      return new Promise((resolve) => {
        subscribeToRefresh((newToken) => {
          config.headers.Authorization = `Bearer ${newToken}`;
          resolve(config);
        });
      });
    }

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (!isRefreshing) {
        isRefreshing = true;
        try {
          const newToken = await refreshAccessToken();
          localStorage.setItem("accessToken", newToken);
          isRefreshing = false;
          onRefreshed(newToken);

          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return api(originalRequest); // Retry original request
        } catch (refreshError) {
          isRefreshing = false;
          localStorage.removeItem("accessToken");
          localStorage.removeItem("user");
          window.location.href = "/login";
          return Promise.reject(refreshError);
        }
      }

      // Queue failed request
      return new Promise((resolve) => {
        subscribeToRefresh((newToken) => {
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          resolve(api(originalRequest));
        });
      });
    }

    return Promise.reject(error);
  }
);

export default api;
