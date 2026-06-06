import { FareBreakdown } from "../../../domain/value-objects/FareBreakdown";
export declare class SendRideRequestDto {
    readonly riderId: string;
    readonly driverId: string;
    readonly requestGroupId: string;
    readonly pickupLatitude: number;
    readonly pickupLongitude: number;
    readonly pickupAddress: string | undefined;
    readonly dropLatitude: number;
    readonly dropLongitude: number;
    readonly dropAddress: string | undefined;
    readonly pickupTime: Date;
    readonly timeRequired: number;
    readonly rideType: string;
    readonly fareBreakdown: FareBreakdown;
    readonly pickupETA: string;
    constructor(requestGroupId: string, riderId: string, driverId: string, pickupLatitude: number, pickupLongitude: number, pickupAddress: string | undefined, dropLatitude: number, dropLongitude: number, dropAddress: string | undefined, pickupTime: Date, timeRequired: number, rideType: string, fareBreakdown: FareBreakdown, pickupETA: string);
    static fromRequest(riderId: string, requestBody: unknown): SendRideRequestDto;
    validate(): void;
}
//# sourceMappingURL=SendRideRequestDto.d.ts.map