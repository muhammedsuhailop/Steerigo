import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "@/shared/utils/axiosBaseQuery";
import type {
  DriverSearchResponse,
  SearchNearbyDriversPayload,
} from "../types/driverSearch.types";
import {
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
        url: `/user/search/nearby`,
        method: "POST",
        data: payload,
      }),
      invalidatesTags: ["DriverSearch"],
    }),

    // Send ride request
    sendRideRequest: builder.mutation<RideRequestResponse, RideRequestPayload>({
      query: (payload) => ({
        url: `/user/ride/request-send`,
        method: "POST",
        data: payload,
      }),
      invalidatesTags: ["RideRequest"],
    }),
  }),
});

export const { useSearchNearbyDriversMutation, useSendRideRequestMutation } =
  driverSearchApi;
