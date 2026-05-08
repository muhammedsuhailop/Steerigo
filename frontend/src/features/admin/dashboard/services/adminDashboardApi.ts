import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "@/shared/utils/axiosBaseQuery";
import { API_ENDPOINTS } from "@/shared/constants/api";
import type {
  AdminUserStats,
  AdminRideStats,
  AdminDriverStats,
  AdminStatsResponse,
} from "../types/adminDashboard.stats.types";

export const adminDashboardApi = createApi({
  reducerPath: "adminDashboardApi",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["DashboardStats"],
  endpoints: (builder) => ({
    getAdminUserStats: builder.query<
      AdminUserStats,
      { fromDate?: string; toDate?: string } | void
    >({
      query: (params) => ({
        url: API_ENDPOINTS.ADMIN.STATS.USER,
        method: "GET",
        params,
      }),
      transformResponse: (response: AdminStatsResponse<AdminUserStats>) =>
        response.data,
      providesTags: ["DashboardStats"],
    }),
    getAdminRideStats: builder.query<
      AdminRideStats,
      { fromDate?: string; toDate?: string } | void
    >({
      query: (params) => ({
        url: API_ENDPOINTS.ADMIN.STATS.RIDE,
        method: "GET",
        params,
      }),
      transformResponse: (response: AdminStatsResponse<AdminRideStats>) =>
        response.data,
      providesTags: ["DashboardStats"],
    }),
    getAdminDriverStats: builder.query<
      AdminDriverStats,
      { fromDate?: string; toDate?: string } | void
    >({
      query: (params) => ({
        url: API_ENDPOINTS.ADMIN.STATS.DRIVER,
        method: "GET",
        params,
      }),
      transformResponse: (response: AdminStatsResponse<AdminDriverStats>) =>
        response.data,
      providesTags: ["DashboardStats"],
    }),
  }),
});

export const {
  useGetAdminUserStatsQuery,
  useGetAdminRideStatsQuery,
  useGetAdminDriverStatsQuery,
} = adminDashboardApi;
