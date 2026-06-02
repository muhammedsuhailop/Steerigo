export declare class RemoveCouponDto {
    private readonly riderId;
    readonly rideId: string;
    private constructor();
    static fromRequest(riderId: string, params: {
        rideId?: string;
    }): RemoveCouponDto;
    getRiderId(): string;
    validate(): void;
}
//# sourceMappingURL=RemoveCouponDto.d.ts.map