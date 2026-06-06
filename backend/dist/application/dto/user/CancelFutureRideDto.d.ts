export declare class CancelFutureRideDto {
    private readonly riderId;
    readonly requestGroupId: string;
    constructor(riderId: string, requestGroupId: string);
    static fromRequest(riderId: string, requestBody: unknown): CancelFutureRideDto;
    getRiderId(): string;
    validate(): void;
}
//# sourceMappingURL=CancelFutureRideDto.d.ts.map