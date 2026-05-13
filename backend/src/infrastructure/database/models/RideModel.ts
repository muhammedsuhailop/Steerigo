import { BookingType } from "@domain/value-objects/BookingType";
import { CouponDiscountType } from "@domain/value-objects/CouponDiscountType";
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
      latitude: { type: Number, required: true },
      longitude: { type: Number, required: true },
      address: { type: String },
    },

    drop: {
      latitude: { type: Number, required: true },
      longitude: { type: Number, required: true },
      address: { type: String },
    },

    timeRequired: {
      type: Number,
      min: 1,
      max: 12,
    },

    rideType: { type: String, enum: RideType, required: true },
    bookingType: {
      type: String,
      enum: BookingType,
      default: BookingType.INSTANT,
    },

    fareBreakdown: {
      baseFare: { type: Number, default: 0 },
      timeFare: { type: Number, default: 0 },
      platformFee: { type: Number, default: 0 },
      tax: { type: Number, default: 0 },
      surgeMultiplier: { type: Number, default: 1 },
      totalFare: { type: Number, default: 0 },
    },

    currency: { type: String, default: "INR" },

    timeline: {
      requestedAt: { type: Date, default: Date.now },
      acceptedAt: Date,
      arrivedAt: Date,
      startedAt: Date,
      completedAt: Date,
      cancelledAt: Date,
      rejectedAt: Date,
      paymentInitiatedAt: Date,
      paymentCompletedAt: Date,
      paymentFailedAt: Date,
      paymentRefundedAt: Date,
    },

    coupon: {
      couponId: { type: Schema.Types.ObjectId },
      code: { type: String },
      discountAmount: { type: Number },
      discountType: { type: String },
    },

    rating: Number,
    feedback: String,
  },
  { timestamps: true },
);

export const RideModel: Model<IRideDocument> = model("Ride", rideSchema);
