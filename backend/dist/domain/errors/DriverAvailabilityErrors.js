"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AvailabilityExceptionNotFoundError = exports.DriverProfileNotFoundError = exports.ExpiredAvailabilityError = exports.InvalidStatusTransitionError = exports.DriverAlreadyAvailableError = exports.InvalidAvailabilityScheduleError = exports.DriverAvailabilityNotFoundError = void 0;
const DriverMessages_1 = require("@shared/constants/DriverMessages");
const DomainError_1 = require("./DomainError");
const ErrorType_1 = require("@shared/enums/ErrorType");
const HttpStatusCodes_1 = require("@shared/enums/HttpStatusCodes");
const errorMessageFormatter_1 = require("@shared/utils/errorMessageFormatter");
class DriverAvailabilityNotFoundError extends DomainError_1.DomainError {
    constructor(driverId) {
        const driverPart = driverId ? ` for driver ID: ${driverId}` : "";
        super((0, errorMessageFormatter_1.formatMessage)(DriverMessages_1.DRIVER_AVAILABILITY_ERROR_MESSAGES.DRIVER_AVAILABILITY_NOT_FOUND, { driverPart }), "DRIVER_AVAILABILITY_NOT_FOUND", {
            statusCode: HttpStatusCodes_1.HttpStatusCodes.NOT_FOUND,
            errorType: ErrorType_1.ErrorType.NOT_FOUND_ERROR,
            shouldLog: false,
            isOperational: true,
            category: "NOT_FOUND",
        });
        this.name = "DriverAvailabilityNotFoundError";
    }
}
exports.DriverAvailabilityNotFoundError = DriverAvailabilityNotFoundError;
class InvalidAvailabilityScheduleError extends DomainError_1.DomainError {
    constructor(reason) {
        super((0, errorMessageFormatter_1.formatMessage)(DriverMessages_1.DRIVER_AVAILABILITY_ERROR_MESSAGES.INVALID_AVAILABILITY_SCHEDULE, { reason }), "INVALID_AVAILABILITY_SCHEDULE", {
            statusCode: HttpStatusCodes_1.HttpStatusCodes.BAD_REQUEST,
            errorType: ErrorType_1.ErrorType.VALIDATION_ERROR,
            shouldLog: false,
            isOperational: true,
            category: "VALIDATION",
        });
        this.name = "InvalidAvailabilityScheduleError";
    }
}
exports.InvalidAvailabilityScheduleError = InvalidAvailabilityScheduleError;
class DriverAlreadyAvailableError extends DomainError_1.DomainError {
    constructor(driverId) {
        super((0, errorMessageFormatter_1.formatMessage)(DriverMessages_1.DRIVER_AVAILABILITY_ERROR_MESSAGES.DRIVER_ALREADY_AVAILABLE, { driverId }), "DRIVER_ALREADY_AVAILABLE", {
            statusCode: HttpStatusCodes_1.HttpStatusCodes.CONFLICT,
            errorType: ErrorType_1.ErrorType.CONFLICT_ERROR,
            shouldLog: false,
            isOperational: true,
            category: "CONFLICT",
        });
        this.name = "DriverAlreadyAvailableError";
    }
}
exports.DriverAlreadyAvailableError = DriverAlreadyAvailableError;
class InvalidStatusTransitionError extends DomainError_1.DomainError {
    constructor(currentStatus, newStatus) {
        super((0, errorMessageFormatter_1.formatMessage)(DriverMessages_1.DRIVER_AVAILABILITY_ERROR_MESSAGES.INVALID_STATUS_TRANSITION, { currentStatus, newStatus }), "INVALID_STATUS_TRANSITION", {
            statusCode: HttpStatusCodes_1.HttpStatusCodes.BAD_REQUEST,
            errorType: ErrorType_1.ErrorType.VALIDATION_ERROR,
            shouldLog: false,
            isOperational: true,
            category: "VALIDATION",
        });
        this.name = "InvalidStatusTransitionError";
    }
}
exports.InvalidStatusTransitionError = InvalidStatusTransitionError;
class ExpiredAvailabilityError extends DomainError_1.DomainError {
    constructor() {
        super(DriverMessages_1.DRIVER_AVAILABILITY_ERROR_MESSAGES.EXPIRED_AVAILABILITY, "EXPIRED_AVAILABILITY", {
            statusCode: HttpStatusCodes_1.HttpStatusCodes.GONE,
            errorType: ErrorType_1.ErrorType.VALIDATION_ERROR,
            shouldLog: false,
            isOperational: true,
            category: "VALIDATION",
        });
        this.name = "ExpiredAvailabilityError";
    }
}
exports.ExpiredAvailabilityError = ExpiredAvailabilityError;
class DriverProfileNotFoundError extends DomainError_1.DomainError {
    constructor(userId) {
        super((0, errorMessageFormatter_1.formatMessage)(DriverMessages_1.DRIVER_AVAILABILITY_ERROR_MESSAGES.DRIVER_PROFILE_NOT_FOUND, { userId }), "DRIVER_PROFILE_NOT_FOUND", {
            statusCode: HttpStatusCodes_1.HttpStatusCodes.NOT_FOUND,
            errorType: ErrorType_1.ErrorType.NOT_FOUND_ERROR,
            shouldLog: false,
            isOperational: true,
            category: "NOT_FOUND",
        });
        this.name = "DriverProfileNotFoundError";
    }
}
exports.DriverProfileNotFoundError = DriverProfileNotFoundError;
class AvailabilityExceptionNotFoundError extends DomainError_1.DomainError {
    constructor(exceptionId) {
        super((0, errorMessageFormatter_1.formatMessage)(DriverMessages_1.DRIVER_AVAILABILITY_ERROR_MESSAGES.AVAILABILITY_EXCEPTION_NOT_FOUND, { exceptionId }), "AVAILABILITY_EXCEPTION_NOT_FOUND", {
            statusCode: HttpStatusCodes_1.HttpStatusCodes.NOT_FOUND,
            errorType: ErrorType_1.ErrorType.NOT_FOUND_ERROR,
            shouldLog: false,
            isOperational: true,
            category: "NOT_FOUND",
        });
        this.name = "AvailabilityExceptionNotFoundError";
    }
}
exports.AvailabilityExceptionNotFoundError = AvailabilityExceptionNotFoundError;
//# sourceMappingURL=DriverAvailabilityErrors.js.map