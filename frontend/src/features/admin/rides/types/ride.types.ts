import { AdminTableRow } from "@/shared/components/ui/AdminTable/AdminTable.types";

export enum RideStatus {
  REQUESTED = "Requested",
  ACCEPTED = "Accepted",
  ARRIVED = "Arrived",
  STARTED = "Started",
  COMPLETED = "Completed",
  CANCELLED = "Cancelled",
  EXPIRED = "Expired",
}

export interface RiderDetails {
  userId: string;
  name: string;
  email: string;
  profilePicture?: string;
}

export interface DriverDetails {
  userId?: string;
  driverId?: string;
  name: string;
  email: string;
  profilePicture?: string;
}

export interface CouponDetails {
  couponCode: string;
  discountType: string;
  discountAmount: number;
}

export interface AdminRideData extends AdminTableRow {
  id: string;
  rideId: string;
  driverId: string;
  riderId: string;
  driverInfo: DriverDetails;
  riderInfo: RiderDetails;
  status: RideStatus;
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
  fare: number;
  currency: string;
  timeline: {
    requestedAt: string;
    acceptedAt?: string;
    startedAt?: string;
    completedAt?: string;
    cancelledAt?: string;
  };
  durationFormatted?: string;
  couponDetails?: CouponDetails;
  createdAt: string;
  updatedAt: string;
}

export interface AdminRideFilters {
  page: number;
  limit: number;
  sortBy: "createdAt" | "updatedAt" | "fare";
  sortOrder: "asc" | "desc";
  status?: RideStatus;
  fromDate?: string;
  toDate?: string;
  riderId?: string;
  driverId?: string;
}

export interface GetAdminRidesResponse {
  success: boolean;
  message: string;
  data: {
    rides: AdminRideData[];
    pagination: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  };
}
