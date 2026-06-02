export declare class AutoSearchAndRequestDto {
    private readonly riderId;
    readonly requestGroupId: string;
    readonly latitude: number;
    readonly longitude: number;
    readonly searchDate: Date;
    readonly timeRequired: number;
    readonly radiusKm: number;
    readonly gearType: string;
    readonly bodyType: string;
    readonly maxRideRequests: number;
    readonly dropLatitude: number;
    readonly dropLongitude: number;
    readonly dropAddress: string | undefined;
    readonly pickupAddress: string | undefined;
    readonly rideType: string;
    constructor(requestGroupId: string, riderId: string, latitude: number, longitude: number, searchDate: Date, timeRequired: number, radiusKm: number | undefined, gearType: string | undefined, bodyType: string | undefined, maxRideRequests: number | undefined, dropLatitude: number, dropLongitude: number, dropAddress: string | undefined, pickupAddress: string | undefined, rideType: string);
    static fromRequest(riderId: string, requestBody: unknown): AutoSearchAndRequestDto;
    getRiderId(): string;
    validate(): void;
    getSearchWindow(): {
        startTime: Date;
        endTime: Date;
    };
    getTotalDurationMinutes(): number;
}
//# sourceMappingURL=AutoSearchAndRequestDto.d.ts.map