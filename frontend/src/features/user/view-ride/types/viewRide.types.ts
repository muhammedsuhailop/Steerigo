import { Location, RideStatus } from "@/shared/types/ride.types";

export interface FareDetails {
  baseFare: number;
  tax: {
    total: number;
  };
  platformFee: number;
  totalFare: number;
  currency: string;
}

export interface RideTimeline {
  requestedAt: string;
  acceptedAt?: string;
  arrivedAt?: string;
  startedAt?: string;
  completedAt?: string;
}

export interface DriverInfo {
  driverId: string;
  userId: string;
  name: string;
  email: string;
  phoneNumber: string;
  profilePicture: string;
}

export interface RideDetails {
  id: string;
  rideId: string;
  status: RideStatus;
  rideType: string;
  pickup: Location;
  drop: Location;
  distance: number;
  fare: FareDetails;
  timeline: RideTimeline;
  createdAt: string;
  updatedAt: string;
}

export interface ViewRideResponse {
  success: boolean;
  message: string;
  data: {
    ride: RideDetails;
    driver: DriverInfo | null;
  };
}

export interface ViewRideState {
  activeRide: RideDetails | null;
  activeDriver: DriverInfo | null;
  isLoading: boolean;
  error: string | null;
}
