export interface CouponData {
    couponId: string;
    code: string;
    discountType: string;
    discountValue: number;
    maxDiscount?: number;
    minRideAmount?: number;
    usageLimit?: number;
    usagePerUser?: number;
    validFrom?: string;
    validTo?: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}
export interface CreateCouponResponseDto {
    success: boolean;
    message: string;
    data: {
        coupon: CouponData;
    };
}
//# sourceMappingURL=CreateCouponResponseDto.d.ts.map