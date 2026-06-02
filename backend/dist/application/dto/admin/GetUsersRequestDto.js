"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetUsersRequestDto = void 0;
const UserStatus_1 = require("@shared/constants/UserStatus");
const zod_1 = require("zod");
const getUsersRequestSchema = zod_1.z.object({
    page: zod_1.z.coerce.number().int().min(1).default(1),
    pageSize: zod_1.z.coerce.number().int().min(1).max(100).default(10),
    status: zod_1.z.nativeEnum(UserStatus_1.UserStatus).optional(),
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
        .enum(["name", "email", "createdAt", "totalBookings", "totalSpent"])
        .default("createdAt"),
    sortOrder: zod_1.z.enum(["asc", "desc"]).default("desc"),
});
class GetUsersRequestDto {
    constructor(queryParams) {
        this.data = getUsersRequestSchema.parse(queryParams);
    }
    static fromRequest(queryParams) {
        return new GetUsersRequestDto(queryParams);
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
exports.GetUsersRequestDto = GetUsersRequestDto;
//# sourceMappingURL=GetUsersRequestDto.js.map