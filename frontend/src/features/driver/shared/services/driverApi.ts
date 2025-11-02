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

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
const mockSuccess = <T>(data: T) => ({ data: { data } });

const MOCK_DRIVER: Driver = {
  id: "driver-001",
  driverId: "DRV-001",
  name: "John Doe",
  email: "john.doe@example.com",
  mobile: "+1234567890",
  profileImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
  currentStatus: "Available",
  rating: 4.7,
  totalRides: 156,
  completedRides: 148,
  scheduledRides: 3,
  totalEarnings: 4280.5,
  todayEarnings: 125.0,
  weeklyEarnings: 520.0,
  monthlyEarnings: 2100.0,
  vehicleInfo: {
    id: "vehicle-001",
    make: "Toyota",
    model: "Camry",
    year: 2022,
    color: "Silver",
    plateNumber: "ABC-1234",
    type: "sedan",
    fuelType: "hybrid",
  },
  location: {
    latitude: 40.7128,
    longitude: -74.006,
    address: "Manhattan, New York, NY",
  },
  createdAt: new Date("2024-01-15").toISOString(),
  updatedAt: new Date().toISOString(),
  userId: "user-001",
  licenseNumber: "DL123456789",
  licenceCategory: "Commercial",
  licenseIssueDate: "2020-01-15",
  licenseExpiryDate: "2025-01-15",
  kycStatus: "Approved",
  status: "Active",
  eligibleGearTypes: ["Manual", "Automatic"],
  eligibleBodyTypes: ["Sedan", "SUV"],
};

const MOCK_PENDING_REQUESTS: RideRequest[] = [
  {
    id: "req-001",
    passengerId: "user-101",
    passengerName: "Alice Smith",
    passengerPhone: "+9134567891",
    passengerRating: 4.8,
    pickupLocation: {
      address: "Times Square, New York, NY",
      latitude: 40.758,
      longitude: -73.9855,
    },
    dropoffLocation: {
      address: "Grand Central Terminal, New York, NY",
      latitude: 40.7489,
      longitude: -73.968,
    },
    estimatedFare: 15.5,
    distance: 2.3,
    estimatedDuration: 12,
    rideType: "oneway",
    requestTime: new Date().toISOString(),
    paymentMethod: "card",
  },
  {
    id: "req-002",
    passengerId: "user-102",
    passengerName: "Bob Johnson",
    passengerPhone: "+1234567892",
    passengerRating: 4.5,
    pickupLocation: {
      address: "Central Park South, New York, NY",
      latitude: 40.7614,
      longitude: -73.9776,
    },
    dropoffLocation: {
      address: "Upper East Side, New York, NY",
      latitude: 40.7812,
      longitude: -73.9665,
    },
    estimatedFare: 12.0,
    distance: 1.8,
    estimatedDuration: 8,
    rideType: "oneway",
    requestTime: new Date().toISOString(),
    paymentMethod: "cash",
  },
  {
    id: "req-003",
    passengerId: "user-103",
    passengerName: "Carol White",
    passengerPhone: "+1234567893",
    passengerRating: 4.9,
    pickupLocation: {
      address: "Brooklyn Bridge, Brooklyn, NY",
      latitude: 40.7061,
      longitude: -73.9969,
    },
    dropoffLocation: {
      address: "Wall Street, New York, NY",
      latitude: 40.7074,
      longitude: -74.0113,
    },
    estimatedFare: 18.0,
    distance: 3.2,
    estimatedDuration: 15,
    rideType: "oneway",
    requestTime: new Date().toISOString(),
    specialRequests: "Please call on arrival",
    paymentMethod: "wallet",
  },
];

let mockDriverState = { ...MOCK_DRIVER };
let mockRequestsState = [...MOCK_PENDING_REQUESTS];
let mockCurrentRideState: CurrentRide | null = null;

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
    getDriverProfile: builder.query<{ data: Driver }, void>({
      queryFn: async () => {
        await delay(400);
        return mockSuccess(mockDriverState);
      },
      // query: () => ({
      //   url: "/driver/profile",
      //   method: "GET",
      // }),
      // transformResponse: (response: any) => {
      //   return { data: response.data };
      // },
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
        return mockSuccess(mockRequestsState);
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
        if (!mockCurrentRideState) {
          return {
            error: {
              status: 404,
              data: { message: "No active ride" },
            },
          };
        }
        return mockSuccess(mockCurrentRideState);
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
        mockDriverState = {
          ...mockDriverState,
          ...updates,
          updatedAt: new Date().toISOString(),
        };
        return mockSuccess(mockDriverState);
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
        mockDriverState = {
          ...mockDriverState,
          currentStatus: isOnline ? "Available" : "Offline",
          updatedAt: new Date().toISOString(),
        };
        return mockSuccess(mockDriverState);
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
        const request = mockRequestsState.find((r) => r.id === requestId);
        if (!request) {
          return {
            error: {
              status: 404,
              data: { message: "Request not found" },
            },
          };
        }
        mockRequestsState = mockRequestsState.filter((r) => r.id !== requestId);
        mockCurrentRideState = {
          id: `ride-${Date.now()}`,
          passengerId: request.passengerId,
          passengerName: request.passengerName,
          passengerPhone: request.passengerPhone,
          passengerRating: request.passengerRating,
          pickupLocation: request.pickupLocation,
          dropoffLocation: request.dropoffLocation,
          fare: request.estimatedFare,
          distance: request.distance,
          duration: request.estimatedDuration,
          rideType: request.rideType,
          status: "accepted",
          startTime: new Date().toISOString(),
          acceptedAt: new Date().toISOString(),
          paymentMethod: request.paymentMethod,
        };
        return mockSuccess(mockCurrentRideState);
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
        const request = mockRequestsState.find((r) => r.id === requestId);
        if (!request) {
          return {
            error: {
              status: 404,
              data: { message: "Request not found" },
            },
          };
        }
        mockRequestsState = mockRequestsState.filter((r) => r.id !== requestId);
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
        if (!mockCurrentRideState) {
          return {
            error: {
              status: 404,
              data: { message: "Ride not found" },
            },
          };
        }
        mockCurrentRideState = {
          ...mockCurrentRideState,
          status: status as any,
        };
        return mockSuccess(mockCurrentRideState);
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
