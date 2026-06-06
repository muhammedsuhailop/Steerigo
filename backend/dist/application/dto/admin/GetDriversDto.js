"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetDriversDto = void 0;
class GetDriversDto {
    constructor(data) {
        const input = (data ?? {});
        this.page = this.parsePositiveInt(input.page, 1);
        this.pageSize = Math.min(this.parsePositiveInt(input.pageSize, 10), 50);
        this.status = input.status;
        this.search = input.search?.trim();
        this.dateFrom = input.dateFrom;
        this.dateTo = input.dateTo;
        this.sortBy = this.validateSortBy(input.sortBy ?? "createdAt");
        this.sortOrder = input.sortOrder === "desc" ? "desc" : "asc";
        this.kycStatus = input.kycStatus;
    }
    parsePositiveInt(value, fallback) {
        const n = parseInt(value || "", 10);
        return Number.isFinite(n) && n > 0 ? n : fallback;
    }
    validateSortBy(sortBy) {
        const allowedSortFields = [
            "name",
            "email",
            "totalRides",
            "totalEarned",
            "createdAt",
            "lastRide",
            "status",
            "kycStatus",
        ];
        return allowedSortFields.includes(sortBy) ? sortBy : "createdAt";
    }
}
exports.GetDriversDto = GetDriversDto;
//# sourceMappingURL=GetDriversDto.js.map