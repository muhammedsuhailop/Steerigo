import axios, {
  AxiosInstance,
  AxiosError,
  InternalAxiosRequestConfig,
  AxiosResponse,
} from "axios";
import { API_TIMEOUT } from "@/constants";
import {
  getStoredToken,
  getStoredRefreshToken,
  setStoredTokens,
  clearStoredTokens,
} from "@/utils";

interface ApiClientError {
  readonly message: string;
  readonly statusCode?: number;
  readonly field?: string;
  readonly code?: string;
}

class ApiClient {
  private readonly client: AxiosInstance;
  private isRefreshing = false;
  private refreshSubscribers: Array<(token: string) => void> = [];

  constructor() {
    this.client = axios.create({
      baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000",
      timeout: API_TIMEOUT,
      headers: {
        "Content-Type": "application/json",
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    // Request interceptor - Add auth token
    this.client.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        const token = getStoredToken();

        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
      },
      (error: AxiosError) => {
        return Promise.reject(this.handleApiError(error));
      }
    );

    // Response interceptor - Handle token refresh
    this.client.interceptors.response.use(
      (response: AxiosResponse) => response.data,
      async (error: AxiosError) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & {
          _retry?: boolean;
        };

        // Skip token refresh for auth endpoints
        const authEndpoints = [
          "/api/auth/login",
          "/api/auth/signup",
          "/api/auth/forgot-password",
          "/api/auth/reset-password",
          "/api/auth/verify-otp",
          "/apiauth/resend-otp",
        ];
        const isAuthEndpoint = authEndpoints.some((endpoint) =>
          originalRequest.url?.includes(endpoint)
        );

        if (
          error.response?.status === 401 &&
          !originalRequest._retry &&
          !isAuthEndpoint
        ) {
          if (this.isRefreshing) {
            return new Promise((resolve) => {
              this.refreshSubscribers.push((token: string) => {
                if (originalRequest.headers) {
                  originalRequest.headers.Authorization = `Bearer ${token}`;
                }
                resolve(this.client(originalRequest));
              });
            });
          }

          originalRequest._retry = true;
          this.isRefreshing = true;

          try {
            const refreshToken = getStoredRefreshToken();

            if (!refreshToken) {
              throw new Error("No refresh token available");
            }

            const response = await this.refreshTokenRequest(refreshToken);
            const newToken = response.data.accessToken;

            // Update stored tokens
            setStoredTokens(newToken, refreshToken);

            // Process queued requests
            this.refreshSubscribers.forEach((callback) => callback(newToken));
            this.refreshSubscribers = [];

            // Retry original request
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${newToken}`;
            }

            return this.client(originalRequest);
          } catch (refreshError) {
            // Refresh failed, logout user
            this.clearAuthData();
            this.redirectToLogin();
            return Promise.reject(
              this.handleApiError(refreshError as AxiosError)
            );
          } finally {
            this.isRefreshing = false;
          }
        }

        return Promise.reject(this.handleApiError(error));
      }
    );
  }

  private async refreshTokenRequest(
    refreshToken: string
  ): Promise<{ success: boolean; data: { accessToken: string } }> {
    const response = await axios.post<{
      success: boolean;
      data: { accessToken: string };
    }>(
      `${
        import.meta.env.VITE_API_URL || "http://localhost:3000"
      }/api/auth/refresh`,
      { refreshToken },
      {
        headers: { "Content-Type": "application/json" },
        timeout: API_TIMEOUT,
      }
    );

    return response.data;
  }

  private handleApiError(error: AxiosError): ApiClientError {
    if (error.response?.data) {
      const data = error.response.data as {
        message?: string;
        error?: string;
        field?: string;
      };
      return {
        message: data.message || data.error || "An error occurred",
        statusCode: error.response.status,
        field: data.field,
        code: error.code,
      };
    }

    if (error.request) {
      return {
        message: "Network error. Please check your connection.",
        code: error.code,
      };
    }

    return {
      message: error.message || "An unexpected error occurred",
      code: error.code,
    };
  }

  private clearAuthData(): void {
    clearStoredTokens();
  }

  private redirectToLogin(): void {
    // Only redirect if not already on auth pages
    const currentPath = window.location.pathname;
    const authPaths = ["/login", "/signup", "/verify-otp", "/reset-password"];

    if (!authPaths.some((path) => currentPath.startsWith(path))) {
      window.location.href = "/login";
    }
  }

  // HTTP methods with proper typing
  async get<T>(url: string, config = {}): Promise<T> {
    return this.client.get(url, config);
  }

  async post<T>(url: string, data?: unknown, config = {}): Promise<T> {
    return this.client.post(url, data, config);
  }

  async put<T>(url: string, data?: unknown, config = {}): Promise<T> {
    return this.client.put(url, data, config);
  }

  async patch<T>(url: string, data?: unknown, config = {}): Promise<T> {
    return this.client.patch(url, data, config);
  }

  async delete<T>(url: string, config = {}): Promise<T> {
    return this.client.delete(url, config);
  }
}

const apiClient = new ApiClient();
export default apiClient;
