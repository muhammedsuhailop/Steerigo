import { UserStatus } from "@shared/constants/UserStatus";
export type AdminUsersQuery = {
    status?: string;
    search?: string;
    dateFrom?: Date;
    dateTo?: Date;
};
export declare class GetUsersRequestDto {
    private readonly data;
    constructor(queryParams: unknown);
    static fromRequest(queryParams: unknown): GetUsersRequestDto;
    getPage(): number;
    getPageSize(): number;
    getStatus(): UserStatus | undefined;
    getSearch(): string | undefined;
    getDateFrom(): Date | undefined;
    getDateTo(): Date | undefined;
    getSortBy(): string;
    getSortOrder(): "asc" | "desc";
}
//# sourceMappingURL=GetUsersRequestDto.d.ts.map