import { CouponSortField, SortOrder, CouponFilters } from "@domain/repositories/ICouponRepository";
export declare class GetAdminCouponsDto {
    readonly filters: CouponFilters;
    readonly sortBy: CouponSortField;
    readonly sortOrder: SortOrder;
    readonly page: number;
    readonly limit: number;
    private constructor();
    static fromRequest(query: unknown): GetAdminCouponsDto;
}
//# sourceMappingURL=GetAdminCouponsDto.d.ts.map