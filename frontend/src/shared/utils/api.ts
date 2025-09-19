// Updated src/shared/utils/api.ts
import axios from "axios";
import { store } from "../../app/store";
import { refreshAuthToken, logout } from "../../features/auth/store/authSlice";
import { isTokenExpired } from "./tokenUtils";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:4000/api",
  timeout: 10000,
  withCredentials: true,
});

let refreshPromise: Promise<any> | null = null;

// Request interceptor
api.interceptors.request.use(
  async (config) => {
    const state = store.getState();
    let accessToken = state.auth.accessToken;

    if (config.url?.includes("/auth/")) {
      if (accessToken && !config.url?.includes("/refresh")) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
      return config;
    }

    // Check token expiry for other endpoints
    if (accessToken && isTokenExpired(accessToken, 300)) {
      console.log("Token expiring soon, refreshing...");

      try {
        if (refreshPromise) {
          await refreshPromise;
        } else {
          refreshPromise = store.dispatch(refreshAuthToken()).unwrap();
          await refreshPromise;
          refreshPromise = null;
        }

        const newState = store.getState();
        accessToken = newState.auth.accessToken;
      } catch (error) {
        console.error("Token refresh failed:", error);
        refreshPromise = null;
        store.dispatch(logout());
        throw error;
      }
    }

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;

    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;

      if (original.url?.includes("/refresh")) {
        store.dispatch(logout());
        return Promise.reject(error);
      }

      try {
        if (refreshPromise) {
          await refreshPromise;
        } else {
          refreshPromise = store.dispatch(refreshAuthToken()).unwrap();
          await refreshPromise;
          refreshPromise = null;
        }

        const state = store.getState();
        const newToken = state.auth.accessToken;

        if (newToken) {
          original.headers.Authorization = `Bearer ${newToken}`;
          return api(original);
        }
      } catch (refreshError) {
        console.error("Refresh in response interceptor failed:", refreshError);
        refreshPromise = null;
        store.dispatch(logout());

        if (window.location.pathname !== "/login") {
          window.location.href = "/login";
        }
      }
    }

    return Promise.reject(error);
  }
);

export default api;
