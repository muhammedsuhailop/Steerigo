import { CouponDiscountType } from "@domain/value-objects/CouponDiscountType";
export declare class CreateCouponDto {
    readonly code: string;
    readonly discountType: CouponDiscountType;
    readonly discountValue: number;
    readonly maxDiscount?: number;
    readonly minRideAmount?: number;
    readonly usageLimit?: number;
    readonly usagePerUser?: number;
    readonly validFrom?: Date;
    readonly validTo?: Date;
    private constructor();
    static fromRequest(body: unknown): CreateCouponDto;
    validate(): void;
}
//# sourceMappingURL=CreateCouponDto.d.ts.map