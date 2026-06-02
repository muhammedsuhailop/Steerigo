"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RideCancellationErrors = void 0;
const RideMessages_1 = require("@shared/constants/RideMessages");
const DomainError_1 = require("./DomainError");
const ErrorType_1 = require("@shared/enums/ErrorType");
const HttpStatusCodes_1 = require("@shared/enums/HttpStatusCodes");
const errorMessageFormatter_1 = require("@shared/utils/errorMessageFormatter");
class RideCancellationErrors {
    static rideNotFound(rideId) {
        return new DomainError_1.DomainError((0, errorMessageFormatter_1.formatMessage)(RideMessages_1.RIDE_CANCELLATION_ERROR_MESSAGES.RIDE_NOT_FOUND, {
            rideId,
        }), "RIDE_NOT_FOUND", {
            statusCode: HttpStatusCodes_1.HttpStatusCodes.NOT_FOUND,
            errorType: ErrorType_1.ErrorType.NOT_FOUND_ERROR,
            shouldLog: false,
            isOperational: true,
            category: "NOT_FOUND",
        });
    }
    static unauthorizedCancellation(rideId) {
        return new DomainError_1.DomainError((0, errorMessageFormatter_1.formatMessage)(RideMessages_1.RIDE_CANCELLATION_ERROR_MESSAGES.UNAUTHORIZED_CANCELLATION, {
            rideId,
        }), "UNAUTHORIZED_CANCELLATION", {
            statusCode: HttpStatusCodes_1.HttpStatusCodes.FORBIDDEN,
            errorType: ErrorType_1.ErrorType.AUTHORIZATION_ERROR,
            shouldLog: false,
            isOperational: true,
            category: "AUTH",
        });
    }
    static rideAlreadyCancelled(rideId) {
        return new DomainError_1.DomainError((0, errorMessageFormatter_1.formatMessage)(RideMessages_1.RIDE_CANCELLATION_ERROR_MESSAGES.RIDE_ALREADY_CANCELLED, {
            rideId,
        }), "RIDE_ALREADY_CANCELLED", {
            statusCode: HttpStatusCodes_1.HttpStatusCodes.CONFLICT,
            errorType: ErrorType_1.ErrorType.CONFLICT_ERROR,
            shouldLog: false,
            isOperational: true,
            category: "CONFLICT",
        });
    }
    static cannotCancelCompletedRide(rideId) {
        return new DomainError_1.DomainError((0, errorMessageFormatter_1.formatMessage)(RideMessages_1.RIDE_CANCELLATION_ERROR_MESSAGES.CANNOT_CANCEL_COMPLETED_RIDE, { rideId }), "CANNOT_CANCEL_COMPLETED_RIDE", {
            statusCode: HttpStatusCodes_1.HttpStatusCodes.CONFLICT,
            errorType: ErrorType_1.ErrorType.CONFLICT_ERROR,
            shouldLog: false,
            isOperational: true,
            category: "CONFLICT",
        });
    }
    static cannotCancelStartedRide(rideId) {
        return new DomainError_1.DomainError((0, errorMessageFormatter_1.formatMessage)(RideMessages_1.RIDE_CANCELLATION_ERROR_MESSAGES.CANNOT_CANCEL_STARTED_RIDE, { rideId }), "CANNOT_CANCEL_STARTED_RIDE", {
            statusCode: HttpStatusCodes_1.HttpStatusCodes.CONFLICT,
            errorType: ErrorType_1.ErrorType.CONFLICT_ERROR,
            shouldLog: false,
            isOperational: true,
            category: "CONFLICT",
        });
    }
    static chargeCalculationFailed(rideId, reason) {
        return new DomainError_1.DomainError((0, errorMessageFormatter_1.formatMessage)(RideMessages_1.RIDE_CANCELLATION_ERROR_MESSAGES.CHARGE_CALCULATION_FAILED, { rideId, reason }), "CANCELLATION_CHARGE_CALCULATION_FAILED", {
            statusCode: HttpStatusCodes_1.HttpStatusCodes.INTERNAL_SERVER_ERROR,
            errorType: ErrorType_1.ErrorType.SERVER_ERROR,
            shouldLog: true,
            isOperational: false,
            category: "SERVER",
        });
    }
    static fareResetFailed(rideId, reason) {
        return new DomainError_1.DomainError((0, errorMessageFormatter_1.formatMessage)(RideMessages_1.RIDE_CANCELLATION_ERROR_MESSAGES.FARE_RESET_FAILED, {
            rideId,
            reason,
        }), "CANCELLATION_FARE_RESET_FAILED", {
            statusCode: HttpStatusCodes_1.HttpStatusCodes.INTERNAL_SERVER_ERROR,
            errorType: ErrorType_1.ErrorType.SERVER_ERROR,
            shouldLog: true,
            isOperational: false,
            category: "SERVER",
        });
    }
    static invalidCancellationReason(reason) {
        return new DomainError_1.DomainError((0, errorMessageFormatter_1.formatMessage)(RideMessages_1.RIDE_CANCELLATION_ERROR_MESSAGES.INVALID_CANCELLATION_REASON, { reason }), "INVALID_CANCELLATION_REASON", {
            statusCode: HttpStatusCodes_1.HttpStatusCodes.BAD_REQUEST,
            errorType: ErrorType_1.ErrorType.VALIDATION_ERROR,
            shouldLog: false,
            isOperational: true,
            category: "VALIDATION",
        });
    }
    static driverNotFound(userId) {
        return new DomainError_1.DomainError((0, errorMessageFormatter_1.formatMessage)(RideMessages_1.DRIVER_RIDE_CANCELLATION_ERROR_MESSAGES.DRIVER_NOT_FOUND, {
            userId,
        }), "DRIVER_NOT_FOUND", {
            statusCode: HttpStatusCodes_1.HttpStatusCodes.NOT_FOUND,
            errorType: ErrorType_1.ErrorType.NOT_FOUND_ERROR,
            shouldLog: false,
            isOperational: true,
            category: "NOT_FOUND",
        });
    }
    static unauthorizedDriverCancellation(driverId, rideId) {
        return new DomainError_1.DomainError((0, errorMessageFormatter_1.formatMessage)(RideMessages_1.DRIVER_RIDE_CANCELLATION_ERROR_MESSAGES.UNAUTHORIZED_CANCELLATION, { driverId, rideId }), "UNAUTHORIZED_DRIVER_CANCELLATION", {
            statusCode: HttpStatusCodes_1.HttpStatusCodes.FORBIDDEN,
            errorType: ErrorType_1.ErrorType.AUTHORIZATION_ERROR,
            shouldLog: false,
            isOperational: true,
            category: "AUTH",
        });
    }
    static driverChargeCalculationFailed(rideId, reason) {
        return new DomainError_1.DomainError((0, errorMessageFormatter_1.formatMessage)(RideMessages_1.DRIVER_RIDE_CANCELLATION_ERROR_MESSAGES.CHARGE_CALCULATION_FAILED, { rideId, reason }), "DRIVER_CANCELLATION_CHARGE_CALCULATION_FAILED", {
            statusCode: HttpStatusCodes_1.HttpStatusCodes.INTERNAL_SERVER_ERROR,
            errorType: ErrorType_1.ErrorType.SERVER_ERROR,
            shouldLog: true,
            isOperational: false,
            category: "SERVER",
        });
    }
    static driverFareResetFailed(rideId, reason) {
        return new DomainError_1.DomainError((0, errorMessageFormatter_1.formatMessage)(RideMessages_1.DRIVER_RIDE_CANCELLATION_ERROR_MESSAGES.FARE_RESET_FAILED, {
            rideId,
            reason,
        }), "DRIVER_CANCELLATION_FARE_RESET_FAILED", {
            statusCode: HttpStatusCodes_1.HttpStatusCodes.INTERNAL_SERVER_ERROR,
            errorType: ErrorType_1.ErrorType.SERVER_ERROR,
            shouldLog: true,
            isOperational: false,
            category: "SERVER",
        });
    }
    static invalidDriverCancellationReason(reason) {
        return new DomainError_1.DomainError((0, errorMessageFormatter_1.formatMessage)(RideMessages_1.DRIVER_RIDE_CANCELLATION_ERROR_MESSAGES.INVALID_CANCELLATION_REASON, { reason }), "INVALID_DRIVER_CANCELLATION_REASON", {
            statusCode: HttpStatusCodes_1.HttpStatusCodes.BAD_REQUEST,
            errorType: ErrorType_1.ErrorType.VALIDATION_ERROR,
            shouldLog: false,
            isOperational: true,
            category: "VALIDATION",
        });
    }
    static walletNotFound(driverId) {
        return new DomainError_1.DomainError((0, errorMessageFormatter_1.formatMessage)(RideMessages_1.DRIVER_RIDE_CANCELLATION_ERROR_MESSAGES.WALLET_NOT_FOUND, {
            driverId,
        }), "DRIVER_WALLET_NOT_FOUND", {
            statusCode: HttpStatusCodes_1.HttpStatusCodes.NOT_FOUND,
            errorType: ErrorType_1.ErrorType.NOT_FOUND_ERROR,
            shouldLog: true,
            isOperational: true,
            category: "NOT_FOUND",
        });
    }
}
exports.RideCancellationErrors = RideCancellationErrors;
//# sourceMappingURL=RideCancellationErrors.js.map