import { Location, RideStatus, RideTimeline } from "@/shared/types/ride.types";
import { PaymentStatus } from "@/shared/types/payment.types";


export interface UserRide {
  id: string;
  rideId: string;
  driverId?: string;
  status: RideStatus;
  paymentStatus: PaymentStatus;
  pickup: Location;
  drop: Location;
  rideType: string;
  fare: number;
  currency: string;
  timeline: RideTimeline;
  distance?: number;
  createdAt: string;
}

export interface UserRidesFilters {
  page: number;
  limit: number;
  status?: RideStatus;
  sortBy: string;
  sortOrder: "asc" | "desc";
}

export interface UserRidesResponse {
  rides: UserRide[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
