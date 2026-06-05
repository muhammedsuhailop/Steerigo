import { RideStatus } from "../../../domain/value-objects/RideStatus";
export interface FinalFareBreakdownData {
    baseFare: {
        amount: number;
        currency: string;
    };
    platformFee: {
        amount: number;
        currency: string;
    };
    taxes: {
        fare: {
            name: string;
            amount: {
                amount: number;
                currency: string;
            };
        };
        platformFee: {
            name: string;
            amount: {
                amount: number;
                currency: string;
            };
        };
    };
    totalFare: {
        amount: number;
        currency: string;
    };
    durationHours: number;
    actualDurationMinutes: number;
}
export interface MarkRideAsCompletedResponseDto {
    rideId: string;
    status: RideStatus;
    arrivedAt?: string;
    startedAt: string;
    completedAt: string;
    fareBreakdown: FinalFareBreakdownData;
    riderId: string;
    driverId: string;
}
//# sourceMappingURL=MarkRideAsCompletedResponseDto.d.ts.map