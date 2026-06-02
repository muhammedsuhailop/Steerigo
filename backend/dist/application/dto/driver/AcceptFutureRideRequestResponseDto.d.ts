export interface AcceptFutureRideRequestResponseDto {
    readonly success: boolean;
    readonly message: string;
    readonly data: {
        readonly futureRequestId: string;
        readonly requestGroupId: string;
        readonly rideId: string;
        readonly riderId: string;
        readonly driverId: string;
        readonly pickup: {
            readonly latitude: number;
            readonly longitude: number;
            readonly address: string | undefined;
        };
        readonly drop: {
            readonly latitude: number;
            readonly longitude: number;
            readonly address: string | undefined;
        };
        readonly pickupTime: string;
        readonly rideType: string;
        readonly fare: number;
        readonly currency: string;
    };
}
//# sourceMappingURL=AcceptFutureRideRequestResponseDto.d.ts.map