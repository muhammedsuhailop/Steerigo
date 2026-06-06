export declare class CancelRideRequestDto {
    private readonly riderId;
    readonly requestGroupId: string;
    constructor(riderId: string, requestGroupId: string);
    static fromRequest(riderId: string, requestBody: unknown): CancelRideRequestDto;
    getRiderId(): string;
    validate(): void;
}
//# sourceMappingURL=CancelRideRequestDto.d.ts.map