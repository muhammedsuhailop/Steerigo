export declare class ApplyCouponDto {
    private readonly riderId;
    readonly rideId: string;
    readonly couponCode: string;
    private constructor();
    static fromRequest(riderId: string, params: {
        rideId?: string;
    }, body: unknown): ApplyCouponDto;
    getRiderId(): string;
    validate(): void;
}
//# sourceMappingURL=ApplyCouponDto.d.ts.map