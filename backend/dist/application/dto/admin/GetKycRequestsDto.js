"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetKycRequestsDto = void 0;
class GetKycRequestsDto {
    constructor(data) {
        const input = (data ?? {});
        this.page = this.parsePositiveInt(input.page, 1);
        this.pageSize = Math.min(this.parsePositiveInt(input.pageSize, 10), 50);
        this.docType = input.docType;
        this.isVerified =
            input.isVerified === "true"
                ? true
                : input.isVerified === "false"
                    ? false
                    : undefined;
        this.search = input.search?.trim();
        this.dateFrom = input.dateFrom;
        this.dateTo = input.dateTo;
        this.sortBy = this.validateSortBy(input.sortBy ?? "createdAt");
        this.sortOrder = input.sortOrder === "desc" ? "desc" : "asc";
    }
    parsePositiveInt(value, fallback) {
        if (!value)
            return fallback;
        const parsed = Number.parseInt(value, 10);
        return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
    }
    validateSortBy(sortBy) {
        const allowed = ["driverName", "docType", "createdAt", "status"];
        return allowed.includes(sortBy) ? sortBy : "createdAt";
    }
}
exports.GetKycRequestsDto = GetKycRequestsDto;
//# sourceMappingURL=GetKycRequestsDto.js.map