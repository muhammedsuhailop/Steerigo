import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "@/shared/utils/axiosBaseQuery";
import { API_ENDPOINTS } from "@/shared/constants/api";
import {
  GetAdminTransactionsResponse,
  AdminTransactionFilters,
} from "../types/transaction.types";

export const adminTransactionApi = createApi({
  reducerPath: "adminTransactionApi",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["AdminTransaction"],
  endpoints: (builder) => ({
    getAdminTransactions: builder.query<
      GetAdminTransactionsResponse,
      AdminTransactionFilters
    >({
      query: (params) => ({
        url: API_ENDPOINTS.ADMIN.TRANSACTIONS,
        method: "GET",
        params,
      }),
      providesTags: ["AdminTransaction"],
    }),
  }),
});

export const { useGetAdminTransactionsQuery } = adminTransactionApi;
