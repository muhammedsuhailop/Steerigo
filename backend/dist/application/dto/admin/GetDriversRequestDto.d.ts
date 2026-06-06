export type AdminDriverQuery = {
    status?: string;
    kycStatus?: string;
    licenceCategory?: string;
    search?: string;
    dateFrom?: Date;
    dateTo?: Date;
};
export declare class GetDriversRequestDto {
    private readonly data;
    constructor(queryParams: unknown);
    static fromRequest(queryParams: unknown): GetDriversRequestDto;
    getPage(): number;
    getPageSize(): number;
    getStatus(): string | undefined;
    getKycStatus(): string | undefined;
    getLicenceCategory(): string | undefined;
    getSearch(): string | undefined;
    getDateFrom(): Date | undefined;
    getDateTo(): Date | undefined;
    getSortBy(): string;
    getSortOrder(): "asc" | "desc";
}
//# sourceMappingURL=GetDriversRequestDto.d.ts.map