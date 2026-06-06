"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetKycRequestByIdResponseDto = exports.DriverInfoDto = exports.KycDocumentDto = exports.KycDocumentInfo = exports.KycDocumentDates = exports.KycDocumentImages = void 0;
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
class KycDocumentInfo {
    constructor(id, docType, docNumber, verificationStatus, comments, isExpired) {
        this.id = id;
        this.docType = docType;
        this.docNumber = docNumber;
        this.verificationStatus = verificationStatus;
        this.comments = comments;
        this.isExpired = isExpired;
    }
}
exports.KycDocumentInfo = KycDocumentInfo;
class KycDocumentDto {
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
exports.KycDocumentDto = KycDocumentDto;
class DriverInfoDto {
    constructor(driverId, userId, userName, userEmail, userMobile, driverStatus) {
        this.driverId = driverId;
        this.userId = userId;
        this.userName = userName;
        this.userEmail = userEmail;
        this.userMobile = userMobile;
        this.driverStatus = driverStatus;
    }
}
exports.DriverInfoDto = DriverInfoDto;
class GetKycRequestByIdResponseDto {
    constructor(kyc, driver) {
        this.kyc = kyc;
        this.driver = driver;
    }
}
exports.GetKycRequestByIdResponseDto = GetKycRequestByIdResponseDto;
//# sourceMappingURL=GetKycRequestByIdResponseDto.js.map