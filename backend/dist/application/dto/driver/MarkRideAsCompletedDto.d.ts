export declare class MarkRideAsCompletedDto {
    private readonly userId;
    private readonly rideId;
    private constructor();
    static fromRequest(userId: string, data: {
        rideId: string;
    }): MarkRideAsCompletedDto;
    getUserId(): string;
    getRideId(): string;
}
//# sourceMappingURL=MarkRideAsCompletedDto.d.ts.map