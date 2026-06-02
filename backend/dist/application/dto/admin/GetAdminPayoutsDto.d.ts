import { PayoutStatus } from "@domain/value-objects/PayoutStatus";
export declare class GetAdminPayoutsDto {
    private readonly status;
    private readonly driverId;
    private readonly page;
    private readonly limit;
    private readonly sortBy;
    private readonly sortOrder;
    private constructor();
    static create(params: {
        status?: PayoutStatus;
        driverId?: string;
        page?: number;
        limit?: number;
        sortBy?: "createdAt" | "amount";
        sortOrder?: "asc" | "desc";
    }): GetAdminPayoutsDto;
    getStatus(): PayoutStatus | undefined;
    getDriverId(): string | undefined;
    getPage(): number;
    getLimit(): number;
    getSortBy(): "createdAt" | "amount";
    getSortOrder(): "asc" | "desc";
}
//# sourceMappingURL=GetAdminPayoutsDto.d.ts.map