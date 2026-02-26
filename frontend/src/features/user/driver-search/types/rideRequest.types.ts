import type { Location, EstimatedFare } from "./driverSearch.types";

export interface RideRequestPayload {
  driverId: string;
  pickup: Location;
  drop: Location;
  pickupTime: string; // ISO 8601 format
  rideType: "One Way" | "Round Trip";
  fareBreakdown: EstimatedFare;
  pickupETA: string;
  requestGroupId: string;
}

export interface RideRequestResponse {
  success: boolean;
  message: string;
  data: {
    requestId: string;
    status: "pending" | "accepted" | "rejected";
    driverId: string;
    riderId: string;
    pickup: Location;
    drop: Location;
    pickupTime: string;
    rideType: string;
    fareBreakdown: EstimatedFare;
    createdAt: string;
  };
}

export interface RideRequestError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}

export interface AutoRideRequestPayload {
  latitude: number;
  longitude: number;
  pickupAddress: string;
  dropAddress: string;
  searchDate: string;
  timeRequired: number;
  radiusKm: number;
  gearType: string;
  bodyType: string;
  dropLatitude: number;
  dropLongitude: number;
  rideType: "One Way" | "Round Trip";
  requestGroupId: string;
}

export interface SuccessfulAutoRequest {
  requestId: string;
  driverId: string;
  driverName: string;
  pickupETA: string;
  totalFare: number;
  currency: string;
}

export interface AutoRideRequestResponse {
  success: boolean;
  message: string;
  requestGroupId: string;
  data: {
    successfulRequests: SuccessfulAutoRequest[];
    failedRequests: unknown[];
    summary: {
      totalDriversFound: number;
      successCount: number;
      failureCount: number;
      searchedAt: string;
    };
  };
}

export interface CancelRideRequestPayload {
  requestGroupId: string;
}

export interface CancelRideRequestResponse {
  requestGroupId: string;
  cancelledCount: number;
  message: string;
}

export const RIDE_REQUEST_ERROR_CODES = {
  DRIVER_NOT_FOUND: "DRIVER_NOT_FOUND",
  DRIVER_NOT_AVAILABLE: "DRIVER_NOT_AVAILABLE",
  USER_NOT_FOUND: "USER_NOT_FOUND",
  INVALID_FARE: "INVALID_FARE",
  INVALID_PICKUP_TIME: "INVALID_PICKUP_TIME",
  DUPLICATE_RIDE_REQUEST: "DUPLICATE_RIDE_REQUEST",
  RIDE_REQUEST_CREATION_FAILED: "RIDE_REQUEST_CREATION_FAILED",
  INVALID_LOCATION: "INVALID_LOCATION",
  INVALID_RIDE_TYPE: "INVALID_RIDE_TYPE",
  NETWORK_ERROR: "NETWORK_ERROR",
  UNKNOWN_ERROR: "UNKNOWN_ERROR",
} as const;

export type RideRequestErrorCode =
  (typeof RIDE_REQUEST_ERROR_CODES)[keyof typeof RIDE_REQUEST_ERROR_CODES];
