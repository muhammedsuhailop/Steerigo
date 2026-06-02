"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MaxOtpAttemptsError = void 0;
const AuthConstants_1 = require("../../shared/constants/AuthConstants");
const DomainError_1 = require("./DomainError");
const ErrorType_1 = require("../../shared/enums/ErrorType");
const HttpStatusCodes_1 = require("../../shared/enums/HttpStatusCodes");
class MaxOtpAttemptsError extends DomainError_1.DomainError {
    constructor() {
        super(AuthConstants_1.AuthErrorMessages.MAX_OTP_ATTEMPTS, "MAX_OTP_ATTEMPTS", {
            statusCode: HttpStatusCodes_1.HttpStatusCodes.TOO_MANY_REQUESTS,
            errorType: ErrorType_1.ErrorType.VALIDATION_ERROR,
            shouldLog: false,
            isOperational: true,
            category: "VALIDATION",
        });
        this.name = "MaxOtpAttemptsError";
    }
}
exports.MaxOtpAttemptsError = MaxOtpAttemptsError;
//# sourceMappingURL=MaxOtpAttemptsError.js.map