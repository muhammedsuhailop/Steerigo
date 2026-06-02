"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDriverRidesSchema = exports.GetDriverRidesDto = void 0;
const zod_1 = require("zod");
const RideStatus_1 = require("@domain/value-objects/RideStatus");
const getDriverRidesSchema = zod_1.z.object({
    page: zod_1.z.number().positive().optional().default(1),
    limit: zod_1.z.number().positive().max(100).optional().default(10),
    sortBy: zod_1.z
        .enum(["createdAt", "updatedAt", "status"])
        .optional()
        .default("createdAt"),
    sortOrder: zod_1.z.enum(["asc", "desc"]).optional().default("desc"),
    status: zod_1.z.nativeEnum(RideStatus_1.RideStatus).optional(),
    fromDate: zod_1.z.string().datetime().optional(),
    toDate: zod_1.z.string().datetime().optional(),
});
exports.getDriverRidesSchema = getDriverRidesSchema;
class GetDriverRidesDto {
    constructor(userId, queryData) {
        this.userId = userId;
        this.data = getDriverRidesSchema.parse(queryData);
    }
    static fromRequest(userId, query) {
        return new GetDriverRidesDto(userId, query);
    }
    getUserId() {
        return this.userId;
    }
    getPage() {
        return this.data.page;
    }
    getLimit() {
        return this.data.limit;
    }
    getSortBy() {
        return this.data.sortBy;
    }
    getSortOrder() {
        return this.data.sortOrder;
    }
    getStatus() {
        return this.data.status;
    }
    getFromDate() {
        return this.data.fromDate ? new Date(this.data.fromDate) : undefined;
    }
    getToDate() {
        return this.data.toDate ? new Date(this.data.toDate) : undefined;
    }
}
exports.GetDriverRidesDto = GetDriverRidesDto;
//# sourceMappingURL=GetDriverRidesDto.js.map