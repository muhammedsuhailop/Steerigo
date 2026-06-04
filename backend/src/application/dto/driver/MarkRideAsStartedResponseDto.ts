import { RideStatus } from "@domain/value-objects/RideStatus";

export interface MarkRideAsStartedResponseDto {
  rideId: string;
  status: RideStatus;
  arrivedAt: string;
  startedAt: string;
  wasArrivedAutoSet: boolean;
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
  riderId: string;
  driverId: string;
}
