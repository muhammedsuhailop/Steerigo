export interface AcceptRideRequestResponseDto {
    rideId: string;
    requestId: string;
    riderId: string;
    driverId: string;
    status: string;
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
    rideType: string;
    fare: number;
    currency: string;
    pickupTime: string;
    timeline: {
        requestedAt: string;
        acceptedAt: string;
    };
}
//# sourceMappingURL=AcceptRideRequestResponseDto.d.ts.map