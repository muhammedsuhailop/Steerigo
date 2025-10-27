import type { BaseQueryFn } from "@reduxjs/toolkit/query";
import type { AxiosRequestConfig, AxiosError } from "axios";
import { api } from "./api";
import {
  refreshAccessToken,
  waitForTokenRefresh,
  isTokenRefreshing,
} from "./tokenRefresh";
import type { RootState } from "@/app/store";

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

// Update Redux store with new tokens
const updateReduxTokens = async (accessToken: string, refreshToken: string) => {
  try {
    const { store } = await import("@/app/store");
    const { setTokens } = await import("@/features/auth/store/authSlice");

    store.dispatch(setTokens({ accessToken, refreshToken }));
  } catch (error) {
    console.error("Failed to update Redux tokens:", error);
  }
};

const clearReduxAuth = async () => {
  try {
    const { store } = await import("@/app/store");
    const { logout } = await import("@/features/auth/store/authSlice");

    store.dispatch(logout());
  } catch (error) {
    console.error("Failed to clear Redux auth:", error);
  }
};

// Custom Axios-based baseQuery for RTK Query with automatic token refresh
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
        !url.includes("/auth/refresh-token") &&
        !url.includes("/auth/login") &&
        !url.includes("/auth/signup")
      ) {
        try {
          let newAccessToken: string;

          // Check if refresh is already in progress
          if (isTokenRefreshing()) {
            // Wait for ongoing refresh to complete
            newAccessToken = await waitForTokenRefresh();
          } else {
            // Start new refresh
            newAccessToken = await refreshAccessToken();

            // Update Redux store
            const newRefreshToken = localStorage.getItem("refreshToken");
            if (newRefreshToken) {
              await updateReduxTokens(newAccessToken, newRefreshToken);
            }
          }

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
          // Refresh failed - clear auth and return error
          await clearReduxAuth();

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
