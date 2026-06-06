"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetUsersDto = void 0;
class GetUsersDto {
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
    }
    parsePositiveInt(value, fallback) {
        if (!value)
            return fallback;
        const parsed = Number.parseInt(value, 10);
        return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
    }
    validateSortBy(sortBy) {
        const allowedSortFields = [
            "name",
            "email",
            "totalBookings",
            "totalSpent",
            "createdAt",
            "lastBooked",
            "status",
        ];
        return allowedSortFields.includes(sortBy) ? sortBy : "createdAt";
    }
}
exports.GetUsersDto = GetUsersDto;
//# sourceMappingURL=GetUsersDto.js.map