export declare class ScheduleFutureRideDto {
    private readonly riderId;
    readonly requestGroupId: string;
    readonly latitude: number;
    readonly longitude: number;
    readonly pickupTime: Date;
    readonly radiusKm: number;
    readonly gearType: string;
    readonly bodyType: string;
    readonly maxCandidates: number;
    readonly dropLatitude: number;
    readonly dropLongitude: number;
    readonly dropAddress: string | undefined;
    readonly pickupAddress: string | undefined;
    readonly rideType: string;
    readonly requiredDuration: number;
    constructor(requestGroupId: string, riderId: string, latitude: number, longitude: number, pickupTime: Date, radiusKm: number, gearType: string, bodyType: string, maxCandidates: number, dropLatitude: number, dropLongitude: number, dropAddress: string | undefined, pickupAddress: string | undefined, rideType: string, requiredDuration: number);
    static fromRequest(riderId: string, requestBody: unknown): ScheduleFutureRideDto;
    getRiderId(): string;
    validate(): void;
    getAvailabilityCheckTime(): Date;
}
//# sourceMappingURL=ScheduleFutureRideDto.d.ts.map