import { Schema, model, Document, Types } from "mongoose";

export interface ICouponUsageDocument extends Document {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  couponId: Types.ObjectId;
  rideId: Types.ObjectId;
  discountAmount: number;
  usedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const couponUsageSchema = new Schema<ICouponUsageDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      index: true,
    },
    couponId: {
      type: Schema.Types.ObjectId,
      required: true,
      index: true,
    },
    rideId: {
      type: Schema.Types.ObjectId,
      required: true,
      index: true,
    },
    discountAmount: {
      type: Number,
      required: true,
    },
    usedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true },
);

couponUsageSchema.index({ userId: 1, couponId: 1 });
couponUsageSchema.index(
  { userId: 1, couponId: 1, rideId: 1 },
  { unique: true },
);

export const CouponUsageModel = model<ICouponUsageDocument>(
  "CouponUsage",
  couponUsageSchema,
);
