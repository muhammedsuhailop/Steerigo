import { Document, Types } from "mongoose";
import { RideRequestGroupStatus } from "@domain/value-objects/RideRequestGroupStatus";
export interface IRideLocation {
    latitude: number;
    longitude: number;
    address: string;
}
export interface IRideRequestGroupDocument extends Document {
    _id: Types.ObjectId;
    riderId: Types.ObjectId;
    pickup: IRideLocation;
    drop: IRideLocation;
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
    candidateDriverIds: Types.ObjectId[];
    currentIndex: number;
    status: RideRequestGroupStatus;
    createdAt: Date;
    updatedAt: Date;
}
export declare const RideRequestGroupModel: import("mongoose").Model<IRideRequestGroupDocument, {}, {}, {}, Document<unknown, {}, IRideRequestGroupDocument, {}, {}> & IRideRequestGroupDocument & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=RideRequestGroupModel.d.ts.map