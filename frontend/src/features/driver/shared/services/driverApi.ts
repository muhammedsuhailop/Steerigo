import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "@/shared/utils/axiosBaseQuery";
import type {
  Driver,
  RideRequest,
  CurrentRide,
  DriverStats,
  DashboardApiResponse,
  FullDashboardResponse,
} from "../types/driver.types";
import type {
  AvailabilityData,
  DriverStatusResponse,
} from "../../scheduling/types/scheduling.types";
import {
  mockStateManager,
  MOCK_DRIVER,
  MOCK_PENDING_REQUESTS,
} from "../mocks/driver.mock";
import {
  DriverProfile,
  DriverProfileResponse,
} from "../../profile/types/driverProfile.types";

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
const mockSuccess = <T>(data: T) => ({ data: { data } });

export const driverApi = createApi({
  reducerPath: "driverApi",
  baseQuery: axiosBaseQuery(),
  tagTypes: [
    "Driver",
    "DriverStats",
    "RideRequests",
    "CurrentRide",
    "DriverStatus",
  ],
  endpoints: (builder) => ({
    getDriverProfile: builder.query<DriverProfileResponse, void>({
      query: () => ({
        url: "/driver/profile",
        method: "GET",
      }),
      transformResponse: (response: ApiResponse<DriverProfile>) => {
        return response.data;
      },
      providesTags: ["Driver"],
    }),

    getDriverStatus: builder.query<DriverStatusResponse, void>({
      query: () => ({
        url: "/driver/status",
        method: "GET",
      }),
      transformResponse: (response: DriverStatusResponse) => {
        return response;
      },
      providesTags: ["DriverStatus"],
    }),

    getDriverStats: builder.query<{ data: FullDashboardResponse }, void>({
      query: () => ({
        url: "/driver/dashboard",
        method: "GET",
      }),
      transformResponse: (response: DashboardApiResponse) => {
        const {
          driver,
          statistics,
          performance,
          availability,
          currentRide,
          pendingRequests,
          meta,
        } = response.data;

        const transformedDriver: Driver = {
          id: driver.driverId,
          driverId: driver.driverId,
          userId: driver.userId,
          name: driver.name,
          email: driver.email.value,
          mobile: driver.mobile,
          profileImage: undefined,
          currentStatus:
            availability?.status === "Available" ? "Available" : "Offline",
          rating: performance.averageRating,
          totalRides: statistics.ridesCompleted + statistics.ridesCancelled,
          completedRides: statistics.ridesCompleted,
          scheduledRides: statistics.scheduledRides,
          totalEarnings: statistics.totalEarnings,
          todayEarnings: statistics.totalEarnings,
          weeklyEarnings: 0,
          monthlyEarnings: 0,
          licenseNumber: driver.licenseNumber,
          licenceCategory: driver.licenceCategory,
          licenseIssueDate: driver.licenseIssueDate,
          licenseExpiryDate: driver.licenseExpiryDate,
          kycStatus: driver.kycStatus,
          status: driver.status,
          eligibleGearTypes: driver.eligibleGearTypes,
          eligibleBodyTypes: driver.eligibleBodyTypes,
          location: availability?.currentLocation || {
            latitude: 0,
            longitude: 0,
            address: "Location not available",
          },
          createdAt: new Date().toISOString(),
          updatedAt: meta.lastUpdated,
        };

        const transformedStats: DriverStats = {
          totalRides: statistics.ridesCompleted + statistics.ridesCancelled,
          completedRides: statistics.ridesCompleted,
          ridesCancelled: statistics.ridesCancelled,
          scheduledRides: statistics.scheduledRides,
          todayEarnings: statistics.totalEarnings,
          weeklyEarnings: 0,
          monthlyEarnings: 0,
          totalEarnings: statistics.totalEarnings,
          currency: statistics.currency,
          rating: performance.averageRating,
          acceptanceRate: performance.acceptanceRate,
          cancellationRate: performance.cancellationRate,
          completionRate: 100 - performance.cancellationRate,
        };

        const fullResponse: FullDashboardResponse = {
          driver: transformedDriver,
          stats: transformedStats,
          availability: availability,
          currentRide: currentRide,
          pendingRequests: pendingRequests || [],
          meta: meta,
        };

        return { data: fullResponse };
      },
      providesTags: ["Driver", "DriverStats"],
    }),

    getPendingRequests: builder.query<{ data: RideRequest[] }, void>({
      queryFn: async () => {
        await delay(400);
        return mockSuccess(mockStateManager.getRequests());
      },
      // query: () => ({
      //   url: "/driver/ride-requests/pending",
      //   method: "GET",
      // }),
      // transformResponse: (response: any) => {
      //   return { data: response.data };
      // },
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({
                type: "RideRequests" as const,
                id,
              })),
              { type: "RideRequests" as const, id: "LIST" },
            ]
          : [{ type: "RideRequests" as const, id: "LIST" }],
    }),

    getCurrentRide: builder.query<{ data: CurrentRide }, void>({
      queryFn: async () => {
        await delay(400);
        const currentRide = mockStateManager.getCurrentRide();
        if (!currentRide) {
          return {
            error: {
              status: 404,
              data: { message: "No active ride" },
            },
          };
        }
        return mockSuccess(currentRide);
      },
      // query: () => ({
      //   url: "/driver/ride/current",
      //   method: "GET",
      // }),
      // transformResponse: (response: any) => {
      //   return { data: response.data };
      // },
      providesTags: ["CurrentRide"],
    }),

    updateDriverProfile: builder.mutation<{ data: Driver }, Partial<Driver>>({
      queryFn: async (updates) => {
        await delay(400);
        const updated = mockStateManager.updateDriver(updates);
        return mockSuccess(updated);
      },
      // query: (updates) => ({
      //   url: "/driver/profile",
      //   method: "PUT",
      //   data: updates,
      // }),
      // transformResponse: (response: any) => {
      //   return { data: response.data };
      // },
      invalidatesTags: ["Driver"],
    }),

    setDriverOnlineStatus: builder.mutation<{ data: Driver }, boolean>({
      queryFn: async (isOnline) => {
        await delay(400);
        const updated = mockStateManager.setOnlineStatus(isOnline);
        return mockSuccess(updated);
      },
      // query: (isOnline) => ({
      //   url: "/driver/online-status",
      //   method: "PUT",
      //   data: { isOnline },
      // }),
      // transformResponse: (response: any) => {
      //   return { data: response.data };
      // },
      invalidatesTags: ["Driver", "DriverStatus"],
    }),

    acceptRideRequest: builder.mutation<{ data: CurrentRide }, string>({
      queryFn: async (requestId) => {
        await delay(400);
        const ride = mockStateManager.acceptRideRequest(requestId);
        if (!ride) {
          return {
            error: {
              status: 404,
              data: { message: "Request not found" },
            },
          };
        }
        return mockSuccess(ride);
      },
      // query: (requestId) => ({
      //   url: `/driver/ride-requests/${requestId}/accept`,
      //   method: "POST",
      // }),
      // transformResponse: (response: any) => {
      //   return { data: response.data };
      // },
      invalidatesTags: ["RideRequests", "CurrentRide"],
    }),

    rejectRideRequest: builder.mutation<
      { data: any },
      { requestId: string; reason?: string }
    >({
      queryFn: async ({ requestId, reason }) => {
        await delay(400);
        const rejected = mockStateManager.rejectRideRequest(requestId);
        if (!rejected) {
          return {
            error: {
              status: 404,
              data: { message: "Request not found" },
            },
          };
        }
        return mockSuccess({ rejected: true });
      },
      // query: ({ requestId, reason }) => ({
      //   url: `/driver/ride-requests/${requestId}/reject`,
      //   method: "POST",
      //   data: { reason },
      // }),
      // transformResponse: (response: any) => {
      //   return { data: response.data };
      // },
      invalidatesTags: ["RideRequests"],
    }),

    updateRideStatus: builder.mutation<
      { data: CurrentRide },
      {
        rideId: string;
        status:
          | "accepted"
          | "pickup"
          | "ongoing"
          | "completed"
          | "cancelled"
          | "rejected";
      }
    >({
      queryFn: async ({ rideId, status }) => {
        await delay(400);
        const updated = mockStateManager.updateRideStatus(rideId, status);
        if (!updated) {
          return {
            error: {
              status: 404,
              data: { message: "Ride not found" },
            },
          };
        }
        return mockSuccess(updated);
      },
      // query: ({ rideId, status }) => ({
      //   url: `/driver/ride/${rideId}/status`,
      //   method: "PUT",
      //   data: { status },
      // }),
      // transformResponse: (response: any) => {
      //   return { data: response.data };
      // },
      invalidatesTags: ["CurrentRide"],
    }),

    endRide: builder.mutation<{ data: CurrentRide }, string>({
      query: (rideId) => ({
        url: `/driver/ride/${rideId}/complete`,
        method: "POST",
      }),
      transformResponse: (response: any) => {
        return { data: response.data };
      },
      invalidatesTags: ["CurrentRide"],
    }),
  }),
});

export const {
  useGetDriverProfileQuery,
  useGetDriverStatusQuery,
  useGetDriverStatsQuery,
  useGetPendingRequestsQuery,
  useGetCurrentRideQuery,
  useUpdateDriverProfileMutation,
  useSetDriverOnlineStatusMutation,
  useAcceptRideRequestMutation,
  useRejectRideRequestMutation,
  useUpdateRideStatusMutation,
  useEndRideMutation,
} = driverApi;
