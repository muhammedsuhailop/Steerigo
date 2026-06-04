"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OtpNotFoundError = void 0;
const AuthConstants_1 = require("@shared/constants/AuthConstants");
const DomainError_1 = require("./DomainError");
const ErrorType_1 = require("@shared/enums/ErrorType");
const HttpStatusCodes_1 = require("@shared/enums/HttpStatusCodes");
class OtpNotFoundError extends DomainError_1.DomainError {
    constructor() {
        super(AuthConstants_1.AuthErrorMessages.OTP_NOT_FOUND, "OTP_NOT_FOUND", {
            statusCode: HttpStatusCodes_1.HttpStatusCodes.NOT_FOUND,
            errorType: ErrorType_1.ErrorType.NOT_FOUND_ERROR,
            shouldLog: false,
            isOperational: true,
            category: "NOT_FOUND",
        });
        this.name = "OtpNotFoundError";
    }
}
exports.OtpNotFoundError = OtpNotFoundError;
//# sourceMappingURL=OtpNotFoundError.js.map