export interface GetKycRequestsInput {
    page?: string;
    pageSize?: string;
    docType?: "Aadhaar" | "PAN" | "DrivingLicense" | "Passport";
    isVerified?: "true" | "false";
    search?: string;
    dateFrom?: string;
    dateTo?: string;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
}
export declare class GetKycRequestsDto {
    readonly page: number;
    readonly pageSize: number;
    readonly docType?: "Aadhaar" | "PAN" | "DrivingLicense" | "Passport";
    readonly isVerified?: boolean;
    readonly search?: string;
    readonly dateFrom?: string;
    readonly dateTo?: string;
    readonly sortBy: string;
    readonly sortOrder: "asc" | "desc";
    constructor(data: unknown);
    private parsePositiveInt;
    private validateSortBy;
}
//# sourceMappingURL=GetKycRequestsDto.d.ts.map