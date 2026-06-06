import { Coupon } from "../../../domain/entities/Coupon";
import { ICouponDocument } from "../models/CouponModel";
export declare class CouponMapper {
    static toDomain(doc: ICouponDocument): Coupon;
    static toPersistence(entity: Coupon): Partial<ICouponDocument>;
}
//# sourceMappingURL=CouponMapper.d.ts.map