import axios, {
  AxiosResponse,
  AxiosError,
  InternalAxiosRequestConfig,
  AxiosRequestConfig,
} from "axios";
import { jwtDecode } from "jwt-decode";

interface ExtendedAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
  skipAuth?: boolean;
  skipErrorHandling?: boolean;
}

// Token refresh state management
let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

// Helper to subscribe requests waiting for token refresh
const subscribeTokenRefresh = (cb: (token: string) => void) => {
  refreshSubscribers.push(cb);
};

// Helper to notify all waiting requests when token is refreshed
const onTokenRefreshed = (token: string) => {
  refreshSubscribers.forEach((cb) => cb(token));
  refreshSubscribers = [];
};

// Helper to check if token needs refresh (5 min buffer)
const shouldRefreshToken = (token: string): boolean => {
  try {
    const decoded: any = jwtDecode(token);
    const expiryTime = decoded.exp * 1000;
    const currentTime = Date.now();
    const fiveMinutes = 5 * 60 * 1000;

    return expiryTime - currentTime < fiveMinutes;
  } catch {
    return true; 
  }
};

// Token refresh function
const refreshAccessToken = async (): Promise<{
  accessToken: string;
  refreshToken: string;
}> => {
  try {
    const response = await axios.post(
      `${
        import.meta.env.VITE_API_URL || "http://localhost:4000/api"
      }/auth/refresh-token`,
      {},
      { withCredentials: true }
    );

    const { accessToken, refreshToken } = response.data.data;

    // Update localStorage
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);

    // Update Redux store (lazy import to avoid circular dependency)
    import("../../app/store").then(({ store }) => {
      import("../../features/auth/store/authSlice").then(({ setTokens }) => {
        store.dispatch(setTokens({ accessToken, refreshToken }));
      });
    });

    return { accessToken, refreshToken };
  } catch (error) {
    // Clear auth state on refresh failure
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");

    // Update Redux store
    import("../../app/store").then(({ store }) => {
      import("../../features/auth/store/authSlice").then(({ logout }) => {
        store.dispatch(logout());
      });
    });

    // Redirect to login
    if (window.location.pathname !== "/login") {
      window.location.href = "/login";
    }

    throw error;
  }
};

// Axios instance configuration
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:4000/api",
  timeout: 30000,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// REQUEST INTERCEPTOR
api.interceptors.request.use(
  async (config: ExtendedAxiosRequestConfig) => {
    // Skip auth for specific endpoints
    if (
      config.skipAuth ||
      config.url?.includes("/auth/login") ||
      config.url?.includes("/auth/signup") ||
      config.url?.includes("/auth/refresh-token") ||
      config.url?.includes("/auth/google")
    ) {
      return config;
    }

    let token = localStorage.getItem("accessToken");

    // Check if token needs refresh
    if (token && shouldRefreshToken(token)) {
      if (!isRefreshing) {
        isRefreshing = true;

        try {
          const { accessToken } = await refreshAccessToken();
          isRefreshing = false;
          onTokenRefreshed(accessToken);
          token = accessToken;
        } catch (error) {
          isRefreshing = false;
          refreshSubscribers = [];
          throw error;
        }
      } else {
        // Wait for the ongoing refresh to complete
        token = await new Promise<string>((resolve) => {
          subscribeTokenRefresh((newToken: string) => {
            resolve(newToken);
          });
        });
      }
    }

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Preserve FormData content type for file uploads
    if (config.data instanceof FormData) {
      delete config.headers["Content-Type"];
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// RESPONSE INTERCEPTOR (for 401 fallback)
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as ExtendedAxiosRequestConfig;

    // Handle 401 errors (fallback if proactive refresh fails)
    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      !originalRequest.url?.includes("/auth/refresh-token")
    ) {
      originalRequest._retry = true;

      if (!isRefreshing) {
        isRefreshing = true;

        try {
          const { accessToken } = await refreshAccessToken();
          isRefreshing = false;
          onTokenRefreshed(accessToken);

          // Retry original request with new token
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          }
          return api(originalRequest);
        } catch (refreshError) {
          isRefreshing = false;
          refreshSubscribers = [];
          return Promise.reject(refreshError);
        }
      } else {
        // Wait for ongoing refresh
        return new Promise((resolve, reject) => {
          subscribeTokenRefresh((newToken: string) => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${newToken}`;
            }
            resolve(api(originalRequest));
          });
        });
      }
    }

    // Handle other errors
    if (!originalRequest?.skipErrorHandling) {
      const errorMessage =
        (error.response?.data as any)?.message ||
        error.message ||
        "An unexpected error occurred";

      console.error("API Error:", errorMessage);
    }

    return Promise.reject(error);
  }
);

// Typed API client methods
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

export default api;
