import { PaymentStatus } from "@domain/value-objects/PaymentStatus";

export interface RiderDetails {
  id: string;
  name: string;
  email: string;
  phoneNumber?: string;
  profilePicture?: string;
}

export interface LocationDetails {
  latitude: number;
  longitude: number;
  address?: string;
}

export interface FareDetails {
  baseFare: number;
  tax: {
    total: number;
  };
  platformFee: number;
  totalFare: number;
  payableAmount: number;
  currency: string;
}

export interface CouponDetails {
  couponCode: string;
  discountType: string;
  discountAmount: number;
}

export interface TimelineDetails {
  requestedAt: string;
  acceptedAt?: string;
  arrivedAt?: string;
  startedAt?: string;
  completedAt?: string;
  cancelledAt?: string;
  rejectedAt?: string;
  paymentInitiatedAt?: string;
  paymentCompletedAt?: string;
  paymentFailedAt?: string;
  paymentRefundedAt?: string;
}

export interface RideDetails {
  id: string;
  rideId: string;
  status: string;
  paymentStatus?: PaymentStatus;
  rideType: string;
  pickup: LocationDetails;
  drop: LocationDetails;
  distance?: number;
  duration?: number;
  fare: FareDetails;
  timeline: TimelineDetails;
  couponDetails?: CouponDetails;
  createdAt: string;
  updatedAt: string;
}

export interface GetDriverRideByIdResponseDto {
  success: boolean;
  message: string;
  data: {
    ride: RideDetails;
    rider: RiderDetails;
  };
}
