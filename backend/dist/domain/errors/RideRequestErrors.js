"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RideRequestErrors = void 0;
const DomainError_1 = require("./DomainError");
const ErrorType_1 = require("@shared/enums/ErrorType");
const HttpStatusCodes_1 = require("@shared/enums/HttpStatusCodes");
const errorMessageFormatter_1 = require("@shared/utils/errorMessageFormatter");
const RideRequestMessages_1 = require("@shared/constants/RideRequestMessages");
class RideRequestErrors {
    static driverNotFound(driverId) {
        return new DomainError_1.DomainError((0, errorMessageFormatter_1.formatMessage)(RideRequestMessages_1.RIDE_REQUEST_ERROR_MESSAGES.DRIVER_NOT_FOUND, {
            driverId,
        }), "DRIVER_NOT_FOUND", {
            statusCode: HttpStatusCodes_1.HttpStatusCodes.NOT_FOUND,
            errorType: ErrorType_1.ErrorType.NOT_FOUND_ERROR,
            shouldLog: false,
            isOperational: true,
            category: "NOT_FOUND",
        });
    }
    static rideRequestNotFound(requestId) {
        return new DomainError_1.DomainError((0, errorMessageFormatter_1.formatMessage)(RideRequestMessages_1.RIDE_REQUEST_ERROR_MESSAGES.RIDE_REQUEST_NOT_FOUND, {
            requestId,
        }), "RIDE_REQUEST_NOT_FOUND", {
            statusCode: HttpStatusCodes_1.HttpStatusCodes.NOT_FOUND,
            errorType: ErrorType_1.ErrorType.NOT_FOUND_ERROR,
            shouldLog: false,
            isOperational: true,
            category: "NOT_FOUND",
        });
    }
    static noPendingRequestsFound() {
        return new DomainError_1.DomainError(RideRequestMessages_1.RIDE_REQUEST_ERROR_MESSAGES.NO_PENDING_REQUEST_FOUND, "NO_PENDING_REQUEST_FOUND", {
            statusCode: HttpStatusCodes_1.HttpStatusCodes.NOT_FOUND,
            errorType: ErrorType_1.ErrorType.NOT_FOUND_ERROR,
            shouldLog: false,
            isOperational: true,
            category: "NOT_FOUND",
        });
    }
    static userNotFound(userId) {
        return new DomainError_1.DomainError((0, errorMessageFormatter_1.formatMessage)(RideRequestMessages_1.RIDE_REQUEST_ERROR_MESSAGES.USER_NOT_FOUND, {
            userId,
        }), "USER_NOT_FOUND", {
            statusCode: HttpStatusCodes_1.HttpStatusCodes.NOT_FOUND,
            errorType: ErrorType_1.ErrorType.NOT_FOUND_ERROR,
            shouldLog: false,
            isOperational: true,
            category: "NOT_FOUND",
        });
    }
    static invalidFare(fare) {
        return new DomainError_1.DomainError((0, errorMessageFormatter_1.formatMessage)(RideRequestMessages_1.RIDE_REQUEST_ERROR_MESSAGES.INVALID_FARE, {
            fare: String(fare),
        }), "INVALID_FARE", {
            statusCode: HttpStatusCodes_1.HttpStatusCodes.BAD_REQUEST,
            errorType: ErrorType_1.ErrorType.VALIDATION_ERROR,
            shouldLog: false,
            isOperational: true,
            category: "VALIDATION",
        });
    }
    static invalidPickupTime(pickupTime) {
        return new DomainError_1.DomainError((0, errorMessageFormatter_1.formatMessage)(RideRequestMessages_1.RIDE_REQUEST_ERROR_MESSAGES.INVALID_PICKUP_TIME, {
            pickupTime: pickupTime.toISOString(),
        }), "INVALID_PICKUP_TIME", {
            statusCode: HttpStatusCodes_1.HttpStatusCodes.BAD_REQUEST,
            errorType: ErrorType_1.ErrorType.VALIDATION_ERROR,
            shouldLog: false,
            isOperational: true,
            category: "VALIDATION",
        });
    }
    static invalidLocation(fieldName) {
        return new DomainError_1.DomainError((0, errorMessageFormatter_1.formatMessage)(RideRequestMessages_1.RIDE_REQUEST_ERROR_MESSAGES.INVALID_LOCATION, {
            fieldName,
        }), "INVALID_LOCATION", {
            statusCode: HttpStatusCodes_1.HttpStatusCodes.BAD_REQUEST,
            errorType: ErrorType_1.ErrorType.VALIDATION_ERROR,
            shouldLog: false,
            isOperational: true,
            category: "VALIDATION",
        });
    }
    static invalidRideType(rideType) {
        return new DomainError_1.DomainError((0, errorMessageFormatter_1.formatMessage)(RideRequestMessages_1.RIDE_REQUEST_ERROR_MESSAGES.INVALID_RIDE_TYPE, {
            rideType,
        }), "INVALID_RIDE_TYPE", {
            statusCode: HttpStatusCodes_1.HttpStatusCodes.BAD_REQUEST,
            errorType: ErrorType_1.ErrorType.VALIDATION_ERROR,
            shouldLog: false,
            isOperational: true,
            category: "VALIDATION",
        });
    }
    static driverNotAvailable(driverId) {
        return new DomainError_1.DomainError((0, errorMessageFormatter_1.formatMessage)(RideRequestMessages_1.RIDE_REQUEST_ERROR_MESSAGES.DRIVER_NOT_AVAILABLE, {
            driverId,
        }), "DRIVER_NOT_AVAILABLE", {
            statusCode: HttpStatusCodes_1.HttpStatusCodes.CONFLICT,
            errorType: ErrorType_1.ErrorType.CONFLICT_ERROR,
            shouldLog: false,
            isOperational: true,
            category: "CONFLICT",
        });
    }
    static duplicateRideRequest(riderId, driverId) {
        return new DomainError_1.DomainError((0, errorMessageFormatter_1.formatMessage)(RideRequestMessages_1.RIDE_REQUEST_ERROR_MESSAGES.DUPLICATE_RIDE_REQUEST, {
            riderId,
            driverId,
        }), "DUPLICATE_RIDE_REQUEST", {
            statusCode: HttpStatusCodes_1.HttpStatusCodes.CONFLICT,
            errorType: ErrorType_1.ErrorType.CONFLICT_ERROR,
            shouldLog: false,
            isOperational: true,
            category: "CONFLICT",
        });
    }
    static rideRequestNotForDriver(requestId, driverId) {
        return new DomainError_1.DomainError((0, errorMessageFormatter_1.formatMessage)(RideRequestMessages_1.RIDE_REQUEST_ERROR_MESSAGES.REQUEST_DRIVER_MISMATCH, {
            driverId,
        }), "REQUEST_DRIVER_MISMATCH", {
            statusCode: HttpStatusCodes_1.HttpStatusCodes.FORBIDDEN,
            errorType: ErrorType_1.ErrorType.AUTHORIZATION_ERROR,
            shouldLog: false,
            isOperational: true,
            category: "AUTH",
        });
    }
    static rideRequestNotPending(requestId, requestStatus) {
        return new DomainError_1.DomainError((0, errorMessageFormatter_1.formatMessage)(RideRequestMessages_1.RIDE_REQUEST_ERROR_MESSAGES.REQUEST_NOT_IN_PENDING, {
            requestId,
            status: requestStatus,
        }), "REQUEST_NOT_IN_PENDING", {
            statusCode: HttpStatusCodes_1.HttpStatusCodes.CONFLICT,
            errorType: ErrorType_1.ErrorType.CONFLICT_ERROR,
            shouldLog: false,
            isOperational: true,
            category: "CONFLICT",
        });
    }
    static rideRequestCreationFailed(reason) {
        const formattedReason = reason ? `: ${reason}` : "";
        return new DomainError_1.DomainError((0, errorMessageFormatter_1.formatMessage)(RideRequestMessages_1.RIDE_REQUEST_ERROR_MESSAGES.RIDE_REQUEST_CREATION_FAILED, {
            reason: formattedReason,
        }), "RIDE_REQUEST_CREATION_FAILED", {
            statusCode: HttpStatusCodes_1.HttpStatusCodes.INTERNAL_SERVER_ERROR,
            errorType: ErrorType_1.ErrorType.SERVER_ERROR,
            shouldLog: true,
            isOperational: false,
            category: "SERVER",
        });
    }
    static requestAlreadyBeingProcessed(requestId) {
        return new DomainError_1.DomainError((0, errorMessageFormatter_1.formatMessage)(RideRequestMessages_1.RIDE_REQUEST_ERROR_MESSAGES.RIDE_REQUEST_ALREADY_PROCESSING, { requestId }), "RIDE_REQUEST_ALREADY_PROCESSING", {
            statusCode: HttpStatusCodes_1.HttpStatusCodes.CONFLICT,
            errorType: ErrorType_1.ErrorType.CONFLICT_ERROR,
            shouldLog: false,
            isOperational: true,
            category: "CONFLICT",
        });
    }
    static requestAlreadyAccepted(requestId) {
        return new DomainError_1.DomainError((0, errorMessageFormatter_1.formatMessage)(RideRequestMessages_1.RIDE_REQUEST_ERROR_MESSAGES.RIDE_REQUEST_ALREADY_ACCEPTED, {
            requestId,
        }), "RIDE_REQUEST_ALREADY_ACCEPTED", {
            statusCode: HttpStatusCodes_1.HttpStatusCodes.CONFLICT,
            errorType: ErrorType_1.ErrorType.CONFLICT_ERROR,
            shouldLog: false,
            isOperational: true,
            category: "CONFLICT",
        });
    }
    static rideRequestExpired(requestId) {
        return new DomainError_1.DomainError((0, errorMessageFormatter_1.formatMessage)(RideRequestMessages_1.RIDE_REQUEST_ERROR_MESSAGES.RIDE_REQUEST_EXPIRED, {
            requestId,
        }), "RIDE_REQUEST_EXPIRED", {
            statusCode: HttpStatusCodes_1.HttpStatusCodes.GONE,
            errorType: ErrorType_1.ErrorType.CONFLICT_ERROR,
            shouldLog: false,
            isOperational: true,
            category: "CONFLICT",
        });
    }
}
exports.RideRequestErrors = RideRequestErrors;
//# sourceMappingURL=RideRequestErrors.js.map