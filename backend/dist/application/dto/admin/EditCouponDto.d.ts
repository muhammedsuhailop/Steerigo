import { CouponDiscountType } from "../../../domain/value-objects/CouponDiscountType";
export declare class EditCouponDto {
    readonly couponId: string;
    readonly discountType?: CouponDiscountType;
    readonly discountValue?: number;
    readonly maxDiscount?: number | null;
    readonly minRideAmount?: number | null;
    readonly usageLimit?: number | null;
    readonly usagePerUser?: number | null;
    readonly validFrom?: Date | null;
    readonly validTo?: Date | null;
    readonly isActive?: boolean;
    private constructor();
    static fromRequest(params: {
        couponId?: string;
    }, body: unknown): EditCouponDto;
    validate(): void;
}
//# sourceMappingURL=EditCouponDto.d.ts.map