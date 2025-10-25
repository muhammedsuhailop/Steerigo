import type { BaseQueryFn } from "@reduxjs/toolkit/query";
import type { AxiosRequestConfig, AxiosError } from "axios";
import { api } from "./api";

// Arguments type for custom baseQuery
export interface AxiosBaseQueryArgs {
  url: string;
  method?: AxiosRequestConfig["method"];
  data?: AxiosRequestConfig["data"];
  params?: AxiosRequestConfig["params"];
  headers?: AxiosRequestConfig["headers"];
  skipAuth?: boolean;
  skipErrorHandling?: boolean;
}

// Error type returned by baseQuery
export interface AxiosBaseQueryError {
  status: number | string;
  data: any;
  error?: string;
}

// Refresh token state management
let isRefreshing = false;
let refreshPromise: Promise<string> | null = null;

/**
 * Refresh access token using refresh token endpoint
 */
const refreshAccessToken = async (): Promise<string> => {
  try {
    const refreshToken = localStorage.getItem("refreshToken");
    if (!refreshToken) {
      throw new Error("No refresh token available");
    }

    const response = await api.post(
      "/auth/refresh-token",
      {},
      {
        withCredentials: true,
        // @ts-ignore - Skip auth for refresh endpoint
        skipAuth: true,
      }
    );

    const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
      response.data;

    // Update localStorage
    localStorage.setItem("accessToken", newAccessToken);
    localStorage.setItem("refreshToken", newRefreshToken);

    // Update Redux store (lazy import to avoid circular dependency)
    import("../../app/store").then(({ store }) => {
      import("../../features/auth/store/authSlice").then(({ setTokens }) => {
        store.dispatch(
          setTokens({
            accessToken: newAccessToken,
            refreshToken: newRefreshToken,
          })
        );
      });
    });

    return newAccessToken;
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

/**
 * Get or create refresh promise to prevent concurrent refresh calls
 */
const getRefreshPromise = (): Promise<string> => {
  if (!refreshPromise) {
    refreshPromise = refreshAccessToken().finally(() => {
      refreshPromise = null;
      isRefreshing = false;
    });
  }
  return refreshPromise;
};

/**
 * Custom Axios-based baseQuery for RTK Query with automatic token refresh
 */
export const axiosBaseQuery = (): BaseQueryFn<
  AxiosBaseQueryArgs,
  unknown,
  AxiosBaseQueryError
> => {
  return async ({
    url,
    method = "GET",
    data,
    params,
    headers,
    skipAuth,
    skipErrorHandling,
  }) => {
    try {
      const config: AxiosRequestConfig & {
        skipAuth?: boolean;
        skipErrorHandling?: boolean;
      } = {
        url,
        method,
        data,
        params,
        headers,
        skipAuth,
        skipErrorHandling,
      };

      const result = await api.request(config);
      return { data: result.data };
    } catch (axiosError) {
      const err = axiosError as AxiosError;

      // Handle 401 Unauthorized - Token expired
      if (
        err.response?.status === 401 &&
        !skipAuth &&
        !url.includes("/auth/refresh-token")
      ) {
        try {
          // Prevent concurrent refresh calls
          if (!isRefreshing) {
            isRefreshing = true;
          }

          // Wait for refresh to complete
          const newAccessToken = await getRefreshPromise();

          // Retry original request with new token
          const retryConfig: AxiosRequestConfig = {
            url,
            method,
            data,
            params,
            headers: {
              ...headers,
              Authorization: `Bearer ${newAccessToken}`,
            },
          };

          const retryResult = await api.request(retryConfig);
          return { data: retryResult.data };
        } catch (refreshError) {
          // Refresh failed, return original error
          return {
            error: {
              status: 401,
              data: "Session expired. Please login again.",
              error: "Unauthorized",
            },
          };
        }
      }

      // Return error for other cases
      return {
        error: {
          status: err.response?.status || err.code || "UNKNOWN_ERROR",
          data: err.response?.data || err.message,
          error: err.message,
        },
      };
    }
  };
};

// Function for creating baseQuery with default options
export const createAxiosBaseQuery = (
  defaultOptions?: Partial<AxiosBaseQueryArgs>
) => {
  return axiosBaseQuery();
};
