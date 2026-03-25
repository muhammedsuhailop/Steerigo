import { PaymentStatus } from "@/shared/types/payment.types";
import { Location, RideStatus, RideTimeline } from "@/shared/types/ride.types";

export interface Ride {
  id: string;
  rideId: string;
  riderId: string;
  status: RideStatus;
  pickup: Location;
  drop: Location;
  rideType: string;
  fare: number;
  currency: string;
  paymentStatus: PaymentStatus;
  timeline: RideTimeline;
  createdAt: string;
  updatedAt: string;
}

export interface RidesFilters {
  page: number;
  limit: number;
  sortBy: "createdAt" | "updatedAt" | "status";
  sortOrder: "asc" | "desc";
  status?: RideStatus;
  fromDate?: string;
  toDate?: string;
}

export interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface DriverRidesResponse {
  rides: Ride[];
  pagination: Pagination;
}
