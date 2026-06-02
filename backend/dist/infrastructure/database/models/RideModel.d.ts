import { BookingType } from "@domain/value-objects/BookingType";
import { CouponDiscountType } from "@domain/value-objects/CouponDiscountType";
import { Document, Model, Types } from "mongoose";
export interface IRideDocument extends Document {
    _id: Types.ObjectId;
    rideId: string;
    driverId: Types.ObjectId;
    riderId: Types.ObjectId;
    status: string;
    paymentStatus: string;
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
    requestedPickupTime: Date;
    timeRequired: number;
    rideType: string;
    bookingType: BookingType;
    fareBreakdown: {
        baseFare: number;
        timeFare: number;
        platformFee: number;
        tax: number;
        surgeMultiplier: number;
        totalFare: number;
    };
    currency: string;
    timeline: {
        requestedAt: Date;
        acceptedAt?: Date;
        arrivedAt?: Date;
        startedAt?: Date;
        completedAt?: Date;
        cancelledAt?: Date;
        rejectedAt?: Date;
        paymentInitiatedAt?: Date;
        paymentCompletedAt?: Date;
        paymentFailedAt?: Date;
        paymentRefundedAt?: Date;
    };
    verificationCode: number;
    coupon?: {
        couponId: Types.ObjectId;
        code: string;
        discountAmount: number;
        discountType: CouponDiscountType;
    } | null;
    rating?: number;
    feedback?: string;
    createdAt: Date;
    updatedAt: Date;
}
export declare const RideModel: Model<IRideDocument>;
//# sourceMappingURL=RideModel.d.ts.map