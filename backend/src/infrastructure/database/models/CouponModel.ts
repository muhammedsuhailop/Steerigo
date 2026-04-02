import { Document, Schema, model, Model, Types } from "mongoose";
import { CouponDiscountType } from "@domain/value-objects/CouponDiscountType";

export interface ICouponDocument extends Document {
  _id: Types.ObjectId;
  code: string;
  discountType: string;
  discountValue: number;
  maxDiscount?: number;
  minRideAmount?: number;
  usageLimit?: number;
  usagePerUser?: number;
  validFrom?: Date;
  validTo?: Date;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const couponSchema = new Schema<ICouponDocument>(
  {
    code: { type: String, required: true, unique: true, index: true },
    discountType: {
      type: String,
      enum: Object.values(CouponDiscountType),
      required: true,
    },
    discountValue: { type: Number, required: true, min: 0 },

    maxDiscount: { type: Number, min: 0 },
    minRideAmount: { type: Number, min: 0 },

    usageLimit: { type: Number, min: 0 },
    usagePerUser: { type: Number, min: 0 },

    validFrom: { type: Date },
    validTo: { type: Date },

    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

couponSchema.index({ isActive: 1 });
couponSchema.index({ validFrom: 1, validTo: 1 });

export const CouponModel: Model<ICouponDocument> = model<ICouponDocument>(
  "Coupon",
  couponSchema,
);
