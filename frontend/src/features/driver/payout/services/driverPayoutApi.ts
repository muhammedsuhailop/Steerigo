import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "@/shared/utils/axiosBaseQuery";
import { API_ENDPOINTS } from "@/shared/constants/api";
import {
  GetPayoutsResponseDto,
  PayoutFilters,
  RequestPayoutRequest,
} from "../types/payout.types";

export const driverPayoutApi = createApi({
  reducerPath: "driverPayoutApi",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["Payout", "Wallet"],
  endpoints: (builder) => ({
    getPayouts: builder.query<GetPayoutsResponseDto, PayoutFilters>({
      query: (params) => ({
        url: API_ENDPOINTS.DRIVER.PAYOUTS,
        method: "GET",
        params,
      }),
      providesTags: ["Payout"],
    }),

    requestPayout: builder.mutation<
      { success: boolean; message: string },
      RequestPayoutRequest
    >({
      query: (data) => ({
        url: `${API_ENDPOINTS.DRIVER.PAYOUTS}/request`,
        method: "POST",
        data,
      }),
      invalidatesTags: ["Payout", "Wallet"],
    }),
  }),
});

export const { useGetPayoutsQuery, useRequestPayoutMutation } = driverPayoutApi;
