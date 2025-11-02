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

// MOCK DATA - For Dev
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
  userId: "",
  licenseNumber: "",
  licenceCategory: "",
  licenseIssueDate: "",
  licenseExpiryDate: "",
  kycStatus: "",
  status: "",
  eligibleGearTypes: [],
  eligibleBodyTypes: []
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

// Mock state management
let mockDriverState = { ...MOCK_DRIVER };
let mockRequestsState = [...MOCK_PENDING_REQUESTS];
let mockCurrentRideState: CurrentRide | null = null;



// API CONFIGURATION
export const driverApi = createApi({
  reducerPath: "driverApi",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["Driver", "DriverStats", "RideRequests", "CurrentRide"],
  endpoints: (builder) => ({
    // Driver Profile Endpoints
    getDriverProfile: builder.query<{ data: Driver }, void>({
      // Dev
      queryFn: async () => {
        await delay(300);
        return mockSuccess(mockDriverState);
      },
      // Prod
      // query: () => ({
      //   url: "/driver/profile",
      //   method: "GET",
      // }),
      providesTags: ["Driver"],
    }),

    updateDriverProfile: builder.mutation<{ data: Driver }, Partial<Driver>>({
      // Dev
      queryFn: async (updates) => {
        await delay(400);
        mockDriverState = {
          ...mockDriverState,
          ...updates,
          updatedAt: new Date().toISOString(),
        };
        console.log("Updated driver profile:", updates);
        return mockSuccess(mockDriverState);
      },
      // Prod
      // query: (updates) => ({
      //   url: "/driver/profile",
      //   method: "PUT",
      //   data: updates,
      // }),
      invalidatesTags: ["Driver"],
    }),

    // Driver Stats Endpoints - Now using real API
    getDriverStats: builder.query<{ data: FullDashboardResponse }, void>({
      query: () => ({
        url: "/driver/dashboard",
        method: "GET",
      }),

      /**
       * Transform the complete API response
       * Maps all data from DashboardApiResponse to FullDashboardResponse
       */
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

        // Transform driver data
        const transformedDriver: Driver = {
          id: driver.driverId, // Using driverId as id for consistency
          driverId: driver.driverId,
          userId: driver.userId,
          name: driver.name,
          email: driver.email.value,
          mobile: driver.mobile,
          profileImage: undefined, // Not provided in API
          currentStatus:
            availability?.status === "Available" ? "Available" : "Offline",
          rating: performance.averageRating,
          totalRides: statistics.ridesCompleted + statistics.ridesCancelled,
          completedRides: statistics.ridesCompleted,
          scheduledRides: statistics.scheduledRides,
          totalEarnings: statistics.totalEarnings,
          todayEarnings: statistics.totalEarnings, // Using total as today (API doesn't provide daily split)
          weeklyEarnings: 0, // Not provided in API response
          monthlyEarnings: 0, // Not provided in API response

          // License info from API
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

        // Transform stats data
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

        // Full response object
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

      providesTags: [ "Driver", "DriverStats"],
    }),

    // Ride Request Endpoints
    getPendingRequests: builder.query<{ data: RideRequest[] }, void>({
      // Dev
      queryFn: async () => {
        await delay(300);
        return mockSuccess(mockRequestsState);
      },
      // Prod
      // query: () => ({
      //   url: "/driver/requests/pending",
      //   method: "GET",
      // }),
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
      // Dev
      queryFn: async (requestId) => {
        await delay(500);
        const acceptedRequest = mockRequestsState.find(
          (r) => r.id === requestId
        );
        if (!acceptedRequest) {
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
          passengerId: acceptedRequest.passengerId,
          passengerName: acceptedRequest.passengerName,
          passengerPhone: acceptedRequest.passengerPhone,
          pickupLocation: acceptedRequest.pickupLocation,
          dropoffLocation: acceptedRequest.dropoffLocation,
          fare: acceptedRequest.estimatedFare,
          distance: acceptedRequest.distance,
          duration: acceptedRequest.estimatedDuration,
          status: "accepted",
          startTime: new Date().toISOString(),
          estimatedArrival: new Date(
            Date.now() + acceptedRequest.estimatedDuration * 60000
          ).toISOString(),
          paymentMethod: acceptedRequest.paymentMethod,
          paymentStatus: "pending",
        };

        console.log(
          `Accepted ride ${requestId}, remaining requests: ${mockRequestsState.length}`
        );
        return mockSuccess(mockCurrentRideState);
      },
      // Prod
      // query: (requestId) => ({
      //   url: `/driver/requests/${requestId}/accept`,
      //   method: "POST",
      // }),
      invalidatesTags: [
        { type: "RideRequests", id: "LIST" },
        { type: "CurrentRide", id: "CURRENT" },
      ],
    }),

    rejectRideRequest: builder.mutation<{ success: boolean }, string>({
      // Dev
      queryFn: async (requestId) => {
        await delay(300);
        mockRequestsState = mockRequestsState.filter((r) => r.id !== requestId);
        console.log(
          `Rejected ride ${requestId}, remaining requests: ${mockRequestsState.length}`
        );
        return { data: { success: true } };
      },
      // Prod
      // query: (requestId) => ({
      //   url: `/driver/requests/${requestId}/reject`,
      //   method: "POST",
      // }),
      invalidatesTags: [{ type: "RideRequests", id: "LIST" }],
    }),

    // Current Ride Endpoints
    getCurrentRide: builder.query<{ data: CurrentRide | null }, void>({
      // Dev
      queryFn: async () => {
        await delay(250);
        return mockSuccess(mockCurrentRideState); // Can be null
      },
      // Prod
      // query: () => ({
      //   url: "/driver/rides/current",
      //   method: "GET",
      // }),
      providesTags: [{ type: "CurrentRide", id: "CURRENT" }],
    }),

    updateRideStatus: builder.mutation<
      { data: CurrentRide },
      { rideId: string; status: CurrentRide["status"] }
    >({
      // Dev
      queryFn: async ({ rideId, status }) => {
        await delay(400);

        if (!mockCurrentRideState || mockCurrentRideState.id !== rideId) {
          return {
            error: {
              status: 404,
              data: { message: "Ride not found" },
            },
          };
        }

        mockCurrentRideState = { ...mockCurrentRideState, status };

        // Update timestamps based on status
        if (status === "pickup") {
          mockCurrentRideState.actualPickupTime = new Date().toISOString();
        } else if (status === "ongoing") {
          mockCurrentRideState.actualPickupTime =
            mockCurrentRideState.actualPickupTime || new Date().toISOString();
        } else if (status === "completed") {
          mockCurrentRideState.actualDropoffTime = new Date().toISOString();
          mockCurrentRideState.paymentStatus = "completed";

          // Update driver
          mockDriverState.completedRides += 1;
          mockDriverState.totalRides += 1;
          mockDriverState.totalEarnings += mockCurrentRideState.fare;
          mockDriverState.todayEarnings += mockCurrentRideState.fare;
          mockDriverState.weeklyEarnings += mockCurrentRideState.fare;
          mockDriverState.monthlyEarnings += mockCurrentRideState.fare;
          mockDriverState.currentStatus = "Available";

          const completedRide = { ...mockCurrentRideState };
          mockCurrentRideState = null;

          console.log(`Ride completed: ${rideId}`);
          return mockSuccess(completedRide);
        }

        console.log(`Updated ride status to: ${status}`);
        return mockSuccess(mockCurrentRideState);
      },
      // Prod
      // query: ({ rideId, status }) => ({
      //   url: `/driver/rides/${rideId}/status`,
      //   method: "PUT",
      //   data: { status },
      // }),
      invalidatesTags: [
        { type: "CurrentRide", id: "CURRENT" },
        { type: "DriverStats" },
        { type: "Driver" },
      ],
    }),

    // Driver Status Endpoints
    setDriverOnlineStatus: builder.mutation<{ success: boolean }, boolean>({
      // Dev
      queryFn: async (isOnline) => {
        await delay(200);
        mockDriverState.currentStatus = isOnline ? "Available" : "Offline";
        mockDriverState.updatedAt = new Date().toISOString();
        console.log(`📡 Driver status: ${mockDriverState.currentStatus}`);
        return { data: { success: true } };
      },
      // Prod
      // query: (isOnline) => ({
      //   url: "/driver/status",
      //   method: "PUT",
      //   data: { isOnline },
      // }),
      invalidatesTags: ["Driver"],
    }),

    updateDriverLocation: builder.mutation<
      { success: boolean },
      { latitude: number; longitude: number }
    >({
      // Dev
      queryFn: async (location) => {
        await delay(100);
        mockDriverState.location = {
          ...mockDriverState.location,
          latitude: location.latitude,
          longitude: location.longitude,
        };
        return { data: { success: true } };
      },
      // Prod
      // query: (location) => ({
      //   url: "/driver/location",
      //   method: "PUT",
      //   data: location,
      // }),
    }),
  }),
});

// Export Hooks
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
