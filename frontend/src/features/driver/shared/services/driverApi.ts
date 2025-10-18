import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "@/shared/utils/axiosBaseQuery";
import type {
  Driver,
  RideRequest,
  CurrentRide,
  DriverStats,
} from "../types/driver.types";

export const driverApi = createApi({
  reducerPath: "driverApi",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["Driver", "DriverStats", "RideRequests", "CurrentRide"],
  endpoints: (builder) => ({
    // Driver Profile endpoints
    getDriverProfile: builder.query<{ data: Driver }, void>({
      query: () => ({
        url: "/driver/profile",
        method: "GET",
      }),
      providesTags: ["Driver"],
    }),

    updateDriverProfile: builder.mutation<{ data: Driver }, Partial<Driver>>({
      query: (updates) => ({
        url: "/driver/profile",
        method: "PUT",
        data: updates,
      }),
      invalidatesTags: ["Driver"],
    }),

    // Driver Stats endpoints
    getDriverStats: builder.query<{ data: DriverStats }, void>({
      query: () => ({
        url: "/driver/stats",
        method: "GET",
      }),
      providesTags: ["DriverStats"],
    }),

    // Ride Request endpoints
    getPendingRequests: builder.query<{ data: RideRequest[] }, void>({
      query: () => ({
        url: "/driver/requests/pending",
        method: "GET",
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({
                type: "RideRequests" as const,
                id,
              })),
              { type: "RideRequests", id: "LIST" },
            ]
          : [{ type: "RideRequests", id: "LIST" }],
    }),

    acceptRideRequest: builder.mutation<{ data: CurrentRide }, string>({
      query: (requestId) => ({
        url: `/driver/requests/${requestId}/accept`,
        method: "POST",
      }),
      invalidatesTags: [
        { type: "RideRequests", id: "LIST" },
        { type: "CurrentRide", id: "CURRENT" },
      ],
    }),

    rejectRideRequest: builder.mutation<{ success: boolean }, string>({
      query: (requestId) => ({
        url: `/driver/requests/${requestId}/reject`,
        method: "POST",
      }),
      invalidatesTags: [{ type: "RideRequests", id: "LIST" }],
    }),

    // Current Ride endpoints
    getCurrentRide: builder.query<{ data: CurrentRide | null }, void>({
      query: () => ({
        url: "/driver/rides/current",
        method: "GET",
      }),
      providesTags: [{ type: "CurrentRide", id: "CURRENT" }],
      transformErrorResponse: (response: any) => {
        // Return null for 404 errors (no current ride)
        if (response.status === 404) {
          return { data: null };
        }
        return response;
      },
    }),

    updateRideStatus: builder.mutation<
      { data: CurrentRide },
      { rideId: string; status: CurrentRide["status"] }
    >({
      query: ({ rideId, status }) => ({
        url: `/driver/rides/${rideId}/status`,
        method: "PUT",
        data: { status },
      }),
      invalidatesTags: [
        { type: "CurrentRide", id: "CURRENT" },
        { type: "DriverStats" },
      ],
    }),

    // Driver Status endpoints
    setDriverOnlineStatus: builder.mutation<{ success: boolean }, boolean>({
      query: (isOnline) => ({
        url: "/driver/status",
        method: "PUT",
        data: { isOnline },
      }),
      invalidatesTags: ["Driver"],
    }),

    updateDriverLocation: builder.mutation<
      { success: boolean },
      { latitude: number; longitude: number }
    >({
      query: (location) => ({
        url: "/driver/location",
        method: "PUT",
        data: location,
      }),
      // Don't invalidate cache for location updates (too frequent)
    }),
  }),
});

export const {
  useGetDriverProfileQuery,
  useUpdateDriverProfileMutation,
  useGetDriverStatsQuery,
  useGetPendingRequestsQuery,
  useAcceptRideRequestMutation,
  useRejectRideRequestMutation,
  useGetCurrentRideQuery,
  useUpdateRideStatusMutation,
  useSetDriverOnlineStatusMutation,
  useUpdateDriverLocationMutation,
} = driverApi;
