import { Money } from "@domain/value-objects/Money";
import { PaymentStatus } from "@domain/value-objects/PaymentStatus";
import { ReviewType } from "@domain/value-objects/ReviewType";

export interface RiderDetails {
  id: string;
  name: string;
  email: string;
  phoneNumber?: string;
  profilePicture?: string;
}

export interface DriverDetails {
  id: string;
  userId: string;
  name: string;
  email: string;
  phoneNumber?: string;
  profilePicture?: string;
  status: string;
  kycStatus: string;
  averageRating: number;
  totalRides: number;
}

export interface LocationDetails {
  latitude: number;
  longitude: number;
  address?: string;
}

export interface FareDetails {
  baseFare: number;
  tax: {
    total: Money;
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

export interface RatingDetails {
  overallRating: number;
  reviewType: ReviewType;
  criteria: Record<string, number>;
  review?: string;
  reviewerName?: string;
  createdAt: string;
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
  rating?: RatingDetails;
  createdAt: string;
  updatedAt: string;
}

export interface GetAdminRideByIdResponseDto {
  ride: RideDetails;
  rider: RiderDetails;
  driver: DriverDetails;
}
