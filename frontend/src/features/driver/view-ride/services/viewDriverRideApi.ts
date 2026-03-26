import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "@/shared/utils/axiosBaseQuery";
import { API_ENDPOINTS } from "@/shared/constants/api";
import {
  ConfirmCashPaymentResponse,
  ConfirmCashRequest,
  RideStatusResponse,
  ViewDriverRideResponse,
} from "../viewDriverRide.types";

export const viewDriverRideApi = createApi({
  reducerPath: "viewDriverRideApi",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["DriverRide"],
  endpoints: (builder) => ({
    getDriverRideDetails: builder.query<ViewDriverRideResponse, string>({
      query: (id) => ({
        url: `${API_ENDPOINTS.DRIVER.RIDE}/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "DriverRide", id }],
    }),

    markArrived: builder.mutation<RideStatusResponse, string>({
      query: (rideId) => ({
        url: `${API_ENDPOINTS.DRIVER.RIDE}/${rideId}/arrived`,
        method: "PATCH",
      }),
      invalidatesTags: (result, error, id) => [{ type: "DriverRide", id }],
    }),

    startRide: builder.mutation<RideStatusResponse, string>({
      query: (rideId) => ({
        url: `${API_ENDPOINTS.DRIVER.RIDE}/${rideId}/started`,
        method: "PATCH",
      }),
      invalidatesTags: (result, error, id) => [{ type: "DriverRide", id }],
    }),

    completeRide: builder.mutation<RideStatusResponse, string>({
      query: (rideId) => ({
        url: `${API_ENDPOINTS.DRIVER.RIDE}/${rideId}/completed`,
        method: "PATCH",
      }),
      invalidatesTags: (result, error, id) => [{ type: "DriverRide", id }],
    }),

    cancelRide: builder.mutation<
      RideStatusResponse,
      { rideId: string; reason: string }
    >({
      query: ({ rideId, reason }) => ({
        url: `${API_ENDPOINTS.DRIVER.RIDE}/${rideId}/cancel`,
        method: "POST",
        data: { reason },
      }),
      invalidatesTags: (result, error, { rideId }) => [
        { type: "DriverRide", id: rideId },
      ],
    }),

    confirmCashPayment: builder.mutation<
      ConfirmCashPaymentResponse,
      ConfirmCashRequest
    >({
      query: (data) => ({
        url: API_ENDPOINTS.PAYMENT.CONFIRM_CASH,
        method: "POST",
        data,
      }),
      invalidatesTags: (result, error, { rideId }) => [
        { type: "DriverRide", id: rideId },
      ],
    }),
  }),
});

export const {
  useGetDriverRideDetailsQuery,
  useMarkArrivedMutation,
  useStartRideMutation,
  useCompleteRideMutation,
  useCancelRideMutation,
  useConfirmCashPaymentMutation,
} = viewDriverRideApi;
