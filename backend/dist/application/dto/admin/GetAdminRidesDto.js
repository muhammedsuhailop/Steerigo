"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAdminRidesSchema = exports.GetAdminRidesDto = void 0;
const zod_1 = require("zod");
const RideStatus_1 = require("../../../domain/value-objects/RideStatus");
const getAdminRidesSchema = zod_1.z.object({
    page: zod_1.z.coerce.number().positive().default(1),
    limit: zod_1.z.coerce.number().positive().max(100).default(10),
    sortBy: zod_1.z.enum(["createdAt", "updatedAt", "fare"]).default("createdAt"),
    sortOrder: zod_1.z.enum(["asc", "desc"]).default("desc"),
    status: zod_1.z.nativeEnum(RideStatus_1.RideStatus).optional(),
    fromDate: zod_1.z.coerce.date().optional(),
    toDate: zod_1.z.coerce.date().optional(),
    riderId: zod_1.z.string().optional(),
    driverId: zod_1.z.string().optional(),
});
exports.getAdminRidesSchema = getAdminRidesSchema;
class GetAdminRidesDto {
    constructor(queryData) {
        this.data = getAdminRidesSchema.parse(queryData);
    }
    static fromRequest(query) {
        return new GetAdminRidesDto(query);
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
    getRiderId() {
        return this.data.riderId;
    }
    getDriverId() {
        return this.data.driverId;
    }
}
exports.GetAdminRidesDto = GetAdminRidesDto;
//# sourceMappingURL=GetAdminRidesDto.js.map