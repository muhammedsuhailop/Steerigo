export declare class AcceptFutureRideRequestDto {
    private readonly userId;
    readonly requestId: string;
    constructor(userId: string, requestId: string);
    static fromRequest(userId: string, requestBody: unknown): AcceptFutureRideRequestDto;
    getUserId(): string;
    getRequestId(): string;
    validate(): void;
}
//# sourceMappingURL=AcceptFutureRideRequestDto.d.ts.map