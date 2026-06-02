export interface GetUserCouponsResponseDto {
    coupons: {
        id: string;
        code: string;
        discountType: string;
        discountValue: number;
        maxDiscount?: number;
        minRideAmount?: number;
        validFrom?: string;
        validTo?: string;
        isActive: boolean;
    }[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}
//# sourceMappingURL=GetUserCouponsResponseDto.d.ts.map