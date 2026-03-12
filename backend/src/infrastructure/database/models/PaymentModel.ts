import { Document, Schema, model, Model, Types } from "mongoose";
import { PaymentStatus } from "@domain/value-objects/PaymentStatus";
import { PaymentMethod } from "@domain/value-objects/PaymentMethod";

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

const paymentSchema = new Schema<IPaymentDocument>(
  {
    paymentId: { type: String, required: true, unique: true, index: true },
    rideId: { type: String, required: true, index: true },
    riderId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    driverId: { type: Schema.Types.ObjectId, ref: "Driver" },

    amount: { type: Number, required: true, min: 0 },
    refundedAmount: { type: Number, required: true, min: 0, default: 0 },
    currency: { type: String, required: true, default: "INR" },

    method: {
      type: String,
      enum: Object.values(PaymentMethod),
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(PaymentStatus),
      required: true,
      index: true,
    },

    paymentIntentId: { type: String },
    gateway: { type: String },
    gatewayOrderId: { type: String },
    gatewayPaymentId: { type: String },
    gatewaySignature: { type: String },

    failureReason: { type: String },
    metadata: { type: Schema.Types.Mixed },
    paidAt: { type: Date },
  },
  { timestamps: true },
);

paymentSchema.index({ rideId: 1 });
paymentSchema.index({ riderId: 1 });
paymentSchema.index({ driverId: 1 });

export const PaymentModel: Model<IPaymentDocument> = model<IPaymentDocument>(
  "Payment",
  paymentSchema,
);
