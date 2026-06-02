export interface GetUsersInput {
    page?: string;
    pageSize?: string;
    status?: "Active" | "Suspended" | "Pending Verification" | "Inactive" | "Blocked";
    search?: string;
    dateFrom?: string;
    dateTo?: string;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
}
export declare class GetUsersDto {
    readonly page: number;
    readonly pageSize: number;
    readonly status?: "Active" | "Suspended" | "Pending Verification" | "Inactive" | "Blocked";
    readonly search?: string;
    readonly dateFrom?: string;
    readonly dateTo?: string;
    readonly sortBy: string;
    readonly sortOrder: "asc" | "desc";
    constructor(data: unknown);
    private parsePositiveInt;
    private validateSortBy;
}
//# sourceMappingURL=GetUsersDto.d.ts.map