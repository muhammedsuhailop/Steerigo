"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentErrors = void 0;
const PaymentMessages_1 = require("../../shared/constants/PaymentMessages");
const DomainError_1 = require("./DomainError");
const ErrorType_1 = require("../../shared/enums/ErrorType");
const HttpStatusCodes_1 = require("../../shared/enums/HttpStatusCodes");
const errorMessageFormatter_1 = require("../../shared/utils/errorMessageFormatter");
class PaymentErrors {
    static rideNotCompleted(rideId) {
        return new DomainError_1.DomainError((0, errorMessageFormatter_1.formatMessage)(PaymentMessages_1.PAYMENT_ERROR_MESSAGES.RIDE_NOT_COMPLETED, { rideId }), "RIDE_NOT_COMPLETED", {
            statusCode: HttpStatusCodes_1.HttpStatusCodes.BAD_REQUEST,
            errorType: ErrorType_1.ErrorType.VALIDATION_ERROR,
            shouldLog: false,
            isOperational: true,
            category: "VALIDATION",
        });
    }
    static paymentAlreadyExists(rideId) {
        return new DomainError_1.DomainError((0, errorMessageFormatter_1.formatMessage)(PaymentMessages_1.PAYMENT_ERROR_MESSAGES.PAYMENT_ALREADY_EXISTS, { rideId }), "PAYMENT_ALREADY_EXISTS", {
            statusCode: HttpStatusCodes_1.HttpStatusCodes.CONFLICT,
            errorType: ErrorType_1.ErrorType.CONFLICT_ERROR,
            shouldLog: false,
            isOperational: true,
            category: "CONFLICT",
        });
    }
    static paymentNotFound(paymentId) {
        return new DomainError_1.DomainError((0, errorMessageFormatter_1.formatMessage)(PaymentMessages_1.PAYMENT_ERROR_MESSAGES.PAYMENT_NOT_FOUND, { paymentId }), "PAYMENT_NOT_FOUND", {
            statusCode: HttpStatusCodes_1.HttpStatusCodes.NOT_FOUND,
            errorType: ErrorType_1.ErrorType.NOT_FOUND_ERROR,
            shouldLog: false,
            isOperational: true,
            category: "NOT_FOUND",
        });
    }
    static paymentNotPending(paymentId) {
        return new DomainError_1.DomainError((0, errorMessageFormatter_1.formatMessage)(PaymentMessages_1.PAYMENT_ERROR_MESSAGES.PAYMENT_NOT_PENDING, { paymentId }), "PAYMENT_NOT_PENDING", {
            statusCode: HttpStatusCodes_1.HttpStatusCodes.CONFLICT,
            errorType: ErrorType_1.ErrorType.CONFLICT_ERROR,
            shouldLog: false,
            isOperational: true,
            category: "CONFLICT",
        });
    }
    static invalidSignature() {
        return new DomainError_1.DomainError(PaymentMessages_1.PAYMENT_ERROR_MESSAGES.INVALID_PAYMENT_SIGNATURE, "INVALID_PAYMENT_SIGNATURE", {
            statusCode: HttpStatusCodes_1.HttpStatusCodes.BAD_REQUEST,
            errorType: ErrorType_1.ErrorType.VALIDATION_ERROR,
            shouldLog: true,
            isOperational: true,
            category: "SECURITY",
        });
    }
    static insufficientWalletBalance(available, required) {
        return new DomainError_1.DomainError((0, errorMessageFormatter_1.formatMessage)(PaymentMessages_1.PAYMENT_ERROR_MESSAGES.INSUFFICIENT_WALLET_BALANCE, {
            available,
            required,
        }), "INSUFFICIENT_WALLET_BALANCE", {
            statusCode: HttpStatusCodes_1.HttpStatusCodes.BAD_REQUEST,
            errorType: ErrorType_1.ErrorType.BUSINESS_ERROR,
            shouldLog: false,
            isOperational: true,
            category: "BUSINESS",
        });
    }
    static walletNotFound(ownerId) {
        return new DomainError_1.DomainError((0, errorMessageFormatter_1.formatMessage)(PaymentMessages_1.PAYMENT_ERROR_MESSAGES.WALLET_NOT_FOUND, { ownerId }), "WALLET_NOT_FOUND", {
            statusCode: HttpStatusCodes_1.HttpStatusCodes.NOT_FOUND,
            errorType: ErrorType_1.ErrorType.NOT_FOUND_ERROR,
            shouldLog: false,
            isOperational: true,
            category: "NOT_FOUND",
        });
    }
    static unauthorizedPaymentAccess(paymentId) {
        return new DomainError_1.DomainError((0, errorMessageFormatter_1.formatMessage)(PaymentMessages_1.PAYMENT_ERROR_MESSAGES.UNAUTHORIZED_PAYMENT_ACCESS, {
            paymentId,
        }), "UNAUTHORIZED_PAYMENT_ACCESS", {
            statusCode: HttpStatusCodes_1.HttpStatusCodes.FORBIDDEN,
            errorType: ErrorType_1.ErrorType.AUTHORIZATION_ERROR,
            shouldLog: false,
            isOperational: true,
            category: "AUTH",
        });
    }
    static invalidPaymentMethod(method) {
        return new DomainError_1.DomainError((0, errorMessageFormatter_1.formatMessage)(PaymentMessages_1.PAYMENT_ERROR_MESSAGES.INVALID_PAYMENT_METHOD, { method }), "INVALID_PAYMENT_METHOD", {
            statusCode: HttpStatusCodes_1.HttpStatusCodes.BAD_REQUEST,
            errorType: ErrorType_1.ErrorType.VALIDATION_ERROR,
            shouldLog: false,
            isOperational: true,
            category: "VALIDATION",
        });
    }
    static cashConfirmationUnauthorized(rideId) {
        return new DomainError_1.DomainError((0, errorMessageFormatter_1.formatMessage)(PaymentMessages_1.PAYMENT_ERROR_MESSAGES.CASH_CONFIRMATION_UNAUTHORIZED, {
            rideId,
        }), "CASH_CONFIRMATION_UNAUTHORIZED", {
            statusCode: HttpStatusCodes_1.HttpStatusCodes.FORBIDDEN,
            errorType: ErrorType_1.ErrorType.AUTHORIZATION_ERROR,
            shouldLog: false,
            isOperational: true,
            category: "AUTH",
        });
    }
    static invalidPaymentAmount(expected, received) {
        return new DomainError_1.DomainError((0, errorMessageFormatter_1.formatMessage)(PaymentMessages_1.PAYMENT_ERROR_MESSAGES.INVALID_PAYMENT_AMOUNT, {
            expected,
            received,
        }), "INVALID_PAYMENT_AMOUNT", {
            statusCode: HttpStatusCodes_1.HttpStatusCodes.BAD_REQUEST,
            errorType: ErrorType_1.ErrorType.VALIDATION_ERROR,
            shouldLog: false,
            isOperational: true,
            category: "VALIDATION",
        });
    }
}
exports.PaymentErrors = PaymentErrors;
//# sourceMappingURL=PaymentErrors.js.map