import { Types } from "mongoose";
import { ICouponUsageDocument } from "../models/CouponUsageModel";
import { CouponUsage } from "../../../domain/entities/CouponUsage";
export declare class CouponUsageMapper {
    static toDomain(doc: ICouponUsageDocument): CouponUsage;
    static toPersistence(entity: CouponUsage): {
        userId: Types.ObjectId;
        couponId: Types.ObjectId;
        rideId: string;
        discountAmount: number;
        usedAt: Date;
    };
}
//# sourceMappingURL=CouponUsageMapper.d.ts.map