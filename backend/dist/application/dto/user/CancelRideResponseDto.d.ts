import { RideStatus } from "@domain/value-objects/RideStatus";
import { RideCancellationReason } from "@domain/value-objects/RideCancellationReason";
export interface CancelRideResponseDto {
    rideId: string;
    status: RideStatus;
    reason: RideCancellationReason;
    cancellationFee: {
        amount: number;
        currency: string;
    };
    feeCharged: boolean;
    addedToArrears: boolean;
    message: string;
}
//# sourceMappingURL=CancelRideResponseDto.d.ts.map