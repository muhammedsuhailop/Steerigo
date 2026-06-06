import { RideRequest } from "../../../domain/entities/RideRequest";
export interface FareBreakdownDto {
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
            rate: number;
            amount: {
                amount: number;
                currency: string;
            };
        };
        platformFee: {
            name: string;
            rate: number;
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
    calculatedAt: Date;
}
export interface RideRequestDto {
    requestId: string;
    driverId: string;
    riderId: string;
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
    pickupTime: Date;
    rideType: string;
    fareBreakdown: FareBreakdownDto;
    status: string;
    pickupETA: string;
    createdAt: Date;
    expiresIn: number;
}
export declare class SendRideRequestResponseDto {
    readonly rideRequest: RideRequestDto;
    readonly message: string;
    constructor(rideRequest: RideRequestDto, message: string);
    static fromDomain(rideRequest: RideRequest): SendRideRequestResponseDto;
}
//# sourceMappingURL=SendRideRequestResponseDto.d.ts.map