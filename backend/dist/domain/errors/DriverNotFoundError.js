"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DriverNotFoundError = void 0;
const DriverMessages_1 = require("@shared/constants/DriverMessages");
const DomainError_1 = require("./DomainError");
const ErrorType_1 = require("@shared/enums/ErrorType");
const HttpStatusCodes_1 = require("@shared/enums/HttpStatusCodes");
class DriverNotFoundError extends DomainError_1.DomainError {
    constructor(driverId) {
        super(`${DriverMessages_1.DRIVER_ERROR_MESSAGES.DRIVER_PROFILE_NOT_FOUND}${driverId ? ` with ID: ${driverId}` : ""}`, "DRIVER_NOT_FOUND", {
            statusCode: HttpStatusCodes_1.HttpStatusCodes.NOT_FOUND,
            errorType: ErrorType_1.ErrorType.NOT_FOUND_ERROR,
            shouldLog: false,
            isOperational: true,
            category: "NOT_FOUND",
        });
        this.name = "DriverNotFoundError";
    }
}
exports.DriverNotFoundError = DriverNotFoundError;
//# sourceMappingURL=DriverNotFoundError.js.map