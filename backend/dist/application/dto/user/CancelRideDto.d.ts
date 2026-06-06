import { RideCancellationReason } from "../../../domain/value-objects/RideCancellationReason";
export declare class CancelRideDto {
    private readonly riderId;
    readonly rideId: string;
    readonly reason: RideCancellationReason;
    private constructor();
    static fromRequest(riderId: string, params: {
        rideId?: string;
    }, body: unknown): CancelRideDto;
    getRiderId(): string;
    validate(): void;
}
//# sourceMappingURL=CancelRideDto.d.ts.map