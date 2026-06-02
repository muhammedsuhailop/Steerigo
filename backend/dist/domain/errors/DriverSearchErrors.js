"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LocationServiceError = exports.DriverFilterNotMatchError = exports.InvalidSearchDateError = exports.InvalidLocationError = exports.NoDriversAvailableError = void 0;
const DriverMessages_1 = require("@shared/constants/DriverMessages");
const DomainError_1 = require("./DomainError");
const ErrorType_1 = require("@shared/enums/ErrorType");
const HttpStatusCodes_1 = require("@shared/enums/HttpStatusCodes");
class NoDriversAvailableError extends DomainError_1.DomainError {
    constructor(message = DriverMessages_1.SEARCH_DRIVER_ERROR_MESSAGES.NO_DRIVERS_AVAILABLE) {
        super(message, "NO_DRIVERS_AVAILABLE", {
            statusCode: HttpStatusCodes_1.HttpStatusCodes.NOT_FOUND,
            errorType: ErrorType_1.ErrorType.NOT_FOUND_ERROR,
            shouldLog: false,
            isOperational: true,
            category: "NOT_FOUND",
        });
        this.name = "NoDriversAvailableError";
    }
}
exports.NoDriversAvailableError = NoDriversAvailableError;
class InvalidLocationError extends DomainError_1.DomainError {
    constructor(message = DriverMessages_1.SEARCH_DRIVER_ERROR_MESSAGES.INVALID_LOCATION) {
        super(message, "INVALID_LOCATION", {
            statusCode: HttpStatusCodes_1.HttpStatusCodes.BAD_REQUEST,
            errorType: ErrorType_1.ErrorType.VALIDATION_ERROR,
            shouldLog: false,
            isOperational: true,
            category: "VALIDATION",
        });
        this.name = "InvalidLocationError";
    }
}
exports.InvalidLocationError = InvalidLocationError;
class InvalidSearchDateError extends DomainError_1.DomainError {
    constructor(message = DriverMessages_1.SEARCH_DRIVER_ERROR_MESSAGES.INVALID_SEARCH_DATE) {
        super(message, "INVALID_SEARCH_DATE", {
            statusCode: HttpStatusCodes_1.HttpStatusCodes.BAD_REQUEST,
            errorType: ErrorType_1.ErrorType.VALIDATION_ERROR,
            shouldLog: false,
            isOperational: true,
            category: "VALIDATION",
        });
        this.name = "InvalidSearchDateError";
    }
}
exports.InvalidSearchDateError = InvalidSearchDateError;
class DriverFilterNotMatchError extends DomainError_1.DomainError {
    constructor(message = DriverMessages_1.SEARCH_DRIVER_ERROR_MESSAGES.DRIVER_FILTER_NOT_MATCH) {
        super(message, "DRIVER_FILTER_NOT_MATCH", {
            statusCode: HttpStatusCodes_1.HttpStatusCodes.NOT_FOUND,
            errorType: ErrorType_1.ErrorType.NOT_FOUND_ERROR,
            shouldLog: false,
            isOperational: true,
            category: "NOT_FOUND",
        });
        this.name = "DriverFilterNotMatchError";
    }
}
exports.DriverFilterNotMatchError = DriverFilterNotMatchError;
class LocationServiceError extends DomainError_1.DomainError {
    constructor(message = DriverMessages_1.SEARCH_DRIVER_ERROR_MESSAGES.LOCATION_SERVICE_ERROR) {
        super(message, "LOCATION_SERVICE_ERROR", {
            statusCode: HttpStatusCodes_1.HttpStatusCodes.SERVICE_UNAVAILABLE,
            errorType: ErrorType_1.ErrorType.SERVER_ERROR,
            shouldLog: true,
            isOperational: false,
            category: "SERVER",
        });
        this.name = "LocationServiceError";
    }
}
exports.LocationServiceError = LocationServiceError;
//# sourceMappingURL=DriverSearchErrors.js.map