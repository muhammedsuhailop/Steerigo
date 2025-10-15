import axios, {
  AxiosResponse,
  AxiosError,
  InternalAxiosRequestConfig,
  AxiosRequestConfig,
} from "axios";
import { store } from "../../app/store";
import { refreshAuthToken, logout } from "../../features/auth/store/authSlice";
import { isTokenExpired } from "./tokenUtils";
import { errorHandler } from "./errorUtils";

interface ExtendedAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
  skipAuth?: boolean; // Allow skipping auth for specific requests
  skipErrorHandling?: boolean;
}

interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
  data: { accessToken: string; refreshToken: string };
}

// Axios instance configuration
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:4000/api",
  timeout: 30000, // timeout for file uploads
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Track refresh promise to prevent multiple simultaneous refresh calls
let refreshPromise: Promise<RefreshTokenResponse> | null = null;

// Token refresh with error handling
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
    console.log("Token refreshed successfully");
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

    // Skip auth for specific requests
    if (config.skipAuth) {
      return config;
    }

    // Skip auth for auth-related endpoints except refresh
    if (config.url?.includes("/auth/")) {
      if (accessToken && !config.url?.includes("/refresh-token")) {
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
        throw error;
      }
    }

    // Add authorization header if token exists
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    // Preserve FormData content type for file uploads
    if (config.data instanceof FormData) {
      delete config.headers["Content-Type"];
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor with error handling
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as ExtendedAxiosRequestConfig;

    if (!originalRequest?.skipErrorHandling) {
      const parsedError = errorHandler.parseApiError(
        error,
        originalRequest?.url
      );
      errorHandler.logError(parsedError);
    }

    // Handle 401 unauthorized responses
    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      // Don't retry refresh endpoint to avoid infinite loops
      if (originalRequest.url?.includes("/refresh-token")) {
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

// typed API client methods
export const apiClient = {
  get: <T = any>(url: string, config?: AxiosRequestConfig): Promise<T> =>
    api.get(url, config).then((response) => response.data),

  post: <T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> =>
    api.post(url, data, config).then((response) => response.data),

  put: <T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> => api.put(url, data, config).then((response) => response.data),

  delete: <T = any>(url: string, config?: AxiosRequestConfig): Promise<T> =>
    api.delete(url, config).then((response) => response.data),

  patch: <T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> =>
    api.patch(url, data, config).then((response) => response.data),

  // Specific method for file uploads
  uploadFile: <T = any>(
    url: string,
    formData: FormData,
    config?: AxiosRequestConfig
  ): Promise<T> =>
    api
      .post(url, formData, {
        ...config,
        headers: {
          ...config?.headers,
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => response.data),
};

// for backward compatibility
export default api;
