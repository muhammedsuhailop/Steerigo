import { DriverCancellationReason } from "@domain/value-objects/DriverRideCancellationReason";
export declare class DriverCancelRideDto {
    private readonly userId;
    readonly rideId: string;
    readonly reason: DriverCancellationReason;
    private constructor();
    static fromRequest(userId: string, params: {
        rideId?: string;
    }, body: unknown): DriverCancelRideDto;
    getUserId(): string;
    getRideId(): string;
    validate(): void;
}
//# sourceMappingURL=DriverCancelRideDto.d.ts.map