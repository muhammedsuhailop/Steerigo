import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "@/shared/utils/axiosBaseQuery";
import { API_ENDPOINTS } from "@/shared/constants/api";
import { AdminPayoutResponse, AdminPayoutFilters } from "../types/payout.types";

export const adminPayoutApi = createApi({
  reducerPath: "adminPayoutApi",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["AdminPayout"],
  endpoints: (builder) => ({
    getAdminPayouts: builder.query<AdminPayoutResponse, AdminPayoutFilters>({
      query: (params) => ({
        url: API_ENDPOINTS.ADMIN.PAYOUTS,
        method: "GET",
        params,
      }),
      providesTags: ["AdminPayout"],
    }),

    approvePayout: builder.mutation<
      { success: boolean; message: string },
      string
    >({
      query: (payoutId) => ({
        url: `${API_ENDPOINTS.ADMIN.PAYOUTS}/${payoutId}/approve`,
        method: "PATCH",
      }),
      invalidatesTags: ["AdminPayout"],
    }),

    rejectPayout: builder.mutation<
      { success: boolean; message: string },
      { payoutId: string; reason: string }
    >({
      query: ({ payoutId, reason }) => ({
        url: `${API_ENDPOINTS.ADMIN.PAYOUTS}/${payoutId}/reject`,
        method: "PATCH",
        data: { reason },
      }),
      invalidatesTags: ["AdminPayout"],
    }),
  }),
});

export const {
  useGetAdminPayoutsQuery,
  useApprovePayoutMutation,
  useRejectPayoutMutation,
} = adminPayoutApi;
