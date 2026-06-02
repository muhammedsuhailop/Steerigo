export declare class MarkRideAsStartedDto {
    private readonly userId;
    private readonly rideId;
    private readonly verificationCode;
    private constructor();
    static fromRequest(userId: string, data: {
        rideId: string;
        verificationCode: string;
    }): MarkRideAsStartedDto;
    getUserId(): string;
    getRideId(): string;
    getVerificationCode(): string;
}
//# sourceMappingURL=MarkRideAsStartedDto.d.ts.map