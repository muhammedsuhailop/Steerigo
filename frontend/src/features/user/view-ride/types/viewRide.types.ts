import { PaymentMethod, PaymentStatus } from "@/shared/types/payment.types";
import { Location, RideStatus, RideTimeline } from "@/shared/types/ride.types";

export interface FareDetails {
  baseFare: number;
  tax: {
    total: number;
  };
  platformFee: number;
  totalFare: number;
  currency: string;
  payableAmount: number;
}

export interface CouponDetails {
  couponCode: string;
  discountType: string;
  discountAmount: number;
}

export interface DriverInfo {
  driverId: string;
  userId: string;
  name: string;
  email: string;
  phoneNumber: string;
  profilePicture: string;
  rating?: number;
  totalRides?: number;
}

export interface RideDetails {
  id: string;
  rideId: string;
  status: RideStatus;
  paymentStatus?: PaymentStatus;
  rideType: string;
  pickup: Location;
  drop: Location;
  distance: number;
  fare: FareDetails;
  timeline: RideTimeline;
  couponDetails?: CouponDetails;
  duration?: number;
  rating?: RatingDetails;
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

export interface InitiatePaymentRequest {
  rideId: string;
  method: PaymentMethod.ONLINE;
}

export interface InitiatePaymentResponse {
  success: boolean;
  message: string;
  method: string;
  data: {
    paymentId: string;
    gatewayOrderId: string;
    amount: number;
    currency: string;
    gateway: string;
  };
}

export interface VerifyPaymentRequest {
  paymentId: string;
  gatewayPaymentId: string;
  gatewayOrderId: string;
  gatewaySignature: string;
}

export interface VerifyPaymentResponse {
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

export interface CouponResponse {
  success: boolean;
  message: string;
  data: {
    rideId: string;
    couponCode?: string;
    discountType?: string;
    originalFare: number;
    discountAmount: number;
    payableAmount: number;
    currency: string;
    message: string;
  };
}

export interface RideRatingCriteria {
  Behavior: number;
  Punctuality: number;
  Safety: number;
  Comfort: number;
  Communication: number;
}

export interface RideRating {
  criteria: RideRatingCriteria;
  review?: string;
  createdAt?: string;
}

export interface RatingRequest {
  rideId: string;
  criteria: RideRatingCriteria;
  review?: string;
}

export interface RatingDetails {
  overallRating: number;
  reviewType: string;
  review?: string;
  reviewerName?: string;
  createdAt: string;
}

export interface RateDriverResponseData {
  rideId: string;
  driverId: string;
  ratingId: string;
  overallRating: number;
  driver: {
    driverId: string;
    averageRating: number;
    numberOfRatings: number;
  };
}

export interface RateDriverResponse {
  success: boolean;
  message: string;
  data: RateDriverResponseData;
}

export interface LocationUpdatePayload {
  rideId: string;
  lat: number;
  lng: number;
  bearing?: number;
}

export interface AvailableCoupon {
  id: string;
  code: string;
  discountType: string;
  discountValue: number;
  maxDiscount?: number;
  minRideAmount?: number;
  validFrom?: string;
  validTo?: string;
  isActive: boolean;
}

export interface GetUserCouponsResponse {
  success: boolean;
  message: string;
  data: {
    coupons: AvailableCoupon[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
