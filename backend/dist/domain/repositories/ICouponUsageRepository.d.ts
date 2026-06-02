import { CouponUsage } from "@domain/entities/CouponUsage";
export interface ICouponUsageRepository {
    countByUserAndCoupon(userId: string, couponId: string): Promise<number>;
    create(usage: CouponUsage): Promise<void>;
}
//# sourceMappingURL=ICouponUsageRepository.d.ts.map