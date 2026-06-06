export declare class CouponUsage {
    private readonly id;
    private readonly userId;
    private readonly couponId;
    private readonly rideId;
    private readonly discountAmount;
    private readonly usedAt;
    private constructor();
    static create(params: {
        id: string;
        userId: string;
        couponId: string;
        rideId: string;
        discountAmount: number;
        usedAt?: Date;
    }): CouponUsage;
    static fromData(data: {
        id: string;
        userId: string;
        couponId: string;
        rideId: string;
        discountAmount: number;
        usedAt: Date;
    }): CouponUsage;
    getId(): string;
    getUserId(): string;
    getCouponId(): string;
    getRideId(): string;
    getUsedAt(): Date;
    getdiscountAmount(): number;
}
//# sourceMappingURL=CouponUsage.d.ts.map