"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminUnauthorizedActionError = exports.AdminInvalidActionError = exports.AdminUserNotFoundError = void 0;
const AdminMessages_1 = require("@shared/constants/AdminMessages");
const DomainError_1 = require("./DomainError");
const ErrorType_1 = require("@shared/enums/ErrorType");
const HttpStatusCodes_1 = require("@shared/enums/HttpStatusCodes");
class AdminUserNotFoundError extends DomainError_1.DomainError {
    constructor(userId) {
        const baseMessage = AdminMessages_1.ADMIN_ERROR_MESSAGES.USER.NOT_FOUND;
        super(`${baseMessage}${userId ? ` with ID: ${userId}` : ""}`, "ADMIN_USER_NOT_FOUND", {
            statusCode: HttpStatusCodes_1.HttpStatusCodes.NOT_FOUND,
            errorType: ErrorType_1.ErrorType.NOT_FOUND_ERROR,
            shouldLog: false,
            isOperational: true,
            category: "NOT_FOUND",
        });
        this.name = "AdminUserNotFoundError";
    }
}
exports.AdminUserNotFoundError = AdminUserNotFoundError;
class AdminInvalidActionError extends DomainError_1.DomainError {
    constructor(action) {
        super(`${AdminMessages_1.ADMIN_ERROR_MESSAGES.USER.INVALID_ACTION}: ${action}`, "ADMIN_INVALID_ACTION", {
            statusCode: HttpStatusCodes_1.HttpStatusCodes.BAD_REQUEST,
            errorType: ErrorType_1.ErrorType.VALIDATION_ERROR,
            shouldLog: false,
            isOperational: true,
            category: "VALIDATION",
        });
        this.name = "AdminInvalidActionError";
    }
}
exports.AdminInvalidActionError = AdminInvalidActionError;
class AdminUnauthorizedActionError extends DomainError_1.DomainError {
    constructor(action, reason) {
        const baseMessage = AdminMessages_1.ADMIN_ERROR_MESSAGES.USER.UNAUTHORIZED_ACTION;
        super(`${baseMessage}: ${action}${reason ? `. ${reason}` : ""}`, "ADMIN_UNAUTHORIZED_ACTION", {
            statusCode: HttpStatusCodes_1.HttpStatusCodes.FORBIDDEN,
            errorType: ErrorType_1.ErrorType.AUTHORIZATION_ERROR,
            shouldLog: true,
            isOperational: true,
            category: "AUTH",
        });
        this.name = "AdminUnauthorizedActionError";
    }
}
exports.AdminUnauthorizedActionError = AdminUnauthorizedActionError;
//# sourceMappingURL=AdminErrors.js.map