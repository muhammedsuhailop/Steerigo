import { Document, Model, Types } from "mongoose";
export interface IPaymentDocument extends Document {
    _id: Types.ObjectId;
    paymentId: string;
    rideId: string;
    riderId: Types.ObjectId;
    driverId?: Types.ObjectId;
    amount: number;
    refundedAmount: number;
    currency: string;
    method: string;
    status: string;
    paymentIntentId?: string;
    gateway?: string;
    gatewayOrderId?: string;
    gatewayPaymentId?: string;
    gatewaySignature?: string;
    failureReason?: string;
    metadata?: Record<string, string>;
    paidAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}
export declare const PaymentModel: Model<IPaymentDocument>;
//# sourceMappingURL=PaymentModel.d.ts.map