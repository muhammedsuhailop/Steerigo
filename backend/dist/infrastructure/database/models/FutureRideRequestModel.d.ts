import { Document, Model, Types } from "mongoose";
export interface IFutureRideRequestDocument extends Document {
    _id: Types.ObjectId;
    riderId: Types.ObjectId;
    driverId?: Types.ObjectId | null;
    driverUserId?: Types.ObjectId | null;
    requestGroupId: string;
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
    requiredDuration: number;
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
}
export declare const FutureRideRequestModel: Model<IFutureRideRequestDocument>;
//# sourceMappingURL=FutureRideRequestModel.d.ts.map