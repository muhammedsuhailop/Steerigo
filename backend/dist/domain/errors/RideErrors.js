"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RideErrors = void 0;
const RideMessages_1 = require("../../shared/constants/RideMessages");
const DomainError_1 = require("./DomainError");
const ErrorType_1 = require("../../shared/enums/ErrorType");
const HttpStatusCodes_1 = require("../../shared/enums/HttpStatusCodes");
const errorMessageFormatter_1 = require("../../shared/utils/errorMessageFormatter");
class RideErrors {
    static rideNotFound(rideId) {
        return new DomainError_1.DomainError((0, errorMessageFormatter_1.formatMessage)(RideMessages_1.RIDE_ERROR_MESSAGES.RIDE_NOT_FOUND, { rideId }), "RIDE_NOT_FOUND", {
            statusCode: HttpStatusCodes_1.HttpStatusCodes.NOT_FOUND,
            errorType: ErrorType_1.ErrorType.NOT_FOUND_ERROR,
            shouldLog: false,
            isOperational: true,
            category: "NOT_FOUND",
        });
    }
    static rideAlreadyAccepted(rideId) {
        return new DomainError_1.DomainError((0, errorMessageFormatter_1.formatMessage)(RideMessages_1.RIDE_ERROR_MESSAGES.RIDE_ALREADY_ACCEPTED, { rideId }), "RIDE_ALREADY_ACCEPTED", {
            statusCode: HttpStatusCodes_1.HttpStatusCodes.CONFLICT,
            errorType: ErrorType_1.ErrorType.CONFLICT_ERROR,
            shouldLog: false,
            isOperational: true,
            category: "CONFLICT",
        });
    }
    static rideAlreadyStarted(rideId) {
        return new DomainError_1.DomainError((0, errorMessageFormatter_1.formatMessage)(RideMessages_1.RIDE_ERROR_MESSAGES.RIDE_ALREADY_STARTED, { rideId }), "RIDE_ALREADY_STARTED", {
            statusCode: HttpStatusCodes_1.HttpStatusCodes.CONFLICT,
            errorType: ErrorType_1.ErrorType.CONFLICT_ERROR,
            shouldLog: false,
            isOperational: true,
            category: "CONFLICT",
        });
    }
    static rideAlreadyCompleted(rideId) {
        return new DomainError_1.DomainError((0, errorMessageFormatter_1.formatMessage)(RideMessages_1.RIDE_ERROR_MESSAGES.RIDE_ALREADY_COMPLETED, { rideId }), "RIDE_ALREADY_COMPLETED", {
            statusCode: HttpStatusCodes_1.HttpStatusCodes.CONFLICT,
            errorType: ErrorType_1.ErrorType.CONFLICT_ERROR,
            shouldLog: false,
            isOperational: true,
            category: "CONFLICT",
        });
    }
    static rideAlreadyCancelled(rideId) {
        return new DomainError_1.DomainError((0, errorMessageFormatter_1.formatMessage)(RideMessages_1.RIDE_ERROR_MESSAGES.RIDE_ALREADY_CANCELLED, { rideId }), "RIDE_ALREADY_CANCELLED", {
            statusCode: HttpStatusCodes_1.HttpStatusCodes.CONFLICT,
            errorType: ErrorType_1.ErrorType.CONFLICT_ERROR,
            shouldLog: false,
            isOperational: true,
            category: "CONFLICT",
        });
    }
    static driverAlreadyHasActiveRide(driverId, existingRideId) {
        return new DomainError_1.DomainError((0, errorMessageFormatter_1.formatMessage)(RideMessages_1.RIDE_ERROR_MESSAGES.DRIVER_HAS_ACTIVE_RIDE, {
            driverId,
            rideId: existingRideId,
        }), "DRIVER_HAS_ACTIVE_RIDE", {
            statusCode: HttpStatusCodes_1.HttpStatusCodes.CONFLICT,
            errorType: ErrorType_1.ErrorType.CONFLICT_ERROR,
            shouldLog: false,
            isOperational: true,
            category: "CONFLICT",
        });
    }
    static riderAlreadyHasActiveRide(riderId, existingRideId) {
        return new DomainError_1.DomainError((0, errorMessageFormatter_1.formatMessage)(RideMessages_1.RIDE_ERROR_MESSAGES.RIDER_HAS_ACTIVE_RIDE, {
            riderId,
            rideId: existingRideId,
        }), "RIDER_HAS_ACTIVE_RIDE", {
            statusCode: HttpStatusCodes_1.HttpStatusCodes.CONFLICT,
            errorType: ErrorType_1.ErrorType.CONFLICT_ERROR,
            shouldLog: false,
            isOperational: true,
            category: "CONFLICT",
        });
    }
    static invalidRideStatusTransition(from, to, rideId) {
        return new DomainError_1.DomainError((0, errorMessageFormatter_1.formatMessage)(RideMessages_1.RIDE_ERROR_MESSAGES.INVALID_STATUS_TRANSITION, {
            from,
            to,
            rideId,
        }), "INVALID_STATUS_TRANSITION", {
            statusCode: HttpStatusCodes_1.HttpStatusCodes.BAD_REQUEST,
            errorType: ErrorType_1.ErrorType.VALIDATION_ERROR,
            shouldLog: false,
            isOperational: true,
            category: "VALIDATION",
        });
    }
    static rideCreationFailed(reason) {
        return new DomainError_1.DomainError((0, errorMessageFormatter_1.formatMessage)(RideMessages_1.RIDE_ERROR_MESSAGES.RIDE_CREATION_FAILED, { reason }), "RIDE_CREATION_FAILED", {
            statusCode: HttpStatusCodes_1.HttpStatusCodes.INTERNAL_SERVER_ERROR,
            errorType: ErrorType_1.ErrorType.SERVER_ERROR,
            shouldLog: true,
            isOperational: false,
            category: "SERVER",
        });
    }
    static unauthorizedRideAccess(rideId) {
        return new DomainError_1.DomainError((0, errorMessageFormatter_1.formatMessage)(RideMessages_1.RIDE_ERROR_MESSAGES.UNAUTHORIZED_RIDE_ACCESS, { rideId }), "UNAUTHORIZED_RIDE_ACCESS", {
            statusCode: HttpStatusCodes_1.HttpStatusCodes.FORBIDDEN,
            errorType: ErrorType_1.ErrorType.AUTHORIZATION_ERROR,
            shouldLog: false,
            isOperational: true,
            category: "AUTH",
        });
    }
    static cannotMarkAsArrived(rideId, currentStatus) {
        return new DomainError_1.DomainError((0, errorMessageFormatter_1.formatMessage)(RideMessages_1.RIDE_ERROR_MESSAGES.CANNOT_MARK_AS_ARRIVED, {
            rideId,
            currentStatus,
        }), "CANNOT_MARK_AS_ARRIVED", {
            statusCode: HttpStatusCodes_1.HttpStatusCodes.BAD_REQUEST,
            errorType: ErrorType_1.ErrorType.VALIDATION_ERROR,
            shouldLog: false,
            isOperational: true,
            category: "VALIDATION",
        });
    }
    static cannotRateIncompleteRide(rideId) {
        return new DomainError_1.DomainError((0, errorMessageFormatter_1.formatMessage)(RideMessages_1.RIDE_ERROR_MESSAGES.CANNOT_RATE_INCOMPLETE_RIDE, {
            rideId,
        }), "CANNOT_RATE_INCOMPLETE_RIDE", {
            statusCode: HttpStatusCodes_1.HttpStatusCodes.BAD_REQUEST,
            errorType: ErrorType_1.ErrorType.VALIDATION_ERROR,
            shouldLog: false,
            isOperational: true,
            category: "VALIDATION",
        });
    }
    static rideAlreadyRated(rideId) {
        return new DomainError_1.DomainError((0, errorMessageFormatter_1.formatMessage)(RideMessages_1.RIDE_ERROR_MESSAGES.RIDE_ALREADY_RATED, { rideId }), "RIDE_ALREADY_RATED", {
            statusCode: HttpStatusCodes_1.HttpStatusCodes.CONFLICT,
            errorType: ErrorType_1.ErrorType.CONFLICT_ERROR,
            shouldLog: false,
            isOperational: true,
            category: "CONFLICT",
        });
    }
    static driverNotFoundForRide(rideId) {
        return new DomainError_1.DomainError((0, errorMessageFormatter_1.formatMessage)(RideMessages_1.RIDE_ERROR_MESSAGES.DRIVER_NOT_FOUND_FOR_RIDE, {
            rideId,
        }), "DRIVER_NOT_FOUND_FOR_RIDE", {
            statusCode: HttpStatusCodes_1.HttpStatusCodes.NOT_FOUND,
            errorType: ErrorType_1.ErrorType.NOT_FOUND_ERROR,
            shouldLog: false,
            isOperational: true,
            category: "NOT_FOUND",
        });
    }
    static invalidRatingValue() {
        return new DomainError_1.DomainError((0, errorMessageFormatter_1.formatMessage)(RideMessages_1.RIDE_ERROR_MESSAGES.INVALID_RATING_VALUE, {}), "INVALID_RATING_VALUE", {
            statusCode: HttpStatusCodes_1.HttpStatusCodes.BAD_REQUEST,
            errorType: ErrorType_1.ErrorType.VALIDATION_ERROR,
            shouldLog: false,
            isOperational: true,
            category: "VALIDATION",
        });
    }
    static invalidRatingData(reason) {
        return new DomainError_1.DomainError((0, errorMessageFormatter_1.formatMessage)(RideMessages_1.RIDE_ERROR_MESSAGES.INVALID_RATING_DATA, { reason }), "INVALID_RATING_DATA", {
            statusCode: HttpStatusCodes_1.HttpStatusCodes.BAD_REQUEST,
            errorType: ErrorType_1.ErrorType.VALIDATION_ERROR,
            shouldLog: false,
            isOperational: true,
            category: "VALIDATION",
        });
    }
    static rideNotEligibleForCoupon(rideId, currentStatus) {
        return new DomainError_1.DomainError((0, errorMessageFormatter_1.formatMessage)(RideMessages_1.RIDE_ERROR_MESSAGES.RIDE_NOT_ELIGIBLE_FOR_COUPON, {
            rideId,
            currentStatus,
        }), "RIDE_NOT_ELIGIBLE_FOR_COUPON", {
            statusCode: HttpStatusCodes_1.HttpStatusCodes.BAD_REQUEST,
            errorType: ErrorType_1.ErrorType.VALIDATION_ERROR,
            shouldLog: false,
            isOperational: true,
            category: "VALIDATION",
        });
    }
    static timeSlotConflict() {
        return new DomainError_1.DomainError("You already have another ride during this time slot.", "RIDE_TIME_SLOT_CONFLICT", {
            statusCode: HttpStatusCodes_1.HttpStatusCodes.CONFLICT,
            errorType: ErrorType_1.ErrorType.CONFLICT_ERROR,
            shouldLog: false,
            isOperational: true,
            category: "CONFLICT",
        });
    }
    static invalidVerificationCode(rideId) {
        return new DomainError_1.DomainError((0, errorMessageFormatter_1.formatMessage)(RideMessages_1.RIDE_ERROR_MESSAGES.INVALID_VERIFICATION_CODE, { rideId }), "INVALID_VERIFICATION_CODE", {
            statusCode: HttpStatusCodes_1.HttpStatusCodes.BAD_REQUEST,
            errorType: ErrorType_1.ErrorType.VALIDATION_ERROR,
            shouldLog: false,
            isOperational: true,
            category: "VALIDATION",
        });
    }
}
exports.RideErrors = RideErrors;
//# sourceMappingURL=RideErrors.js.map