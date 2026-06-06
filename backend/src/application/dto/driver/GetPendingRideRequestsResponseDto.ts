import { FareBreakdown } from "@domain/value-objects/FareBreakdown";

export interface PendingRideRequestData {
  requestId: string;
  riderId: string;
  pickup: {
    latitude: number;
    longitude: number;
    address?: string;
  };
  drop: {
    latitude: number;
    longitude: number;
    address?: string;
  };
  rideType: string;
  fareBreakdown: FareBreakdown;
  pickupTime: string;
  pickupETA: string;
  status: string;
  createdAt: string;
  expiresAt?: string;
}

export interface GetPendingRideRequestsResponseDto {
  requests: PendingRideRequestData[];
  total: number;
  limit: number;
  offset: number;
}
