import { ICouponUsageRepository } from "../../../domain/repositories/ICouponUsageRepository";
import { CouponUsage } from "../../../domain/entities/CouponUsage";
export declare class CouponUsageRepositoryImpl implements ICouponUsageRepository {
    countByUserAndCoupon(userId: string, couponId: string): Promise<number>;
    create(usage: CouponUsage): Promise<void>;
}
//# sourceMappingURL=CouponUsageRepositoryImpl.d.ts.map