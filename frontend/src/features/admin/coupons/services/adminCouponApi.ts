import { createApi } from "@reduxjs/toolkit/query/react";
import {
  AdminCouponFilters,
  CreateCouponRequest,
  CreateCouponResponse,
  GetAdminCouponsResponse,
} from "../types/coupon.types";
import { axiosBaseQuery } from "@/shared/utils/axiosBaseQuery";
import { API_ENDPOINTS } from "@/shared";

export const adminCouponApi = createApi({
  reducerPath: "adminCouponApi",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["Coupons"],
  endpoints: (builder) => ({
    getAdminCoupons: builder.query<GetAdminCouponsResponse, AdminCouponFilters>(
      {
        query: (filters) => ({
          url: API_ENDPOINTS.ADMIN.COUPONS,
          method: "GET",
          params: filters,
        }),
        providesTags: ["Coupons"],
      },
    ),
    addCoupon: builder.mutation<CreateCouponResponse, CreateCouponRequest>({
      query: (body) => ({
        url: `${API_ENDPOINTS.ADMIN.COUPONS}/add`,
        method: "POST",
        data: body,
        skipErrorHandling: true,
      }),
      invalidatesTags: ["Coupons"],
    }),
  }),
});

export const { useGetAdminCouponsQuery, useAddCouponMutation } = adminCouponApi;
