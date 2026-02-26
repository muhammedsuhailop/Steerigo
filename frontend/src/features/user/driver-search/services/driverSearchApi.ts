import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "@/shared/utils/axiosBaseQuery";
import { API_ENDPOINTS } from "@/shared/constants/api";

import type {
  DriverSearchResponse,
  SearchNearbyDriversPayload,
} from "../types/driverSearch.types";
import {
  AutoRideRequestPayload,
  AutoRideRequestResponse,
  CancelRideRequestPayload,
  CancelRideRequestResponse,
  RideRequestPayload,
  RideRequestResponse,
} from "../types/rideRequest.types";

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export const driverSearchApi = createApi({
  reducerPath: "driverSearchApi",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["DriverSearch", "RideRequest"],
  endpoints: (builder) => ({
    // Search nearby drivers
    searchNearbyDrivers: builder.mutation<
      DriverSearchResponse,
      SearchNearbyDriversPayload
    >({
      query: (payload) => ({
        url: API_ENDPOINTS.USER.SEARCH_NEARBY,
        method: "POST",
        data: payload,
      }),
      invalidatesTags: ["DriverSearch"],
    }),

    // Send ride request
    sendRideRequest: builder.mutation<RideRequestResponse, RideRequestPayload>({
      query: (payload) => ({
        url: API_ENDPOINTS.USER.SEND_RIDE_REQUEST,
        method: "POST",
        data: payload,
      }),
      invalidatesTags: ["RideRequest"],
    }),

    // Send auto ride requests
    sendAutoRideRequest: builder.mutation<
      AutoRideRequestResponse,
      AutoRideRequestPayload
    >({
      query: (payload) => ({
        url: API_ENDPOINTS.USER.AUTO_RIDE_REQUEST,
        method: "POST",
        data: payload,
      }),
    }),

    // Cancel ride requests (by requestGroupId)
    cancelRideRequest: builder.mutation<
      ApiResponse<CancelRideRequestResponse>,
      CancelRideRequestPayload
    >({
      query: (payload) => ({
        url: API_ENDPOINTS.USER.CANCEL_RIDE_REQUEST,
        method: "POST",
        data: payload,
      }),
      invalidatesTags: ["RideRequest"],
    }),
  }),
});

export const {
  useSearchNearbyDriversMutation,
  useSendRideRequestMutation,
  useSendAutoRideRequestMutation,
  useCancelRideRequestMutation,
} = driverSearchApi;
