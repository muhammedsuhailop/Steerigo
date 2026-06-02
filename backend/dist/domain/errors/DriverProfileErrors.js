"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DriverAccessDeniedError = exports.ResourceNotFoundError = exports.KycDocumentNotFoundError = exports.DriverProfileNotFoundError = exports.UserNotFoundError = void 0;
const DriverMessages_1 = require("@shared/constants/DriverMessages");
const DomainError_1 = require("./DomainError");
const ErrorType_1 = require("@shared/enums/ErrorType");
const HttpStatusCodes_1 = require("@shared/enums/HttpStatusCodes");
class UserNotFoundError extends DomainError_1.DomainError {
    constructor(userId) {
        super(`${DriverMessages_1.DRIVER_ERROR_MESSAGES.USER_NOT_FOUND} with ID: ${userId}`, "USER_NOT_FOUND", {
            statusCode: HttpStatusCodes_1.HttpStatusCodes.NOT_FOUND,
            errorType: ErrorType_1.ErrorType.NOT_FOUND_ERROR,
            shouldLog: false,
            isOperational: true,
            category: "NOT_FOUND",
        });
        this.name = "UserNotFoundError";
    }
}
exports.UserNotFoundError = UserNotFoundError;
class DriverProfileNotFoundError extends DomainError_1.DomainError {
    constructor(userId) {
        super(`${DriverMessages_1.DRIVER_ERROR_MESSAGES.DRIVER_PROFILE_NOT_FOUND} for user ID: ${userId}`, "DRIVER_PROFILE_NOT_FOUND", {
            statusCode: HttpStatusCodes_1.HttpStatusCodes.NOT_FOUND,
            errorType: ErrorType_1.ErrorType.NOT_FOUND_ERROR,
            shouldLog: false,
            isOperational: true,
            category: "NOT_FOUND",
        });
        this.name = "DriverProfileNotFoundError";
    }
}
exports.DriverProfileNotFoundError = DriverProfileNotFoundError;
class KycDocumentNotFoundError extends DomainError_1.DomainError {
    constructor(driverId, docType) {
        const base = DriverMessages_1.DRIVER_ERROR_MESSAGES.KYC_DOCUMENT_NOT_FOUND;
        const message = docType
            ? `${base} of type '${docType}' for driver ID: ${driverId}`
            : `${base}s for driver ID: ${driverId}`;
        super(message, "KYC_DOCUMENT_NOT_FOUND", {
            statusCode: HttpStatusCodes_1.HttpStatusCodes.NOT_FOUND,
            errorType: ErrorType_1.ErrorType.NOT_FOUND_ERROR,
            shouldLog: false,
            isOperational: true,
            category: "NOT_FOUND",
        });
        this.name = "KycDocumentNotFoundError";
    }
}
exports.KycDocumentNotFoundError = KycDocumentNotFoundError;
class ResourceNotFoundError extends DomainError_1.DomainError {
    constructor(resource, identifier) {
        super(`${DriverMessages_1.DRIVER_ERROR_MESSAGES.RESOURCE_NOT_FOUND}: ${resource} ${identifier}`, "RESOURCE_NOT_FOUND", {
            statusCode: HttpStatusCodes_1.HttpStatusCodes.NOT_FOUND,
            errorType: ErrorType_1.ErrorType.NOT_FOUND_ERROR,
            shouldLog: false,
            isOperational: true,
            category: "NOT_FOUND",
        });
        this.name = "ResourceNotFoundError";
    }
}
exports.ResourceNotFoundError = ResourceNotFoundError;
class DriverAccessDeniedError extends DomainError_1.DomainError {
    constructor(userId, reason) {
        super(`${DriverMessages_1.DRIVER_ERROR_MESSAGES.DRIVER_ACCESS_DENIED} ${userId}: ${reason}`, "DRIVER_ACCESS_DENIED", {
            statusCode: HttpStatusCodes_1.HttpStatusCodes.FORBIDDEN,
            errorType: ErrorType_1.ErrorType.AUTHORIZATION_ERROR,
            shouldLog: true,
            isOperational: true,
            category: "AUTH",
        });
        this.name = "DriverAccessDeniedError";
    }
}
exports.DriverAccessDeniedError = DriverAccessDeniedError;
//# sourceMappingURL=DriverProfileErrors.js.map