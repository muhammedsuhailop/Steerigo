export enum ReviewType {
  USER_REVIEW = "User Review",
  DRIVER_REVIEW = "Driver Review",
}

export interface Money {
  amount: number;
  currency: string;
}

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

export interface RatingDetails {
  overallRating: number;

  reviewType: ReviewType;

  criteria: Record<string, number>;

  review?: string;

  reviewerName?: string;

  createdAt: string;
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
  paymentStatus?: string;
  rideType: string;
  pickup: LocationDetails;
  drop: LocationDetails;
  distance?: number;
  duration?: number;
  fare: FareDetails;
  timeline: TimelineDetails;
  couponDetails?: {
    couponCode: string;
    discountType: string;
    discountAmount: number;
  };
  rating?: RatingDetails;
  createdAt: string;
  updatedAt: string;
}

export interface GetAdminRideByIdResponse {
  success: boolean;
  message: string;
  data: {
    ride: RideDetails;
    rider: RiderDetails;
  };
}
