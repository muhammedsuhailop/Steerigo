import { Document, Model, Types } from "mongoose";
export interface IRideRequestDocument extends Document {
    _id: Types.ObjectId;
    driverId: Types.ObjectId;
    driverUserId: Types.ObjectId;
    requestGroupId: string;
    riderId: Types.ObjectId;
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
    pickupTime: Date;
    timeRequired: number;
    rideType: string;
    fareBreakdown: {
        baseFare: {
            amount: number;
            currency: string;
        };
        platformFee: {
            amount: number;
            currency: string;
        };
        taxes: {
            fare: {
                name: string;
                rate: number;
                amount: {
                    amount: number;
                    currency: string;
                };
            };
            platformFee: {
                name: string;
                rate: number;
                amount: {
                    amount: number;
                    currency: string;
                };
            };
        };
        totalFare: {
            amount: number;
            currency: string;
        };
        durationHours: number;
        calculatedAt: Date;
    };
    status: string;
    pickupETA: string;
    createdAt: Date;
    updatedAt: Date;
    expiresAt?: Date;
}
export declare const RideRequestModel: Model<IRideRequestDocument>;
//# sourceMappingURL=RideRequestModel.d.ts.map