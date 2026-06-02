export declare class RejectFutureRideRequestDto {
    private readonly userId;
    private readonly data;
    private constructor();
    static fromRequest(userId: string, requestBody: unknown): RejectFutureRideRequestDto;
    getUserId(): string;
    getRequestId(): string;
}
//# sourceMappingURL=RejectFutureRideRequestDto.d.ts.map