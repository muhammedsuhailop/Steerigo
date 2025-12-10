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

// Normalize axios error into a predictable shape
const normalizeAxiosError = (err: any) => {
  try {
    const isAxios = Boolean(err && err.isAxiosError);
    const normalized: {
      status?: number | string;
      data?: any;
      headers?: any;
      request?: any;
      original?: any;
      message?: string;
    } = {
      original: err,
      message: (err && err.message) || "Unknown error",
    };

    if (isAxios) {
      const axiosErr = err as AxiosError;
      normalized.request = axiosErr.request ?? null;
      normalized.headers = axiosErr.response?.headers ?? null;

      if (axiosErr.response) {
        normalized.status = axiosErr.response.status;
        normalized.data = axiosErr.response.data ?? axiosErr.response;
      } else if (axiosErr.request) {
        normalized.status = "NO_RESPONSE";
        normalized.data = { message: "No response received from server" };
      } else {
        normalized.status = "UNKNOWN";
        normalized.data = {
          message: axiosErr.message ?? "Unknown axios error",
        };
      }
    } else {
      normalized.status = (err && err.status) || "UNKNOWN";
      normalized.data = (err && (err.data ?? err)) || {
        message: err?.message ?? "Unknown error",
      };
    }

    return normalized;
  } catch (e) {
    return {
      status: "UNKNOWN",
      data: { message: "Unknown error" },
      original: err,
      message: err?.message ?? "Unknown error",
    };
  }
};

// Extract backend error message from normalized error
const extractBackendErrorMessage = (errorNormalized: any): string | null => {
  try {
    const data =
      errorNormalized?.data ?? errorNormalized?.original?.response?.data;

    if (!data) return null;
    if (typeof data === "string") return data;
    if (typeof data.error === "string") return data.error;
    if (typeof data.message === "string") return data.message;
    if (typeof data.msg === "string") return data.msg;
    if (typeof data.detail === "string") return data.detail;

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
      // normalize error immediately
      const normalized = normalizeAxiosError(axiosError);
      const status = normalized.status;
      const backendMessage = extractBackendErrorMessage(normalized);

      // handle expired access token (protected routes only)
      if (
        status === 401 &&
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
              await updateReduxTokens(newAccessToken, "");
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
          parsedError.timestamp = new Date().toISOString(); // ensure serializable
          ErrorDispatcher.dispatchError(parsedError);
          return { error: parsedError as BaseError };
        }
      }

      // treat auth endpoints specially so backend message surfaces to UI
      const isAuthEndpoint =
        url.includes("/auth/login") ||
        url.includes("/auth/signup") ||
        url.includes("/auth/verify") ||
        url.includes("/auth/forgot-password") ||
        url.includes("/auth/reset-password");

      let parsedError: BaseError;

      if (backendMessage && isAuthEndpoint) {
        const statusCode = typeof status === "number" ? status : 500;
        parsedError = {
          type:
            statusCode === 401 ? ErrorType.AUTHENTICATION : ErrorType.CLIENT,
          code: statusCode === 401 ? "UNAUTHORIZED" : "BAD_REQUEST",
          message: backendMessage,
          userMessage: backendMessage,
          severity:
            statusCode === 401 ? ErrorSeverity.MEDIUM : ErrorSeverity.MEDIUM,
          timestamp: new Date().toISOString(),
          requestId:
            Math.random().toString(36).substring(2, 15) +
            Math.random().toString(36).substring(2, 15),
          context: `API: ${url}`,
        } as any as BaseError;

        // return early without dispatching error; caller should handle UI
        return { error: parsedError };
      }

      // fallback to standard parser
      parsedError = errorHandler.parseApiError(
        normalized.original ?? normalized,
        `RTK: ${url}`
      );

      // surface backend message when present
      if (backendMessage) {
        parsedError = {
          ...parsedError,
          userMessage: backendMessage,
          message: backendMessage,
          timestamp: new Date().toISOString(),
        };
      } else {
        parsedError.timestamp = new Date().toISOString();
      }

      // dispatch error unless skipped
      if (!skipErrorHandling) {
        ErrorDispatcher.dispatchError(parsedError, false);
      }

      return { error: parsedError as BaseError };
    }
  };
};

// Create baseQuery with default options
export const createAxiosBaseQuery = (
  defaultOptions?: Partial<AxiosBaseQueryArgs>
) => {
  return axiosBaseQuery();
};
