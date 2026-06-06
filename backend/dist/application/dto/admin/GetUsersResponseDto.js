"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetUsersResponseDto = exports.AdminUsersAppliedFiltersDto = exports.AdminUsersPaginationDto = exports.AdminUserSummaryDto = exports.AdminUserBookingStats = exports.AdminUserContactInfo = void 0;
class AdminUserContactInfo {
    constructor(email, mobile) {
        this.email = email;
        this.mobile = mobile;
    }
}
exports.AdminUserContactInfo = AdminUserContactInfo;
class AdminUserBookingStats {
    constructor(totalBookings, totalSpent, lastBooked) {
        this.totalBookings = totalBookings;
        this.totalSpent = totalSpent;
        this.lastBooked = lastBooked;
    }
}
exports.AdminUserBookingStats = AdminUserBookingStats;
class AdminUserSummaryDto {
    constructor(userId, name, email, mobile, status, totalBookings, totalSpent, lastBooked, createdAt, isVerified) {
        this.userId = userId;
        this.name = name;
        this.email = email;
        this.mobile = mobile;
        this.status = status;
        this.totalBookings = totalBookings;
        this.totalSpent = totalSpent;
        this.lastBooked = lastBooked;
        this.createdAt = createdAt;
        this.isVerified = isVerified;
    }
}
exports.AdminUserSummaryDto = AdminUserSummaryDto;
class AdminUsersPaginationDto {
    constructor(currentPage, pageSize, totalItems, totalPages) {
        this.currentPage = currentPage;
        this.pageSize = pageSize;
        this.totalItems = totalItems;
        this.totalPages = totalPages;
    }
}
exports.AdminUsersPaginationDto = AdminUsersPaginationDto;
class AdminUsersAppliedFiltersDto {
    constructor(sortBy, sortOrder, search, status, dateFrom, dateTo) {
        this.sortBy = sortBy;
        this.sortOrder = sortOrder;
        this.search = search;
        this.status = status;
        this.dateFrom = dateFrom;
        this.dateTo = dateTo;
    }
}
exports.AdminUsersAppliedFiltersDto = AdminUsersAppliedFiltersDto;
class GetUsersResponseDto {
    constructor(users, pagination, appliedFilters) {
        this.users = users;
        this.pagination = pagination;
        this.appliedFilters = appliedFilters;
    }
}
exports.GetUsersResponseDto = GetUsersResponseDto;
//# sourceMappingURL=GetUsersResponseDto.js.map