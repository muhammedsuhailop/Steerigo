import type { BaseQueryFn } from "@reduxjs/toolkit/query";
import type { AxiosRequestConfig, AxiosError } from "axios";
import { api } from "./api";
import {
  refreshAccessToken,
  waitForTokenRefresh,
  isTokenRefreshing,
} from "./tokenRefresh";
import type { BaseError } from "@/shared/components/ui/ErrorHandling/ErrorHandling.types";
import {
  ErrorType,
  ErrorSeverity,
} from "@/shared/components/ui/ErrorHandling/ErrorHandling.types";
import { errorHandler } from "@/shared/utils/errorHandler";
import { ErrorDispatcher } from "@/shared/api/services/errorDispatcherService";
import type { RootState } from "@/app/store";

// Arguments for baseQuery
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
export interface AxiosBaseQueryError extends BaseError {
  retryCount?: number;
}

// Update Redux store tokens
const updateReduxTokens = async (accessToken: string, refreshToken: string) => {
  try {
    const { store } = await import("@/app/store");
    const { setTokens } = await import("@/features/auth/store/authSlice");
    store.dispatch(setTokens({ accessToken, refreshToken }));
  } catch (error) {
    console.error("Failed to update Redux tokens:", error);
  }
};

// Clear Redux auth state
const clearReduxAuth = async () => {
  try {
    const { store } = await import("@/app/store");
    const { logout } = await import("@/features/auth/store/authSlice");
    store.dispatch(logout());
  } catch (error) {
    console.error("Failed to clear Redux auth:", error);
  }
};

// Extract backend error message
const extractBackendErrorMessage = (error: any): string | null => {
  try {
    if (error?.data) {
      if (typeof error.data.error === "string") return error.data.error;
      if (typeof error.data.message === "string") return error.data.message;
    }

    if (error?.response?.data) {
      if (typeof error.response.data.error === "string")
        return error.response.data.error;
      if (typeof error.response.data.message === "string")
        return error.response.data.message;
    }

    return null;
  } catch {
    return null;
  }
};

// Axios baseQuery with token refresh
export const axiosBaseQuery = (): BaseQueryFn<
  AxiosBaseQueryArgs,
  unknown,
  BaseError
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

      // Handle expired access token
      if (
        err.response?.status === 401 &&
        !skipAuth &&
        !url.includes("/auth/refresh-token") &&
        !url.includes("/auth/login") &&
        !url.includes("/auth/signup")
      ) {
        try {
          let newAccessToken: string;

          if (isTokenRefreshing()) {
            newAccessToken = await waitForTokenRefresh();
          } else {
            newAccessToken = await refreshAccessToken();

            const newRefreshToken = localStorage.getItem("refreshToken");
            if (newRefreshToken) {
              await updateReduxTokens(newAccessToken, newRefreshToken);
            }
          }

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
          await clearReduxAuth();
          const parsedError = errorHandler.parseApiError(
            refreshError,
            "Token Refresh Failed"
          );
          ErrorDispatcher.dispatchError(parsedError);
          return { error: parsedError as BaseError };
        }
      }

      // Direct backend message extraction for auth endpoints
      const isAuthEndpoint =
        url.includes("/auth/login") ||
        url.includes("/auth/signup") ||
        url.includes("/auth/verify") ||
        url.includes("/auth/forgot-password") ||
        url.includes("/auth/reset-password");

      let parsedError: BaseError;
      const backendMessage = extractBackendErrorMessage(err);

      if (backendMessage && isAuthEndpoint) {
        const statusCode = err.response?.status || 500;
        const now = new Date();

        parsedError = {
          type:
            statusCode === 401 ? ErrorType.AUTHENTICATION : ErrorType.CLIENT,
          code: statusCode === 401 ? "UNAUTHORIZED" : "BAD_REQUEST",
          message: backendMessage,
          userMessage: backendMessage,
          severity: ErrorSeverity.MEDIUM,
          timestamp: now.toISOString(),
          requestId: Math.random().toString(36).substring(2, 15),
          context: `API: ${url}`,
        } as any as BaseError;

        return { error: parsedError };
      } else {
        parsedError = errorHandler.parseApiError(err, `RTK: ${url}`);

        if (backendMessage) {
          parsedError = {
            ...parsedError,
            userMessage: backendMessage,
            message: backendMessage,
          };
        }

        if (!skipErrorHandling) {
          ErrorDispatcher.dispatchError(parsedError, false);
        }

        return { error: parsedError as BaseError };
      }
    }
  };
};

// Create baseQuery with default options
export const createAxiosBaseQuery = (
  defaultOptions?: Partial<AxiosBaseQueryArgs>
) => {
  return axiosBaseQuery();
};
