"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CouponErrors = void 0;
const DomainError_1 = require("./DomainError");
const ErrorType_1 = require("../../shared/enums/ErrorType");
const HttpStatusCodes_1 = require("../../shared/enums/HttpStatusCodes");
const errorMessageFormatter_1 = require("../../shared/utils/errorMessageFormatter");
const CouponMessages_1 = require("../../shared/constants/CouponMessages");
class CouponErrors {
    static couponNotFound(couponId) {
        return new DomainError_1.DomainError((0, errorMessageFormatter_1.formatMessage)(CouponMessages_1.COUPON_ERROR_MESSAGES.COUPON_NOT_FOUND, { couponId }), "COUPON_NOT_FOUND", {
            statusCode: HttpStatusCodes_1.HttpStatusCodes.NOT_FOUND,
            errorType: ErrorType_1.ErrorType.NOT_FOUND_ERROR,
            shouldLog: false,
            isOperational: true,
            category: "NOT_FOUND",
        });
    }
    static couponCodeAlreadyExists(code) {
        return new DomainError_1.DomainError((0, errorMessageFormatter_1.formatMessage)(CouponMessages_1.COUPON_ERROR_MESSAGES.COUPON_CODE_EXISTS, { code }), "COUPON_CODE_EXISTS", {
            statusCode: HttpStatusCodes_1.HttpStatusCodes.CONFLICT,
            errorType: ErrorType_1.ErrorType.CONFLICT_ERROR,
            shouldLog: false,
            isOperational: true,
            category: "CONFLICT",
        });
    }
    static invalidDiscountValue(reason) {
        return new DomainError_1.DomainError((0, errorMessageFormatter_1.formatMessage)(CouponMessages_1.COUPON_ERROR_MESSAGES.INVALID_DISCOUNT_VALUE, { reason }), "INVALID_DISCOUNT_VALUE", {
            statusCode: HttpStatusCodes_1.HttpStatusCodes.BAD_REQUEST,
            errorType: ErrorType_1.ErrorType.VALIDATION_ERROR,
            shouldLog: false,
            isOperational: true,
            category: "VALIDATION",
        });
    }
    static invalidDiscountType(discountType) {
        return new DomainError_1.DomainError((0, errorMessageFormatter_1.formatMessage)(CouponMessages_1.COUPON_ERROR_MESSAGES.INVALID_DISCOUNT_TYPE, {
            discountType,
        }), "INVALID_DISCOUNT_TYPE", {
            statusCode: HttpStatusCodes_1.HttpStatusCodes.BAD_REQUEST,
            errorType: ErrorType_1.ErrorType.VALIDATION_ERROR,
            shouldLog: false,
            isOperational: true,
            category: "VALIDATION",
        });
    }
    static invalidValidityPeriod() {
        return new DomainError_1.DomainError(CouponMessages_1.COUPON_ERROR_MESSAGES.INVALID_VALIDITY_PERIOD, "INVALID_VALIDITY_PERIOD", {
            statusCode: HttpStatusCodes_1.HttpStatusCodes.BAD_REQUEST,
            errorType: ErrorType_1.ErrorType.VALIDATION_ERROR,
            shouldLog: false,
            isOperational: true,
            category: "VALIDATION",
        });
    }
    static invalidCouponData(reason) {
        return new DomainError_1.DomainError((0, errorMessageFormatter_1.formatMessage)(CouponMessages_1.COUPON_ERROR_MESSAGES.INVALID_COUPON_DATA, { reason }), "INVALID_COUPON_DATA", {
            statusCode: HttpStatusCodes_1.HttpStatusCodes.BAD_REQUEST,
            errorType: ErrorType_1.ErrorType.VALIDATION_ERROR,
            shouldLog: false,
            isOperational: true,
            category: "VALIDATION",
        });
    }
    static couponNotValid(code) {
        return new DomainError_1.DomainError((0, errorMessageFormatter_1.formatMessage)(CouponMessages_1.COUPON_ERROR_MESSAGES.COUPON_NOT_VALID, { code }), "COUPON_NOT_VALID", {
            statusCode: HttpStatusCodes_1.HttpStatusCodes.BAD_REQUEST,
            errorType: ErrorType_1.ErrorType.VALIDATION_ERROR,
            shouldLog: false,
            isOperational: true,
            category: "VALIDATION",
        });
    }
    static minimumAmountNotSatisfied(minAmount, rideAmount) {
        return new DomainError_1.DomainError((0, errorMessageFormatter_1.formatMessage)(CouponMessages_1.COUPON_ERROR_MESSAGES.MINIMUM_AMOUNT_NOT_SATISFIED, {
            minAmount: String(minAmount),
            rideAmount: String(rideAmount),
        }), "MINIMUM_AMOUNT_NOT_SATISFIED", {
            statusCode: HttpStatusCodes_1.HttpStatusCodes.BAD_REQUEST,
            errorType: ErrorType_1.ErrorType.VALIDATION_ERROR,
            shouldLog: false,
            isOperational: true,
            category: "VALIDATION",
        });
    }
    static couponAlreadyAppliedToRide(rideId) {
        return new DomainError_1.DomainError((0, errorMessageFormatter_1.formatMessage)(CouponMessages_1.COUPON_ERROR_MESSAGES.COUPON_ALREADY_APPLIED, { rideId }), "COUPON_ALREADY_APPLIED", {
            statusCode: HttpStatusCodes_1.HttpStatusCodes.CONFLICT,
            errorType: ErrorType_1.ErrorType.CONFLICT_ERROR,
            shouldLog: false,
            isOperational: true,
            category: "CONFLICT",
        });
    }
    static cannotApplyCouponAfterPayment(rideId) {
        return new DomainError_1.DomainError((0, errorMessageFormatter_1.formatMessage)(CouponMessages_1.COUPON_ERROR_MESSAGES.CANNOT_APPLY_COUPON_AFTER_PAYMENT, {
            rideId,
        }), "CANNOT_APPLY_COUPON_AFTER_PAYMENT", {
            statusCode: HttpStatusCodes_1.HttpStatusCodes.BAD_REQUEST,
            errorType: ErrorType_1.ErrorType.VALIDATION_ERROR,
            shouldLog: false,
            isOperational: true,
            category: "VALIDATION",
        });
    }
    static couponUsageLimitExceeded(code) {
        return new DomainError_1.DomainError((0, errorMessageFormatter_1.formatMessage)(CouponMessages_1.COUPON_ERROR_MESSAGES.COUPON_USAGE_LIMIT_EXCEEDED, {
            code,
        }), "COUPON_USAGE_LIMIT_EXCEEDED", {
            statusCode: HttpStatusCodes_1.HttpStatusCodes.BAD_REQUEST,
            errorType: ErrorType_1.ErrorType.VALIDATION_ERROR,
            shouldLog: false,
            isOperational: true,
            category: "VALIDATION",
        });
    }
    static noCouponApplied(rideId) {
        return new DomainError_1.DomainError((0, errorMessageFormatter_1.formatMessage)(CouponMessages_1.COUPON_ERROR_MESSAGES.NO_COUPON_APPLIED, { rideId }), "NO_COUPON_APPLIED", {
            statusCode: HttpStatusCodes_1.HttpStatusCodes.BAD_REQUEST,
            errorType: ErrorType_1.ErrorType.VALIDATION_ERROR,
            shouldLog: false,
            isOperational: true,
            category: "VALIDATION",
        });
    }
}
exports.CouponErrors = CouponErrors;
//# sourceMappingURL=CouponErrors.js.map