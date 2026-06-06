"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetAdminPayoutsDto = void 0;
class GetAdminPayoutsDto {
    constructor(status, driverId, page, limit, sortBy, sortOrder) {
        this.status = status;
        this.driverId = driverId;
        this.page = page;
        this.limit = limit;
        this.sortBy = sortBy;
        this.sortOrder = sortOrder;
    }
    static create(params) {
        return new GetAdminPayoutsDto(params.status, params.driverId, params.page ?? 1, params.limit ?? 10, params.sortBy ?? "createdAt", params.sortOrder ?? "desc");
    }
    getStatus() {
        return this.status;
    }
    getDriverId() {
        return this.driverId;
    }
    getPage() {
        return this.page;
    }
    getLimit() {
        return this.limit;
    }
    getSortBy() {
        return this.sortBy;
    }
    getSortOrder() {
        return this.sortOrder;
    }
}
exports.GetAdminPayoutsDto = GetAdminPayoutsDto;
//# sourceMappingURL=GetAdminPayoutsDto.js.map