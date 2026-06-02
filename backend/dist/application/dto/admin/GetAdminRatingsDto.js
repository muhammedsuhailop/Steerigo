"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetAdminRatingsDto = exports.getAdminRatingsSchema = void 0;
const zod_1 = require("zod");
const ReviewType_1 = require("@domain/value-objects/ReviewType");
exports.getAdminRatingsSchema = zod_1.z.object({
    page: zod_1.z.coerce.number().positive().default(1),
    limit: zod_1.z.coerce.number().positive().max(100).default(10),
    sortBy: zod_1.z.enum(["createdAt", "overallRating"]).default("createdAt"),
    sortOrder: zod_1.z.enum(["asc", "desc"]).default("desc"),
    reviewType: zod_1.z.nativeEnum(ReviewType_1.ReviewType).optional(),
    reviewerId: zod_1.z.string().optional(),
    revieweeId: zod_1.z.string().optional(),
    rideId: zod_1.z.string().optional(),
    minRating: zod_1.z.coerce.number().min(0).max(5).optional(),
    maxRating: zod_1.z.coerce.number().min(0).max(5).optional(),
    fromDate: zod_1.z.coerce.date().optional(),
    toDate: zod_1.z.coerce.date().optional(),
});
class GetAdminRatingsDto {
    constructor(queryData) {
        this.data = exports.getAdminRatingsSchema.parse(queryData);
    }
    static fromRequest(query) {
        return new GetAdminRatingsDto(query);
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
    getReviewType() {
        return this.data.reviewType;
    }
    getReviewerId() {
        return this.data.reviewerId;
    }
    getRevieweeId() {
        return this.data.revieweeId;
    }
    getRideId() {
        return this.data.rideId;
    }
    getMinRating() {
        return this.data.minRating;
    }
    getMaxRating() {
        return this.data.maxRating;
    }
    getFromDate() {
        return this.data.fromDate ? new Date(this.data.fromDate) : undefined;
    }
    getToDate() {
        return this.data.toDate ? new Date(this.data.toDate) : undefined;
    }
}
exports.GetAdminRatingsDto = GetAdminRatingsDto;
//# sourceMappingURL=GetAdminRatingsDto.js.map