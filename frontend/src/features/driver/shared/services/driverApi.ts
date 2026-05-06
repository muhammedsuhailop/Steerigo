import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "@/shared/utils/axiosBaseQuery";
import type {
  Driver,
  DriverStats,
  DashboardApiResponse,
  FullDashboardResponse,
} from "../types/driver.types";
import type { DriverStatusResponse } from "../../scheduling/types/scheduling.types";
import {
  DriverProfile,
  DriverProfileResponse,
} from "../../profile/types/driverProfile.types";
import { API_ENDPOINTS } from "@/shared/constants/api";

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export const driverApi = createApi({
  reducerPath: "driverApi",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["Driver", "DriverStats", "RideRequests", "DriverStatus"],
  endpoints: (builder) => ({
    getDriverProfile: builder.query<DriverProfileResponse, void>({
      query: () => ({
        url: API_ENDPOINTS.DRIVER.PROFILE,
        method: "GET",
        skipErrorHandling: true,
      }),
      transformResponse: (response: ApiResponse<DriverProfile>) => {
        return response.data;
      },
      providesTags: ["Driver"],
    }),

    getDriverStatus: builder.query<DriverStatusResponse, void>({
      query: () => ({
        url: API_ENDPOINTS.DRIVER.STATUS,
        method: "GET",
      }),
      transformResponse: (response: DriverStatusResponse) => {
        return response;
      },
      providesTags: ["DriverStatus"],
    }),

    getDriverStats: builder.query<{ data: FullDashboardResponse }, void>({
      query: () => ({
        url: API_ENDPOINTS.DRIVER.DASHBOARD,
        method: "GET",
        skipErrorHandling: true,
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
          ...driver,
          id: driver.driverId,
          profileImageUrl: driver.profileImageUrl,
          email: driver.email || { value: "" },
          currentStatus:
            availability?.status === "Available" ? "Available" : "Offline",
          rating: performance.averageRating,
          totalRides: statistics.ridesCompleted + statistics.ridesCancelled,
          completedRides: statistics.ridesCompleted,
          scheduledRides: statistics.scheduledRides,
          totalEarnings: statistics.totalEarnings,
          todayEarnings: statistics.totalEarnings, // Using total as today
          weeklyEarnings: 0, // Not provided by backend
          monthlyEarnings: 0, // Not provided by backend
          location: availability?.currentLocation || {
            latitude: 0,
            longitude: 0,
            address: "Location not available",
          },
          createdAt: meta.lastUpdated,
          updatedAt: meta.lastUpdated,
        };

        // Transform stats data
        const transformedStats: DriverStats = {
          totalRides: statistics.ridesCompleted + statistics.ridesCancelled,
          ridesCompleted: statistics.ridesCompleted,
          ridesCancelled: statistics.ridesCancelled,
          scheduledRides: statistics.scheduledRides,
          todayEarnings: statistics.totalEarnings,
          weeklyEarnings: 0,
          monthlyEarnings: 0,
          totalEarnings: statistics.totalEarnings,
          currency: statistics.currency,
          rating: performance.averageRating,
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
  }),
});

export const {
  useGetDriverProfileQuery,
  useGetDriverStatusQuery,
  useGetDriverStatsQuery,
} = driverApi;
