import { FareDetails } from "@/features/user/view-ride/types/viewRide.types";
import { PaymentStatus } from "@/shared/types/payment.types";
import { Location, RideStatus, RideTimeline } from "@/shared/types/ride.types";

export interface RiderInfo {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  profilePicture: string;
}

export interface DriverRideDetails {
  id: string;
  rideId: string;
  driverId: string;
  status: RideStatus;
  paymentStatus: PaymentStatus;
  rideType: string;
  pickup: Location;
  drop: Location;
  distance: number;
  fare: FareDetails;
  timeline: RideTimeline;
  createdAt: string;
  updatedAt: string;
  couponDetails?: CouponDetails;
  duration?: number;
  rating?: RatingDetails;
}

export interface ViewDriverRideResponse {
  success: boolean;
  message: string;
  data: {
    ride: DriverRideDetails;
    rider: RiderInfo;
  };
}

export interface ViewDriverRideState {
  activeRide: DriverRideDetails | null;
  activeRider: RiderInfo | null;
  isLoading: boolean;
  error: string | null;
}

export interface RideStatusResponse {
  success: boolean;
  message: string;
  data: Record<string, unknown>;
}

export interface ConfirmCashRequest {
  rideId: string;
  method: "CASH";
  amount: number;
}

export interface ConfirmCashPaymentResponse {
  success: boolean;
  message: string;
  data: {
    paymentId: string;
    rideId: string;
    status: PaymentStatus;
    paidAt: string;
    amount: number;
    currency: string;
  };
}

export interface CouponDetails {
  couponCode: string;
  discountType: string;
  discountAmount: number;
}

export interface RatingDetails {
  overallRating: number;
  reviewType: string;
  criteria: Record<string, number>;
  review?: string;
  reviewerName?: string;
  createdAt: string;
}

export interface UpdateCurrentLocationRequest {
  driverId: string;
  currentLocation: {
    latitude: number;
    longitude: number;
    address: string;
  };
}

export interface UpdateCurrentLocationResponse {
  success: boolean;
  message: string;
  data?: {
    availabilityId: string;
    driverId: string;
    currentLocation: {
      latitude: number;
      longitude: number;
      address: string;
    };
    updatedAt: string;
  };
}
