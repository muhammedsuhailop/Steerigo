import { FareBreakdown } from "../../../domain/value-objects/FareBreakdown";
import { BodyType, GearType } from "../../../domain/value-objects/VehicleType";
export interface DriverInfoResponse {
    id: string;
    userId: string;
    name: string;
    mobile: string;
    profilePicture?: string;
    rating: number;
    totalRides: number;
    status: string;
    gearType: string;
    bodyType: string;
    distance: {
        value: number;
        unit: "km";
    };
    eta: {
        value: number;
        unit: "minutes";
    };
    currentLocation: {
        latitude: number;
        longitude: number;
        address?: string;
    };
    availabilityStatus: string;
    responseTime?: string;
}
export interface NearbySearchCriteria {
    location: {
        latitude: number;
        longitude: number;
    };
    radiusKm: number;
    searchDate: Date;
    timeRequiredMinutes: number;
    filters?: {
        gearType?: GearType | null;
        bodyType?: BodyType | null;
    };
}
export declare class FindNearbyDriversResponseDto {
    readonly drivers: DriverInfoResponse[];
    readonly totalFound: number;
    readonly searchedAt: Date;
    readonly searchCriteria: NearbySearchCriteria;
    readonly estimatedFare?: FareBreakdown | undefined;
    constructor(drivers: DriverInfoResponse[], totalFound: number, searchedAt: Date, searchCriteria: NearbySearchCriteria, estimatedFare?: FareBreakdown | undefined);
    static create(drivers: DriverInfoResponse[], totalFound: number, searchCriteria: NearbySearchCriteria, fareBreakdown?: FareBreakdown): FindNearbyDriversResponseDto;
}
//# sourceMappingURL=FindNearbyDriversResponseDto.d.ts.map