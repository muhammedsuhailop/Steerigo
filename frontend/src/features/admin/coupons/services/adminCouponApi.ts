import { createApi } from "@reduxjs/toolkit/query/react";
import {
  AdminCouponFilters,
  GetAdminCouponsResponse,
} from "../types/coupon.types";
import { axiosBaseQuery } from "@/shared/utils/axiosBaseQuery";

export const adminCouponApi = createApi({
  reducerPath: "adminCouponApi",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["Coupons"],
  endpoints: (builder) => ({
    getAdminCoupons: builder.query<
      GetAdminCouponsResponse,
      AdminCouponFilters
    >({
      query: (filters) => ({
        url: "/admin/coupons",
        method: "GET",
        params: filters,
      }),
      providesTags: ["Coupons"],
    }),
  }),
});

export const { useGetAdminCouponsQuery } = adminCouponApi;
