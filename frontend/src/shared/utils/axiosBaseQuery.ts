import type { BaseQueryFn } from "@reduxjs/toolkit/query";
import type { AxiosRequestConfig, AxiosError } from "axios";
import { api } from "./api";

// arguments type for custom baseQuery
export interface AxiosBaseQueryArgs {
  url: string;
  method?: AxiosRequestConfig["method"];
  data?: AxiosRequestConfig["data"];
  params?: AxiosRequestConfig["params"];
  headers?: AxiosRequestConfig["headers"];
  skipAuth?: boolean;
  skipErrorHandling?: boolean;
}

// error type returned by baseQuery
export interface AxiosBaseQueryError {
  status: number | string;
  data: any;
  error?: string;
}

// Custom Axios-based baseQuery for RTK Query

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

// function for creating baseQuery with default options
export const createAxiosBaseQuery = (
  defaultOptions?: Partial<AxiosBaseQueryArgs>
) => {
  return axiosBaseQuery();
};
