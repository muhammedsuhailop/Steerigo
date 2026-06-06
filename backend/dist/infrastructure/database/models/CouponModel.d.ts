import { Document, Model, Types } from "mongoose";
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
export declare const CouponModel: Model<ICouponDocument>;
//# sourceMappingURL=CouponModel.d.ts.map