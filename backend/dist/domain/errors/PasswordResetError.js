"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PasswordResetError = void 0;
const AuthConstants_1 = require("@shared/constants/AuthConstants");
const DomainError_1 = require("./DomainError");
const ErrorType_1 = require("@shared/enums/ErrorType");
const HttpStatusCodes_1 = require("@shared/enums/HttpStatusCodes");
class PasswordResetError extends DomainError_1.DomainError {
    constructor(message = AuthConstants_1.AuthErrorMessages.PASSWORD_RESET_FAILED) {
        super(message, "PASSWORD_RESET_FAILED", {
            statusCode: HttpStatusCodes_1.HttpStatusCodes.BAD_REQUEST,
            errorType: ErrorType_1.ErrorType.VALIDATION_ERROR,
            shouldLog: true,
            isOperational: true,
            category: "VALIDATION",
        });
        this.name = "PasswordResetError";
    }
}
exports.PasswordResetError = PasswordResetError;
//# sourceMappingURL=PasswordResetError.js.map