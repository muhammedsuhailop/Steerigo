import axios, {
  AxiosResponse,
  AxiosError,
  InternalAxiosRequestConfig,
  AxiosRequestConfig,
} from "axios";

interface ExtendedAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
  skipAuth?: boolean;
  skipErrorHandling?: boolean;
}

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
  (config: ExtendedAxiosRequestConfig) => {
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

    // Add access token if available
    const token = localStorage.getItem("accessToken");
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

// RESPONSE INTERCEPTOR - Only for non-RTK Query requests
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as ExtendedAxiosRequestConfig;

    // Only handle direct axios calls
    if (originalRequest?._retry) {
      return Promise.reject(error);
    }

    // Log errors for debugging
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
