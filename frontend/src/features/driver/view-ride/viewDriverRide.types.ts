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
