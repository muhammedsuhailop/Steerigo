"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetKycRequestsResponseDto = exports.KycRequestsAppliedFiltersDto = exports.PaginationDto = exports.KycRequestListItemDto = exports.KycDriverInfoDto = exports.KycDocumentSummaryDto = exports.KycDocumentDates = exports.KycDocumentImages = void 0;
class KycDocumentImages {
    constructor(docImageUrlsFront, docImageUrlsBack) {
        this.docImageUrlsFront = docImageUrlsFront;
        this.docImageUrlsBack = docImageUrlsBack;
    }
}
exports.KycDocumentImages = KycDocumentImages;
class KycDocumentDates {
    constructor(issueDate, expiryDate, createdAt, updatedAt) {
        this.issueDate = issueDate;
        this.expiryDate = expiryDate;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
}
exports.KycDocumentDates = KycDocumentDates;
class KycDocumentSummaryDto {
    constructor(id, docType, docNumber, issueDate, expiryDate, verificationStatus, comments, docImageUrlsFront, docImageUrlsBack, createdAt, updatedAt, isExpired) {
        this.id = id;
        this.docType = docType;
        this.docNumber = docNumber;
        this.issueDate = issueDate;
        this.expiryDate = expiryDate;
        this.verificationStatus = verificationStatus;
        this.comments = comments;
        this.docImageUrlsFront = docImageUrlsFront;
        this.docImageUrlsBack = docImageUrlsBack;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.isExpired = isExpired;
    }
}
exports.KycDocumentSummaryDto = KycDocumentSummaryDto;
class KycDriverInfoDto {
    constructor(driverId, userId, userName, userEmail, userMobile, driverStatus) {
        this.driverId = driverId;
        this.userId = userId;
        this.userName = userName;
        this.userEmail = userEmail;
        this.userMobile = userMobile;
        this.driverStatus = driverStatus;
    }
}
exports.KycDriverInfoDto = KycDriverInfoDto;
class KycRequestListItemDto {
    constructor(kyc, driver) {
        this.kyc = kyc;
        this.driver = driver;
    }
}
exports.KycRequestListItemDto = KycRequestListItemDto;
class PaginationDto {
    constructor(currentPage, pageSize, totalItems, totalPages) {
        this.currentPage = currentPage;
        this.pageSize = pageSize;
        this.totalItems = totalItems;
        this.totalPages = totalPages;
    }
}
exports.PaginationDto = PaginationDto;
class KycRequestsAppliedFiltersDto {
    constructor(sortBy, sortOrder, verificationStatus, docType, driverId, dateFrom, dateTo) {
        this.sortBy = sortBy;
        this.sortOrder = sortOrder;
        this.verificationStatus = verificationStatus;
        this.docType = docType;
        this.driverId = driverId;
        this.dateFrom = dateFrom;
        this.dateTo = dateTo;
    }
}
exports.KycRequestsAppliedFiltersDto = KycRequestsAppliedFiltersDto;
class GetKycRequestsResponseDto {
    constructor(kycDocuments, pagination, appliedFilters) {
        this.kycDocuments = kycDocuments;
        this.pagination = pagination;
        this.appliedFilters = appliedFilters;
    }
}
exports.GetKycRequestsResponseDto = GetKycRequestsResponseDto;
//# sourceMappingURL=GetKycRequestsResponseDto.js.map