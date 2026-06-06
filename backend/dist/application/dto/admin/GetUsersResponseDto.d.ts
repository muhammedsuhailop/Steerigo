export declare class AdminUserContactInfo {
    readonly email: string;
    readonly mobile: string | null;
    constructor(email: string, mobile: string | null);
}
export declare class AdminUserBookingStats {
    readonly totalBookings: number;
    readonly totalSpent: number;
    readonly lastBooked: string | null;
    constructor(totalBookings: number, totalSpent: number, lastBooked: string | null);
}
export declare class AdminUserSummaryDto {
    readonly userId: string;
    readonly name: string;
    readonly email: string;
    readonly mobile: string | null;
    readonly status: string;
    readonly totalBookings: number;
    readonly totalSpent: number;
    readonly lastBooked: string | null;
    readonly createdAt: string;
    readonly isVerified: boolean;
    constructor(userId: string, name: string, email: string, mobile: string | null, status: string, totalBookings: number, totalSpent: number, lastBooked: string | null, createdAt: string, isVerified: boolean);
}
export declare class AdminUsersPaginationDto {
    readonly currentPage: number;
    readonly pageSize: number;
    readonly totalItems: number;
    readonly totalPages?: number;
    constructor(currentPage: number, pageSize: number, totalItems: number, totalPages?: number);
}
export declare class AdminUsersAppliedFiltersDto {
    readonly sortBy: string | null;
    readonly sortOrder: string | null;
    readonly search: string | null;
    readonly status: string | null;
    readonly dateFrom: string | null;
    readonly dateTo: string | null;
    constructor(sortBy: string | null, sortOrder: string | null, search: string | null, status: string | null, dateFrom: string | null, dateTo: string | null);
}
export declare class GetUsersResponseDto {
    readonly users: AdminUserSummaryDto[];
    readonly pagination: AdminUsersPaginationDto;
    readonly appliedFilters: AdminUsersAppliedFiltersDto;
    constructor(users: AdminUserSummaryDto[], pagination: AdminUsersPaginationDto, appliedFilters: AdminUsersAppliedFiltersDto);
}
//# sourceMappingURL=GetUsersResponseDto.d.ts.map