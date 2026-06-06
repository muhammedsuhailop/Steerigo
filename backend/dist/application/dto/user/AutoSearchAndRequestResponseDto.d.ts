export interface SuccessfulRequestInfo {
    requestId: string;
    driverId: string;
    driverName: string;
    pickupETA: string;
    totalFare: number;
    currency: string;
}
export interface FailedRequestInfo {
    driverId: string;
    driverName: string;
    reason: string;
}
export interface AutoSearchAndRequestResult {
    requestGroupId: string;
    successfulRequests: SuccessfulRequestInfo[];
    failedRequests: FailedRequestInfo[];
    totalDriversFound: number;
    successCount: number;
    failureCount: number;
    searchedAt: Date;
}
export declare class AutoSearchAndRequestResponseDto {
    readonly result: AutoSearchAndRequestResult;
    readonly message: string;
    constructor(result: AutoSearchAndRequestResult, message: string);
    static create(requestGroupId: string, successfulRequests: SuccessfulRequestInfo[], failedRequests: FailedRequestInfo[], totalDriversFound: number): AutoSearchAndRequestResponseDto;
}
//# sourceMappingURL=AutoSearchAndRequestResponseDto.d.ts.map