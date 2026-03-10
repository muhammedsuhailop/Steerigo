import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "@/shared/utils/axiosBaseQuery";
import { API_ENDPOINTS } from "@/shared/constants/api";
import type {
  GetPendingRideRequestsResponseDto,
  AcceptRideRequestResponseDto,
  RejectRideRequestResponseDto,
} from "../types/rideRequests.types";

export const rideRequestsApi = createApi({
  reducerPath: "rideRequestsApi",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["RideRequests", "CurrentRide"],
  endpoints: (builder) => ({
    // Get pending ride requests
    getPendingRideRequests: builder.query<
      GetPendingRideRequestsResponseDto,
      void
    >({
      query: () => ({
        url: `${API_ENDPOINTS.DRIVER.RIDE}/requests`,
        method: "GET",
      }),
      transformResponse: (
        response: GetPendingRideRequestsResponseDto,
      ): GetPendingRideRequestsResponseDto => {
        return response;
      },
      providesTags: (result) =>
        result?.data.requests
          ? [
              ...result.data.requests.map(({ requestId }) => ({
                type: "RideRequests" as const,
                id: requestId,
              })),
              { type: "RideRequests" as const, id: "LIST" },
            ]
          : [{ type: "RideRequests" as const, id: "LIST" }],
    }),

    // Accept ride request
    acceptRideRequest: builder.mutation<AcceptRideRequestResponseDto, string>({
      query: (requestId) => ({
        url: `${API_ENDPOINTS.DRIVER.RIDE}/${requestId}/accept`,
        method: "POST",
      }),
      transformResponse: (
        response: AcceptRideRequestResponseDto,
      ): AcceptRideRequestResponseDto => {
        return response;
      },
      invalidatesTags: (result, error, requestId) => [
        { type: "RideRequests", id: requestId },
        { type: "RideRequests", id: "LIST" },
        { type: "CurrentRide" },
      ],
    }),

    // Reject ride request
    rejectRideRequest: builder.mutation<RejectRideRequestResponseDto, string>({
      query: (requestId) => ({
        url: `${API_ENDPOINTS.DRIVER.RIDE}/${requestId}/reject`,
        method: "POST",
      }),
      transformResponse: (
        response: RejectRideRequestResponseDto,
      ): RejectRideRequestResponseDto => {
        return response;
      },
      invalidatesTags: (result, error, requestId) => [
        { type: "RideRequests", id: requestId },
        { type: "RideRequests", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useGetPendingRideRequestsQuery,
  useAcceptRideRequestMutation,
  useRejectRideRequestMutation,
} = rideRequestsApi;
