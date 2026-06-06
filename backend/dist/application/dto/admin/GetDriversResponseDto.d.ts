export declare class DriverLicenseInfo {
    readonly licenseIssueDate: Date;
    readonly licenseExpiryDate: Date;
    constructor(licenseIssueDate: Date, licenseExpiryDate: Date);
}
export declare class DriverUserSummary {
    readonly userId: string;
    readonly userName: string;
    readonly userEmail: string;
    readonly userMobile: string;
    constructor(userId: string, userName: string, userEmail: string, userMobile: string);
}
export declare class DriverStatusInfo {
    readonly status: string;
    readonly kycStatus: string;
    readonly licenceCategory: string;
    readonly eligibleGearTypes: string[];
    readonly eligibleBodyTypes: string[];
    constructor(status: string, kycStatus: string, licenceCategory: string, eligibleGearTypes: string[], eligibleBodyTypes: string[]);
}
export declare class DriverPerformanceStats {
    readonly totalRides: number;
    readonly totalEarnings: number;
    readonly rating: number;
    readonly lastRideDate: Date | null;
    constructor(totalRides: number, totalEarnings: number, rating: number, lastRideDate: Date | null);
}
export declare class DriverSummaryDto {
    readonly driverId: string;
    readonly user: DriverUserSummary;
    readonly statusInfo: DriverStatusInfo;
    readonly license: DriverLicenseInfo;
    readonly stats: DriverPerformanceStats;
    readonly createdAt: Date;
    constructor(driverId: string, user: DriverUserSummary, statusInfo: DriverStatusInfo, license: DriverLicenseInfo, stats: DriverPerformanceStats, createdAt: Date);
}
export declare class PaginationDto {
    readonly currentPage: number;
    readonly pageSize: number;
    readonly totalItems: number;
    readonly totalPages?: number;
    constructor(currentPage: number, pageSize: number, totalItems: number, totalPages?: number);
}
export declare class AppliedFiltersDto {
    readonly sortBy: string | null;
    readonly sortOrder: string | null;
    readonly search: string | null;
    readonly status: string | null;
    readonly kycStatus: string | null;
    readonly licenceCategory: string | null;
    readonly dateFrom: string | null;
    readonly dateTo: string | null;
    constructor(sortBy: string | null, sortOrder: string | null, search: string | null, status: string | null, kycStatus: string | null, licenceCategory: string | null, dateFrom: string | null, dateTo: string | null);
}
export declare class GetDriversResponseDto {
    readonly drivers: DriverSummaryDto[];
    readonly pagination: PaginationDto;
    readonly appliedFilters: AppliedFiltersDto;
    constructor(drivers: DriverSummaryDto[], pagination: PaginationDto, appliedFilters: AppliedFiltersDto);
}
//# sourceMappingURL=GetDriversResponseDto.d.ts.map