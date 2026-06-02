"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetDriversResponseDto = exports.AppliedFiltersDto = exports.PaginationDto = exports.DriverSummaryDto = exports.DriverPerformanceStats = exports.DriverStatusInfo = exports.DriverUserSummary = exports.DriverLicenseInfo = void 0;
class DriverLicenseInfo {
    constructor(licenseIssueDate, licenseExpiryDate) {
        this.licenseIssueDate = licenseIssueDate;
        this.licenseExpiryDate = licenseExpiryDate;
    }
}
exports.DriverLicenseInfo = DriverLicenseInfo;
class DriverUserSummary {
    constructor(userId, userName, userEmail, userMobile) {
        this.userId = userId;
        this.userName = userName;
        this.userEmail = userEmail;
        this.userMobile = userMobile;
    }
}
exports.DriverUserSummary = DriverUserSummary;
class DriverStatusInfo {
    constructor(status, kycStatus, licenceCategory, eligibleGearTypes, eligibleBodyTypes) {
        this.status = status;
        this.kycStatus = kycStatus;
        this.licenceCategory = licenceCategory;
        this.eligibleGearTypes = eligibleGearTypes;
        this.eligibleBodyTypes = eligibleBodyTypes;
    }
}
exports.DriverStatusInfo = DriverStatusInfo;
class DriverPerformanceStats {
    constructor(totalRides, totalEarnings, rating, lastRideDate) {
        this.totalRides = totalRides;
        this.totalEarnings = totalEarnings;
        this.rating = rating;
        this.lastRideDate = lastRideDate;
    }
}
exports.DriverPerformanceStats = DriverPerformanceStats;
class DriverSummaryDto {
    constructor(driverId, user, statusInfo, license, stats, createdAt) {
        this.driverId = driverId;
        this.user = user;
        this.statusInfo = statusInfo;
        this.license = license;
        this.stats = stats;
        this.createdAt = createdAt;
    }
}
exports.DriverSummaryDto = DriverSummaryDto;
class PaginationDto {
    constructor(currentPage, pageSize, totalItems, totalPages) {
        this.currentPage = currentPage;
        this.pageSize = pageSize;
        this.totalItems = totalItems;
        this.totalPages = totalPages;
    }
}
exports.PaginationDto = PaginationDto;
class AppliedFiltersDto {
    constructor(sortBy, sortOrder, search, status, kycStatus, licenceCategory, dateFrom, dateTo) {
        this.sortBy = sortBy;
        this.sortOrder = sortOrder;
        this.search = search;
        this.status = status;
        this.kycStatus = kycStatus;
        this.licenceCategory = licenceCategory;
        this.dateFrom = dateFrom;
        this.dateTo = dateTo;
    }
}
exports.AppliedFiltersDto = AppliedFiltersDto;
class GetDriversResponseDto {
    constructor(drivers, pagination, appliedFilters) {
        this.drivers = drivers;
        this.pagination = pagination;
        this.appliedFilters = appliedFilters;
    }
}
exports.GetDriversResponseDto = GetDriversResponseDto;
//# sourceMappingURL=GetDriversResponseDto.js.map