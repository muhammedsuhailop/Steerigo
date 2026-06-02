import { RideStatus } from "@domain/value-objects/RideStatus";
export interface MarkRideAsArrivedResponseDto {
    success: boolean;
    message: string;
    data: {
        rideId: string;
        status: RideStatus;
        arrivedAt: string;
        pickup: {
            latitude: number;
            longitude: number;
            address?: string;
        };
        drop: {
            latitude: number;
            longitude: number;
            address?: string;
        };
        riderId: string;
        driverId: string;
    };
}
//# sourceMappingURL=MarkRideAsArrivedResponseDto.d.ts.map