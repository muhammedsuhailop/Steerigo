import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "@/shared/utils/axiosBaseQuery";
import { API_ENDPOINTS } from "@/shared/constants/api";
import {
  CouponResponse,
  InitiatePaymentRequest,
  InitiatePaymentResponse,
  RateDriverResponse,
  RatingRequest,
  VerifyPaymentRequest,
  VerifyPaymentResponse,
  ViewRideResponse,
} from "../types/viewRide.types";

export const viewRideApi = createApi({
  reducerPath: "viewRideApi",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["Ride"],
  endpoints: (builder) => ({
    getRideDetails: builder.query<ViewRideResponse, string>({
      query: (id) => ({
        url: `${API_ENDPOINTS.USER.RIDE}/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "Ride", id }],
    }),

    initiatePayment: builder.mutation<
      InitiatePaymentResponse,
      InitiatePaymentRequest
    >({
      query: (data) => ({
        url: API_ENDPOINTS.PAYMENT.INITIATE,
        method: "POST",
        data,
      }),
    }),

    verifyPayment: builder.mutation<
      VerifyPaymentResponse,
      VerifyPaymentRequest
    >({
      query: (data) => ({
        url: API_ENDPOINTS.PAYMENT.VERIFY,
        method: "POST",
        data,
      }),
      invalidatesTags: ["Ride"],
    }),

    markPaymentFailed: builder.mutation<
      { success: boolean; message: string },
      { paymentId: string; reason?: string }
    >({
      query: (data) => ({
        url: API_ENDPOINTS.PAYMENT.MARK_FAILED,
        method: "POST",
        data,
      }),
    }),

    applyCoupon: builder.mutation<
      CouponResponse,
      { rideId: string; couponCode: string }
    >({
      query: ({ rideId, couponCode }) => ({
        url: `${API_ENDPOINTS.USER.RIDE}/${rideId}/coupon`,
        method: "POST",
        data: { couponCode },
        skipErrorHandling: true,
      }),
    }),

    removeCoupon: builder.mutation<CouponResponse, string>({
      query: (rideId) => ({
        url: `${API_ENDPOINTS.USER.RIDE}/${rideId}/coupon`,
        method: "DELETE",
        skipErrorHandling: true,
      }),
    }),

    submitRideRating: builder.mutation<RateDriverResponse, RatingRequest>({
      query: ({ rideId, ...data }) => ({
        url: `${API_ENDPOINTS.USER.RIDE}/${rideId}/rating`,
        method: "POST",
        data,
      }),
    }),

    cancelActiveRide: builder.mutation<
      {
        success: boolean;
        message: string;
        data: {
          rideId: string;
          status: string;
          reason: string;
          cancellationFee: { amount: number | null; currency: string };
        };
      },
      { rideId: string; reason: string }
    >({
      query: ({ rideId, reason }) => ({
        url: `${API_ENDPOINTS.USER.RIDE}/${rideId}/cancel`,
        method: "POST",
        data: { reason },
      }),
      invalidatesTags: ["Ride"],
    }),
  }),
});

export const {
  useGetRideDetailsQuery,
  useInitiatePaymentMutation,
  useVerifyPaymentMutation,
  useMarkPaymentFailedMutation,
  useApplyCouponMutation,
  useRemoveCouponMutation,
  useSubmitRideRatingMutation,
  useCancelActiveRideMutation,
} = viewRideApi;
