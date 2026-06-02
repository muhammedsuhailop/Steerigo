"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MobileAlreadyExistsError = void 0;
const AuthConstants_1 = require("@shared/constants/AuthConstants");
const DomainError_1 = require("./DomainError");
const ErrorType_1 = require("@shared/enums/ErrorType");
const HttpStatusCodes_1 = require("@shared/enums/HttpStatusCodes");
class MobileAlreadyExistsError extends DomainError_1.DomainError {
    constructor() {
        super(AuthConstants_1.AuthErrorMessages.MOBILE_ALREADY_EXISTS, "MOBILE_ALREADY_EXISTS", {
            statusCode: HttpStatusCodes_1.HttpStatusCodes.CONFLICT,
            errorType: ErrorType_1.ErrorType.CONFLICT_ERROR,
            shouldLog: false,
            isOperational: true,
            category: "CONFLICT",
        });
        this.name = "MobileAlreadyExistsError";
    }
}
exports.MobileAlreadyExistsError = MobileAlreadyExistsError;
//# sourceMappingURL=MobileAlreadyExistsError.js.map