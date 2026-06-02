"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FutureRideErrors = void 0;
const DomainError_1 = require("./DomainError");
const ErrorType_1 = require("@shared/enums/ErrorType");
const HttpStatusCodes_1 = require("@shared/enums/HttpStatusCodes");
const errorMessageFormatter_1 = require("@shared/utils/errorMessageFormatter");
const FutureRideMessages_1 = require("@shared/constants/FutureRideMessages");
class FutureRideErrors {
    static noDriversFound() {
        return new DomainError_1.DomainError(FutureRideMessages_1.FUTURE_RIDE_ERROR_MESSAGES.NO_DRIVERS_FOUND, "FUTURE_RIDE_NO_DRIVERS_FOUND", {
            statusCode: HttpStatusCodes_1.HttpStatusCodes.NOT_FOUND,
            errorType: ErrorType_1.ErrorType.NOT_FOUND_ERROR,
            shouldLog: false,
            isOperational: true,
            category: "NOT_FOUND",
        });
    }
    static requestGroupNotFound(requestGroupId) {
        return new DomainError_1.DomainError((0, errorMessageFormatter_1.formatMessage)(FutureRideMessages_1.FUTURE_RIDE_ERROR_MESSAGES.REQUEST_GROUP_NOT_FOUND, {
            requestGroupId,
        }), "FUTURE_RIDE_GROUP_NOT_FOUND", {
            statusCode: HttpStatusCodes_1.HttpStatusCodes.NOT_FOUND,
            errorType: ErrorType_1.ErrorType.NOT_FOUND_ERROR,
            shouldLog: false,
            isOperational: true,
            category: "NOT_FOUND",
        });
    }
    static unauthorizedCancellation(requestGroupId) {
        return new DomainError_1.DomainError((0, errorMessageFormatter_1.formatMessage)(FutureRideMessages_1.FUTURE_RIDE_ERROR_MESSAGES.UNAUTHORIZED_CANCELLATION, {
            requestGroupId,
        }), "FUTURE_RIDE_UNAUTHORIZED_CANCELLATION", {
            statusCode: HttpStatusCodes_1.HttpStatusCodes.FORBIDDEN,
            errorType: ErrorType_1.ErrorType.AUTHORIZATION_ERROR,
            shouldLog: false,
            isOperational: true,
            category: "AUTH",
        });
    }
    static cannotCancelRequest(requestGroupId, status) {
        return new DomainError_1.DomainError((0, errorMessageFormatter_1.formatMessage)(FutureRideMessages_1.FUTURE_RIDE_ERROR_MESSAGES.CANNOT_CANCEL, {
            requestGroupId,
            status,
        }), "FUTURE_RIDE_CANNOT_CANCEL", {
            statusCode: HttpStatusCodes_1.HttpStatusCodes.CONFLICT,
            errorType: ErrorType_1.ErrorType.CONFLICT_ERROR,
            shouldLog: false,
            isOperational: true,
            category: "CONFLICT",
        });
    }
    static pickupTimeTooSoon() {
        return new DomainError_1.DomainError(FutureRideMessages_1.FUTURE_RIDE_ERROR_MESSAGES.PICKUP_TIME_TOO_SOON, "FUTURE_RIDE_PICKUP_TIME_TOO_SOON", {
            statusCode: HttpStatusCodes_1.HttpStatusCodes.BAD_REQUEST,
            errorType: ErrorType_1.ErrorType.VALIDATION_ERROR,
            shouldLog: false,
            isOperational: true,
            category: "VALIDATION",
        });
    }
    static scheduleFailed(reason) {
        return new DomainError_1.DomainError(`${FutureRideMessages_1.FUTURE_RIDE_ERROR_MESSAGES.SCHEDULE_FAILED} ${reason}`, "FUTURE_RIDE_SCHEDULE_FAILED", {
            statusCode: HttpStatusCodes_1.HttpStatusCodes.INTERNAL_SERVER_ERROR,
            errorType: ErrorType_1.ErrorType.SERVER_ERROR,
            shouldLog: true,
            isOperational: false,
            category: "SERVER",
        });
    }
    static timeSlotConflict() {
        return new DomainError_1.DomainError(FutureRideMessages_1.FUTURE_RIDE_ERROR_MESSAGES.TIME_SLOT_CONFLICT, "FUTURE_RIDE_TIME_SLOT_CONFLICT", {
            statusCode: HttpStatusCodes_1.HttpStatusCodes.CONFLICT,
            errorType: ErrorType_1.ErrorType.CONFLICT_ERROR,
            shouldLog: false,
            isOperational: true,
            category: "CONFLICT",
        });
    }
}
exports.FutureRideErrors = FutureRideErrors;
//# sourceMappingURL=FutureRideErrors.js.map