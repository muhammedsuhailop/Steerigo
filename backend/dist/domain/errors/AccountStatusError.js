"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountStatusError = void 0;
const DomainError_1 = require("./DomainError");
const ErrorType_1 = require("@shared/enums/ErrorType");
const HttpStatusCodes_1 = require("@shared/enums/HttpStatusCodes");
class AccountStatusError extends DomainError_1.DomainError {
    constructor(message, status) {
        super(message, "ACCOUNT_STATUS_ERROR", {
            statusCode: HttpStatusCodes_1.HttpStatusCodes.FORBIDDEN,
            errorType: ErrorType_1.ErrorType.AUTHORIZATION_ERROR,
            shouldLog: true,
            isOperational: true,
            category: "AUTH",
        });
        this.status = status;
        this.name = "AccountStatusError";
    }
}
exports.AccountStatusError = AccountStatusError;
//# sourceMappingURL=AccountStatusError.js.map