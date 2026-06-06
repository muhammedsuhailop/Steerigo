import { AdminTransactionQueryFilters } from "../../../domain/repositories/ITransactionRepository";
export declare class GetAdminTransactionsDto {
    readonly filters: AdminTransactionQueryFilters;
    private constructor();
    static fromRequest(query: unknown): GetAdminTransactionsDto;
}
//# sourceMappingURL=GetAdminTransactionsDto.d.ts.map