"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetKycRequestsRequestDto = void 0;
const zod_1 = require("zod");
const getKycRequestsRequestSchema = zod_1.z.object({
    page: zod_1.z.coerce.number().int().min(1).default(1),
    pageSize: zod_1.z.coerce.number().int().min(1).max(100).default(10),
    verificationStatus: zod_1.z
        .enum(["InReview", "Approved", "Rejected", "Expired"])
        .optional(),
    docType: zod_1.z.enum(["Aadhaar", "PAN", "License", "Passport"]).optional(),
    driverId: zod_1.z
        .string()
        .regex(/^[0-9a-fA-F]{24}$/, "Invalid MongoDB ObjectId format")
        .optional(),
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
        .enum(["createdAt", "updatedAt", "verificationStatus", "docType"])
        .default("createdAt"),
    sortOrder: zod_1.z.enum(["asc", "desc"]).default("desc"),
});
class GetKycRequestsRequestDto {
    constructor(queryParams) {
        this.data = getKycRequestsRequestSchema.parse(queryParams);
    }
    static fromRequest(queryParams) {
        return new GetKycRequestsRequestDto(queryParams);
    }
    getPage() {
        return this.data.page;
    }
    getPageSize() {
        return this.data.pageSize;
    }
    getVerificationStatus() {
        return this.data.verificationStatus;
    }
    getDocType() {
        return this.data.docType;
    }
    getDriverId() {
        return this.data.driverId;
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
exports.GetKycRequestsRequestDto = GetKycRequestsRequestDto;
//# sourceMappingURL=GetKycRequestsRequestDto.js.map