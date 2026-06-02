"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetDriversRequestDto = void 0;
const zod_1 = require("zod");
const getDriversRequestSchema = zod_1.z.object({
    page: zod_1.z.coerce.number().int().min(1).default(1),
    pageSize: zod_1.z.coerce.number().int().min(1).max(100).default(10),
    status: zod_1.z.enum(["Active", "Blocked", "Suspended"]).optional(),
    kycStatus: zod_1.z.enum(["InReview", "Rejected", "Approved", "Expired"]).optional(),
    licenceCategory: zod_1.z.enum(["LMV", "HMV", "MCWG", "MCWOG"]).optional(),
    search: zod_1.z.string().min(1).max(255).optional(),
    dateFrom: zod_1.z
        .union([
        zod_1.z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format"),
        zod_1.z.string().datetime(),
    ])
        .optional(),
    dateTo: zod_1.z
        .union([
        zod_1.z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format"),
        zod_1.z.string().datetime(),
    ])
        .optional(),
    sortBy: zod_1.z
        .enum([
        "createdAt",
        "status",
        "kycStatus",
        "licenceCategory",
        "totalRides",
        "totalEarnings",
        "rating",
    ])
        .default("createdAt"),
    sortOrder: zod_1.z.enum(["asc", "desc"]).default("desc"),
});
class GetDriversRequestDto {
    constructor(queryParams) {
        this.data = getDriversRequestSchema.parse(queryParams);
    }
    static fromRequest(queryParams) {
        return new GetDriversRequestDto(queryParams);
    }
    getPage() {
        return this.data.page;
    }
    getPageSize() {
        return this.data.pageSize;
    }
    getStatus() {
        return this.data.status;
    }
    getKycStatus() {
        return this.data.kycStatus;
    }
    getLicenceCategory() {
        return this.data.licenceCategory;
    }
    getSearch() {
        return this.data.search;
    }
    getDateFrom() {
        return this.data.dateFrom ? new Date(this.data.dateFrom) : undefined;
    }
    getDateTo() {
        return this.data.dateTo ? new Date(this.data.dateTo) : undefined;
    }
    getSortBy() {
        return this.data.sortBy;
    }
    getSortOrder() {
        return this.data.sortOrder;
    }
}
exports.GetDriversRequestDto = GetDriversRequestDto;
//# sourceMappingURL=GetDriversRequestDto.js.map