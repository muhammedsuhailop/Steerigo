export declare class MarkRideAsArrivedDto {
    private readonly userId;
    private readonly rideId;
    private constructor();
    static fromRequest(userId: string, data: {
        rideId: string;
    }): MarkRideAsArrivedDto;
    getUserId(): string;
    getRideId(): string;
}
//# sourceMappingURL=MarkRideAsArrivedDto.d.ts.map