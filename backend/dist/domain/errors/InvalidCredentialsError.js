"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvalidCredentialsError = void 0;
const AuthConstants_1 = require("../../shared/constants/AuthConstants");
const DomainError_1 = require("./DomainError");
const ErrorType_1 = require("../../shared/enums/ErrorType");
const HttpStatusCodes_1 = require("../../shared/enums/HttpStatusCodes");
class InvalidCredentialsError extends DomainError_1.DomainError {
    constructor() {
        super(AuthConstants_1.AuthMessages.INVALID_CREDENTIALS, "INVALID_CREDENTIALS", {
            statusCode: HttpStatusCodes_1.HttpStatusCodes.UNAUTHORIZED,
            errorType: ErrorType_1.ErrorType.AUTHENTICATION_ERROR,
            shouldLog: false,
            isOperational: true,
            category: "AUTH",
        });
        this.name = "InvalidCredentialsError";
    }
}
exports.InvalidCredentialsError = InvalidCredentialsError;
//# sourceMappingURL=InvalidCredentialsError.js.map