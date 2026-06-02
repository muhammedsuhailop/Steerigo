"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvalidKYCStatusTransitionError = exports.NonLicenseKYCNotApprovedError = exports.LicenseNotApprovedError = exports.ProfilePictureNotUploadedError = exports.KYCNotFoundError = void 0;
const DriverMessages_1 = require("@shared/constants/DriverMessages");
const DomainError_1 = require("./DomainError");
const ErrorType_1 = require("@shared/enums/ErrorType");
const HttpStatusCodes_1 = require("@shared/enums/HttpStatusCodes");
class KYCNotFoundError extends DomainError_1.DomainError {
    constructor(message = DriverMessages_1.KYC_ERROR_MESSAGES.KYC_NOT_FOUND) {
        super(message, "KYC_NOT_FOUND", {
            statusCode: HttpStatusCodes_1.HttpStatusCodes.NOT_FOUND,
            errorType: ErrorType_1.ErrorType.NOT_FOUND_ERROR,
            shouldLog: false,
            isOperational: true,
            category: "NOT_FOUND",
        });
        this.name = "KYCNotFoundError";
    }
}
exports.KYCNotFoundError = KYCNotFoundError;
class ProfilePictureNotUploadedError extends DomainError_1.DomainError {
    constructor(message = DriverMessages_1.KYC_ERROR_MESSAGES.PROFILE_PICTURE_NOT_UPLOADED) {
        super(message, "PROFILE_PICTURE_NOT_UPLOADED", {
            statusCode: HttpStatusCodes_1.HttpStatusCodes.BAD_REQUEST,
            errorType: ErrorType_1.ErrorType.VALIDATION_ERROR,
            shouldLog: false,
            isOperational: true,
            category: "VALIDATION",
        });
        this.name = "ProfilePictureNotUploadedError";
    }
}
exports.ProfilePictureNotUploadedError = ProfilePictureNotUploadedError;
class LicenseNotApprovedError extends DomainError_1.DomainError {
    constructor(message = DriverMessages_1.KYC_ERROR_MESSAGES.LICENSE_NOT_APPROVED) {
        super(message, "LICENSE_NOT_APPROVED", {
            statusCode: HttpStatusCodes_1.HttpStatusCodes.BAD_REQUEST,
            errorType: ErrorType_1.ErrorType.VALIDATION_ERROR,
            shouldLog: false,
            isOperational: true,
            category: "VALIDATION",
        });
        this.name = "LicenseNotApprovedError";
    }
}
exports.LicenseNotApprovedError = LicenseNotApprovedError;
class NonLicenseKYCNotApprovedError extends DomainError_1.DomainError {
    constructor(message = DriverMessages_1.KYC_ERROR_MESSAGES.NON_LICENSE_KYC_NOT_APPROVED) {
        super(message, "NON_LICENSE_KYC_NOT_APPROVED", {
            statusCode: HttpStatusCodes_1.HttpStatusCodes.BAD_REQUEST,
            errorType: ErrorType_1.ErrorType.VALIDATION_ERROR,
            shouldLog: false,
            isOperational: true,
            category: "VALIDATION",
        });
        this.name = "NonLicenseKYCNotApprovedError";
    }
}
exports.NonLicenseKYCNotApprovedError = NonLicenseKYCNotApprovedError;
class InvalidKYCStatusTransitionError extends DomainError_1.DomainError {
    constructor(message = DriverMessages_1.KYC_ERROR_MESSAGES.INVALID_KYC_STATUS_TRANSITION) {
        super(message, "INVALID_KYC_STATUS_TRANSITION", {
            statusCode: HttpStatusCodes_1.HttpStatusCodes.BAD_REQUEST,
            errorType: ErrorType_1.ErrorType.VALIDATION_ERROR,
            shouldLog: false,
            isOperational: true,
            category: "VALIDATION",
        });
        this.name = "InvalidKYCStatusTransitionError";
    }
}
exports.InvalidKYCStatusTransitionError = InvalidKYCStatusTransitionError;
//# sourceMappingURL=KYCValidationErrors.js.map