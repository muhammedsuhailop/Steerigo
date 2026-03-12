import { PaymentStatus } from "@domain/value-objects/PaymentStatus";
import { RideStatus } from "@domain/value-objects/RideStatus";
import { RideType } from "@domain/value-objects/RideType";
import { Document, Schema, model, Model, Types } from "mongoose";

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
  rideType: string;
  fareBreakdown: {
    baseFare: number;
    timeFare: number;
    platformFee: number;
    tax: number;
    surgeMultiplier: number;
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
  };
  rating?: number;
  feedback?: string;
  couponName?: string;
  couponDiscountAmount?: number;
  createdAt: Date;
  updatedAt: Date;
}

const rideSchema = new Schema<IRideDocument>(
  {
    rideId: { type: String, required: true, unique: true, index: true },
    driverId: {
      type: Schema.Types.ObjectId,
      ref: "Driver",
      required: true,
      index: true,
    },
    riderId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(RideStatus),
      default: RideStatus.REQUESTED,
      index: true,
    },
    paymentStatus: {
      type: String,
      enum: PaymentStatus,
      default: PaymentStatus.PENDING,
      index: true,
    },
    pickup: {
      latitude: { type: Number, required: true, min: -90, max: 90 },
      longitude: { type: Number, required: true, min: -180, max: 180 },
      address: { type: String, trim: true },
    },
    drop: {
      latitude: { type: Number, required: true, min: -90, max: 90 },
      longitude: { type: Number, required: true, min: -180, max: 180 },
      address: { type: String, trim: true },
    },
    rideType: { type: String, enum: RideType, required: true },
    fareBreakdown: {
      baseFare: { type: Number, required: true, min: 0, default: 0 },
      timeFare: { type: Number, required: true, min: 0, default: 0 },
      platformFee: { type: Number, required: true, min: 0, default: 0 },
      tax: { type: Number, required: true, min: 0, default: 0 },
      surgeMultiplier: { type: Number, default: 1, min: 1 },
    },
    currency: { type: String, default: "INR" },
    timeline: {
      requestedAt: { type: Date, required: true, default: Date.now },
      acceptedAt: { type: Date },
      arrivedAt: { type: Date },
      startedAt: { type: Date },
      completedAt: { type: Date },
      cancelledAt: { type: Date },
      rejectedAt: { type: Date },
      paymentInitiatedAt: { type: Date },
      paymentCompletedAt: { type: Date },
    },
    couponName: { type: String, trim: true },
    couponDiscountAmount: { type: Number, default: 0, min: 0 },
    rating: { type: Number, min: 1, max: 5 },
    feedback: { type: String, maxlength: 1000 },
  },
  { timestamps: true },
);

rideSchema.index({ driverId: 1, status: 1 });
rideSchema.index({ riderId: 1, status: 1 });
rideSchema.index({ createdAt: -1 });
rideSchema.index({ "timeline.requestedAt": -1 });
rideSchema.index({ "timeline.acceptedAt": -1 });
rideSchema.index({ "timeline.arrivedAt": -1 });
rideSchema.index({ "timeline.completedAt": -1 });

export const RideModel: Model<IRideDocument> = model<IRideDocument>(
  "Ride",
  rideSchema,
);
