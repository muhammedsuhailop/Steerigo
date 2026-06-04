"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OtpExpiredError = void 0;
const AuthConstants_1 = require("../../shared/constants/AuthConstants");
const DomainError_1 = require("./DomainError");
const ErrorType_1 = require("../../shared/enums/ErrorType");
const HttpStatusCodes_1 = require("../../shared/enums/HttpStatusCodes");
class OtpExpiredError extends DomainError_1.DomainError {
    constructor() {
        super(AuthConstants_1.AuthErrorMessages.OTP_EXPIRED, "OTP_EXPIRED", {
            statusCode: HttpStatusCodes_1.HttpStatusCodes.GONE,
            errorType: ErrorType_1.ErrorType.VALIDATION_ERROR,
            shouldLog: false,
            isOperational: true,
            category: "VALIDATION",
        });
        this.name = "OtpExpiredError";
    }
}
exports.OtpExpiredError = OtpExpiredError;
//# sourceMappingURL=OtpExpiredError.js.map