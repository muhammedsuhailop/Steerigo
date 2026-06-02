import { CouponQueryOptions, ICouponRepository, PaginatedCoupons } from "@domain/repositories/ICouponRepository";
import { Coupon } from "@domain/entities/Coupon";
export declare class CouponRepositoryImpl implements ICouponRepository {
    findById(id: string): Promise<Coupon | null>;
    findByCode(code: string): Promise<Coupon | null>;
    exists(id: string): Promise<boolean>;
    save(coupon: Coupon): Promise<Coupon>;
    findAll(options: CouponQueryOptions): Promise<PaginatedCoupons>;
}
//# sourceMappingURL=CouponRepositoryImpl.d.ts.map