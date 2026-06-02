import { FutureRideRequestStatus } from "../../../domain/value-objects/FutureRideRequestStatus";
export interface FutureRideRequestData {
    readonly requestId: string;
    readonly requestGroupId: string;
    readonly riderId: string;
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
    readonly rideType: string;
    readonly fare: number;
    readonly currency: string;
    readonly pickupTime: string;
    readonly pickupETA: string;
    readonly status: FutureRideRequestStatus;
    readonly requiredDuration: number;
    readonly createdAt: string;
}
export interface GetFutureRideRequestsResponseDto {
    readonly success: boolean;
    readonly message: string;
    readonly data: {
        readonly requests: FutureRideRequestData[];
        readonly pagination: {
            readonly total: number;
            readonly page: number;
            readonly limit: number;
            readonly totalPages: number;
        };
    };
}
//# sourceMappingURL=GetFutureRideRequestsResponseDto.d.ts.map