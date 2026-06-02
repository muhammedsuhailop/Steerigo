"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminGetDriverProfileResponseDto = exports.AdminDriverProfileData = exports.AdminDriverInfo = exports.AdminUserInfo = exports.DriverStatistics = exports.AdminKycDocument = exports.AdminLicenseInfo = void 0;
class AdminLicenseInfo {
    constructor(licenseNumber, licenceCategory, licenseIssueDate, licenseExpiryDate, licenseVerified) {
        this.licenseNumber = licenseNumber;
        this.licenceCategory = licenceCategory;
        this.licenseIssueDate = licenseIssueDate;
        this.licenseExpiryDate = licenseExpiryDate;
        this.licenseVerified = licenseVerified;
    }
}
exports.AdminLicenseInfo = AdminLicenseInfo;
class AdminKycDocument {
    constructor(id, docType, docNumber, issueDate, expiryDate, verificationStatus, comments, isExpired, createdAt, updatedAt) {
        this.id = id;
        this.docType = docType;
        this.docNumber = docNumber;
        this.issueDate = issueDate;
        this.expiryDate = expiryDate;
        this.verificationStatus = verificationStatus;
        this.comments = comments;
        this.isExpired = isExpired;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
}
exports.AdminKycDocument = AdminKycDocument;
class DriverStatistics {
    constructor(totalRides, totalEarnings, rating, lastRideDate) {
        this.totalRides = totalRides;
        this.totalEarnings = totalEarnings;
        this.rating = rating;
        this.lastRideDate = lastRideDate;
    }
}
exports.DriverStatistics = DriverStatistics;
class AdminUserInfo {
    constructor(id, name, email, mobile, profilePicture) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.mobile = mobile;
        this.profilePicture = profilePicture;
    }
}
exports.AdminUserInfo = AdminUserInfo;
class AdminDriverInfo {
    constructor(id, userId, status, kycStatus, licenceCategory, eligibleGearTypes, eligibleBodyTypes, licenseIssueDate, licenseExpiryDate, createdAt, updatedAt) {
        this.id = id;
        this.userId = userId;
        this.status = status;
        this.kycStatus = kycStatus;
        this.licenceCategory = licenceCategory;
        this.eligibleGearTypes = eligibleGearTypes;
        this.eligibleBodyTypes = eligibleBodyTypes;
        this.licenseIssueDate = licenseIssueDate;
        this.licenseExpiryDate = licenseExpiryDate;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
}
exports.AdminDriverInfo = AdminDriverInfo;
class AdminDriverProfileData {
    constructor(driver, user, stats, kycDocuments) {
        this.driver = driver;
        this.user = user;
        this.stats = stats;
        this.kycDocuments = kycDocuments;
    }
}
exports.AdminDriverProfileData = AdminDriverProfileData;
class AdminGetDriverProfileResponseDto extends AdminDriverProfileData {
    constructor(driver, user, stats, kycDocuments) {
        super(driver, user, stats, kycDocuments);
    }
}
exports.AdminGetDriverProfileResponseDto = AdminGetDriverProfileResponseDto;
//# sourceMappingURL=GetDriverProfileResponseDto.js.map