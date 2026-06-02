import { PaymentStatus } from "../../../domain/value-objects/PaymentStatus";
import { ReviewType } from "../../../domain/value-objects/ReviewType";
export interface DriverDetails {
    driverId: string;
    userId: string;
    name: string;
    email: string;
    phoneNumber?: string;
    profilePicture?: string;
    rating?: number;
    totalRides?: number;
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
    currency: string;
    payableAmount: number;
}
export interface CouponDetails {
    couponCode: string;
    discountType: string;
    discountAmount: number;
}
export interface RatingDetails {
    overallRating: number;
    reviewType: ReviewType;
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
    verificationCode: number;
    couponDetails?: CouponDetails;
    rating?: RatingDetails;
    createdAt: string;
    updatedAt: string;
}
export interface GetUserRideByIdResponseDto {
    success: boolean;
    message: string;
    data: {
        ride: RideDetails;
        driver: DriverDetails;
    };
}
//# sourceMappingURL=GetUserRideByIdResponseDto.d.ts.map