export interface GetDriversInput {
    page?: string;
    pageSize?: string;
    status?: "Active" | "Blocked" | "InReview" | "Pending" | "Verified" | "Rejected";
    search?: string;
    dateFrom?: string;
    dateTo?: string;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
    kycStatus?: "Pending" | "Verified" | "Rejected";
}
export declare class GetDriversDto {
    readonly page: number;
    readonly pageSize: number;
    readonly status?: "Active" | "Blocked" | "InReview" | "Pending" | "Verified" | "Rejected";
    readonly search?: string;
    readonly dateFrom?: string;
    readonly dateTo?: string;
    readonly sortBy: string;
    readonly sortOrder: "asc" | "desc";
    readonly kycStatus?: "Pending" | "Verified" | "Rejected";
    constructor(data: unknown);
    private parsePositiveInt;
    private validateSortBy;
}
//# sourceMappingURL=GetDriversDto.d.ts.map