import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "@/shared/utils/axiosBaseQuery";
import { API_ENDPOINTS } from "@/shared/constants/api";
import { WalletFilters, WalletResponse } from "../types/wallet.types";

export const driverWalletApi = createApi({
  reducerPath: "walletApi",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["Wallet"],
  endpoints: (builder) => ({
    getWalletDetails: builder.query<WalletResponse, WalletFilters>({
      query: (params) => ({
        url: API_ENDPOINTS.DRIVER.WALLET, 
        method: "GET",
        params,
      }),
      providesTags: ["Wallet"],
    }),
  }),
});

export const { useGetWalletDetailsQuery } = driverWalletApi;
