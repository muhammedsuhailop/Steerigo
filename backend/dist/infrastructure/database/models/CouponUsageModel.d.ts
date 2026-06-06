import { Document, Types } from "mongoose";
export interface ICouponUsageDocument extends Document {
    _id: Types.ObjectId;
    userId: Types.ObjectId;
    couponId: Types.ObjectId;
    rideId: string;
    discountAmount: number;
    usedAt: Date;
    createdAt: Date;
    updatedAt: Date;
}
export declare const CouponUsageModel: import("mongoose").Model<ICouponUsageDocument, {}, {}, {}, Document<unknown, {}, ICouponUsageDocument, {}, {}> & ICouponUsageDocument & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=CouponUsageModel.d.ts.map