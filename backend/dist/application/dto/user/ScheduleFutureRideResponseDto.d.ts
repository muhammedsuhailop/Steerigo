export interface ScheduledRequestInfo {
    readonly requestId: string;
    readonly driverId: string;
    readonly driverUserId: string;
    readonly pickupETA: string;
    readonly totalFare: number;
    readonly currency: string;
}
export interface ScheduleFutureRideResult {
    readonly requestGroupId: string;
    readonly scheduledRequests: ScheduledRequestInfo[];
    readonly totalDriversNotified: number;
    readonly pickupTime: Date;
    readonly expiresAt: Date;
    readonly scheduledAt: Date;
}
export declare class ScheduleFutureRideResponseDto {
    readonly result: ScheduleFutureRideResult;
    readonly message: string;
    constructor(result: ScheduleFutureRideResult, message: string);
    static create(requestGroupId: string, scheduledRequests: ScheduledRequestInfo[], pickupTime: Date, expiryWindowMs: number): ScheduleFutureRideResponseDto;
}
//# sourceMappingURL=ScheduleFutureRideResponseDto.d.ts.map