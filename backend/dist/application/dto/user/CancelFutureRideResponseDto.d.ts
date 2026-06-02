export declare class CancelFutureRideResponseDto {
    readonly requestGroupId: string;
    readonly cancelledCount: number;
    readonly cancelledAt: Date;
    constructor(requestGroupId: string, cancelledCount: number, cancelledAt: Date);
    static create(requestGroupId: string, cancelledCount: number): CancelFutureRideResponseDto;
}
//# sourceMappingURL=CancelFutureRideResponseDto.d.ts.map