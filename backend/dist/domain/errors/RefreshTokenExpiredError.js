"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RefreshTokenExpiredError = void 0;
const AuthConstants_1 = require("../../shared/constants/AuthConstants");
const DomainError_1 = require("./DomainError");
const ErrorType_1 = require("../../shared/enums/ErrorType");
const HttpStatusCodes_1 = require("../../shared/enums/HttpStatusCodes");
class RefreshTokenExpiredError extends DomainError_1.DomainError {
    constructor() {
        super(AuthConstants_1.AuthErrorMessages.REFRESH_TOKEN_EXPIRED, "REFRESH_TOKEN_EXPIRED", {
            statusCode: HttpStatusCodes_1.HttpStatusCodes.UNAUTHORIZED,
            errorType: ErrorType_1.ErrorType.AUTHENTICATION_ERROR,
            shouldLog: false,
            isOperational: true,
            category: "AUTH",
        });
        this.name = "RefreshTokenExpiredError";
    }
}
exports.RefreshTokenExpiredError = RefreshTokenExpiredError;
//# sourceMappingURL=RefreshTokenExpiredError.js.map