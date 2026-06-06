"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailNotVerifiedError = void 0;
const AuthConstants_1 = require("../../shared/constants/AuthConstants");
const DomainError_1 = require("./DomainError");
const ErrorType_1 = require("../../shared/enums/ErrorType");
const HttpStatusCodes_1 = require("../../shared/enums/HttpStatusCodes");
class EmailNotVerifiedError extends DomainError_1.DomainError {
    constructor() {
        super(AuthConstants_1.AuthErrorMessages.EMAIL_NOT_VERIFIED, "EMAIL_NOT_VERIFIED", {
            statusCode: HttpStatusCodes_1.HttpStatusCodes.FORBIDDEN,
            errorType: ErrorType_1.ErrorType.AUTHORIZATION_ERROR,
            shouldLog: false,
            isOperational: true,
            category: "AUTH",
        });
        this.name = "EmailNotVerifiedError";
    }
}
exports.EmailNotVerifiedError = EmailNotVerifiedError;
//# sourceMappingURL=EmailNotVerifiedError.js.map