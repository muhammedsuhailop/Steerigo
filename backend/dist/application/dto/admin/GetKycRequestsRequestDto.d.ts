export declare class GetKycRequestsRequestDto {
    private readonly data;
    constructor(queryParams: unknown);
    static fromRequest(queryParams: unknown): GetKycRequestsRequestDto;
    getPage(): number;
    getPageSize(): number;
    getVerificationStatus(): string | undefined;
    getDocType(): string | undefined;
    getDriverId(): string | undefined;
    getDateFrom(): Date | undefined;
    getDateTo(): Date | undefined;
    getSortBy(): string;
    getSortOrder(): "asc" | "desc";
}
//# sourceMappingURL=GetKycRequestsRequestDto.d.ts.map