import { Email } from "@domain/value-objects/Email";
import { Location } from "@domain/value-objects/Location";
import { RideType } from "@domain/value-objects/RideType";
export interface DriverInfo {
    readonly driverId: string;
    readonly userId: string;
    readonly name: string;
    readonly email: Email;
    readonly mobile: string | undefined;
    readonly licenseNumber: string;
    readonly licenceCategory: string;
    readonly licenseIssueDate: Date;
    readonly licenseExpiryDate: Date;
    readonly kycStatus: string;
    readonly status: string;
    readonly eligibleGearTypes: string[];
    readonly eligibleBodyTypes: string[];
}
export interface AvailabilityInfo {
    readonly id: string;
    readonly status: string;
    readonly availableFrom: Date;
    readonly availableTill: Date;
    readonly currentLocation: Location;
    readonly updatedAt: Date;
}
export interface CurrentRideInfo {
    readonly rideId: string;
    readonly status: string;
    readonly pickup: Location;
    readonly drop: Location;
    readonly rider: {
        readonly id: string;
        readonly name: string;
        readonly mobile: string | undefined;
    };
    readonly rideType: RideType;
    readonly fare: number;
    readonly currency: string;
    readonly startedAt: Date;
    readonly timer: string;
}
export interface PendingRequest {
    readonly requestId: string;
    readonly pickup: Location;
    readonly drop: Location;
    readonly pickupTime: Date;
    readonly rideType: string;
    readonly fare: number;
    readonly userName: string;
    readonly status: string;
    readonly pickupETA: string;
}
export interface Statistics {
    readonly ridesCompleted: number;
    readonly ridesCancelled: number;
    readonly scheduledRides: number;
    readonly totalEarnings: number;
    readonly currency: string;
}
export interface Performance {
    readonly acceptanceRate: number;
    readonly cancellationRate: number;
    readonly averageRating: number;
}
export interface DashboardMeta {
    readonly lastUpdated: Date;
    readonly serverTime: Date;
}
export declare class DriverDashboardResponseDto {
    readonly data: {
        readonly driver: DriverInfo;
        readonly availability: AvailabilityInfo | null;
        readonly currentRide: CurrentRideInfo | null;
        readonly pendingRequests: PendingRequest[];
        readonly statistics: Statistics;
        readonly performance: Performance;
        readonly meta: DashboardMeta;
    };
    readonly success: boolean;
    readonly message: string;
    constructor(data: {
        readonly driver: DriverInfo;
        readonly availability: AvailabilityInfo | null;
        readonly currentRide: CurrentRideInfo | null;
        readonly pendingRequests: PendingRequest[];
        readonly statistics: Statistics;
        readonly performance: Performance;
        readonly meta: DashboardMeta;
    });
}
//# sourceMappingURL=DriverDashboardResponseDto.d.ts.map