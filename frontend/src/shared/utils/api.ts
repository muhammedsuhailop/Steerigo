import axios, {
  AxiosResponse,
  AxiosError,
  InternalAxiosRequestConfig,
} from "axios";
import { store } from "../../app/store";
import { refreshAuthToken, logout } from "../../features/auth/store/authSlice";
import { isTokenExpired } from "./tokenUtils";

interface ExtendedAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
  data: { accessToken: string; refreshToken: string };
}

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:4000/api",
  timeout: 10000,
  withCredentials: true,
});

// Track refresh promise to prevent multiple simultaneous refresh calls
let refreshPromise: Promise<RefreshTokenResponse> | null = null;

// Helper function to refresh token
const handleTokenRefresh = async (): Promise<void> => {
  if (refreshPromise) {
    await refreshPromise;
    return;
  }

  refreshPromise = store
    .dispatch(refreshAuthToken())
    .unwrap() as Promise<RefreshTokenResponse>;

  try {
    await refreshPromise;
  } catch (error) {
    console.error("Token refresh failed:", error);
    store.dispatch(logout());
    throw error;
  } finally {
    refreshPromise = null;
  }
};

// Request interceptor
api.interceptors.request.use(
  async (config: ExtendedAxiosRequestConfig) => {
    const state = store.getState();
    let accessToken = state.auth.accessToken;

    // Skip auth for auth-related endpoints except refresh
    if (config.url?.includes("/auth/")) {
      if (accessToken && !config.url?.includes("/refresh")) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
      return config;
    }

    // Check if token needs refresh (5 minutes before expiry)
    if (accessToken && isTokenExpired(accessToken, 300)) {
      console.log("Token expiring soon, refreshing...");

      try {
        await handleTokenRefresh();

        // Get the new token after refresh
        const newState = store.getState();
        accessToken = newState.auth.accessToken;
      } catch (error) {
        // If refresh fails, let the error propagate
        throw error;
      }
    }

    // Add authorization header if token exists
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as ExtendedAxiosRequestConfig;

    // Handle 401 unauthorized responses
    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      // Don't retry refresh endpoint to avoid infinite loops
      if (originalRequest.url?.includes("/refresh")) {
        store.dispatch(logout());
        return Promise.reject(error);
      }

      try {
        await handleTokenRefresh();

        // Get the new token and retry the original request
        const state = store.getState();
        const newToken = state.auth.accessToken;

        if (newToken && originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        console.error(
          "Token refresh failed during response handling:",
          refreshError
        );
        store.dispatch(logout());

        // Redirect to login if not already there
        if (window.location.pathname !== "/login") {
          window.location.href = "/login";
        }

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// Typed API client methods for convenience
export const apiClient = {
  get: <T = any>(url: string, config?: any): Promise<T> =>
    api.get(url, config).then((response) => response.data),

  post: <T = any>(url: string, data?: any, config?: any): Promise<T> =>
    api.post(url, data, config).then((response) => response.data),

  put: <T = any>(url: string, data?: any, config?: any): Promise<T> =>
    api.put(url, data, config).then((response) => response.data),

  delete: <T = any>(url: string, config?: any): Promise<T> =>
    api.delete(url, config).then((response) => response.data),

  patch: <T = any>(url: string, data?: any, config?: any): Promise<T> =>
    api.patch(url, data, config).then((response) => response.data),
};

// Default export for backward compatibility
export default api;
