"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PayoutErrors = void 0;
const PayoutMesages_1 = require("../../shared/constants/PayoutMesages");
const DomainError_1 = require("./DomainError");
const ErrorType_1 = require("../../shared/enums/ErrorType");
const HttpStatusCodes_1 = require("../../shared/enums/HttpStatusCodes");
const errorMessageFormatter_1 = require("../../shared/utils/errorMessageFormatter");
class PayoutErrors {
    static payoutNotFound(payoutId) {
        return new DomainError_1.DomainError((0, errorMessageFormatter_1.formatMessage)(PayoutMesages_1.PAYOUT_ERROR_MESSAGES.PAYOUT_NOT_FOUND, { payoutId }), "PAYOUT_NOT_FOUND", {
            statusCode: HttpStatusCodes_1.HttpStatusCodes.NOT_FOUND,
            errorType: ErrorType_1.ErrorType.NOT_FOUND_ERROR,
            shouldLog: false,
            isOperational: true,
            category: "NOT_FOUND",
        });
    }
    static payoutNotRequested(payoutId) {
        return new DomainError_1.DomainError((0, errorMessageFormatter_1.formatMessage)(PayoutMesages_1.PAYOUT_ERROR_MESSAGES.PAYOUT_NOT_REQUESTED, { payoutId }), "PAYOUT_NOT_REQUESTED", {
            statusCode: HttpStatusCodes_1.HttpStatusCodes.CONFLICT,
            errorType: ErrorType_1.ErrorType.CONFLICT_ERROR,
            shouldLog: false,
            isOperational: true,
            category: "CONFLICT",
        });
    }
    static insufficientDriverBalance(available, requested) {
        return new DomainError_1.DomainError((0, errorMessageFormatter_1.formatMessage)(PayoutMesages_1.PAYOUT_ERROR_MESSAGES.INSUFFICIENT_DRIVER_BALANCE, {
            available,
            requested,
        }), "INSUFFICIENT_DRIVER_BALANCE", {
            statusCode: HttpStatusCodes_1.HttpStatusCodes.BAD_REQUEST,
            errorType: ErrorType_1.ErrorType.BUSINESS_ERROR,
            shouldLog: false,
            isOperational: true,
            category: "BUSINESS",
        });
    }
    static driverWalletNotFound(driverId) {
        return new DomainError_1.DomainError((0, errorMessageFormatter_1.formatMessage)(PayoutMesages_1.PAYOUT_ERROR_MESSAGES.DRIVER_WALLET_NOT_FOUND, {
            driverId,
        }), "DRIVER_WALLET_NOT_FOUND", {
            statusCode: HttpStatusCodes_1.HttpStatusCodes.NOT_FOUND,
            errorType: ErrorType_1.ErrorType.NOT_FOUND_ERROR,
            shouldLog: false,
            isOperational: true,
            category: "NOT_FOUND",
        });
    }
    static belowMinimumAmount(minimum, currency) {
        return new DomainError_1.DomainError((0, errorMessageFormatter_1.formatMessage)(PayoutMesages_1.PAYOUT_ERROR_MESSAGES.BELOW_MINIMUM_PAYOUT_AMOUNT, {
            minimum,
            currency,
        }), "BELOW_MINIMUM_PAYOUT_AMOUNT", {
            statusCode: HttpStatusCodes_1.HttpStatusCodes.BAD_REQUEST,
            errorType: ErrorType_1.ErrorType.VALIDATION_ERROR,
            shouldLog: false,
            isOperational: true,
            category: "VALIDATION",
        });
    }
    static pendingPayoutExists(driverId) {
        return new DomainError_1.DomainError((0, errorMessageFormatter_1.formatMessage)(PayoutMesages_1.PAYOUT_ERROR_MESSAGES.PENDING_PAYOUT_EXISTS, { driverId }), "PENDING_PAYOUT_EXISTS", {
            statusCode: HttpStatusCodes_1.HttpStatusCodes.CONFLICT,
            errorType: ErrorType_1.ErrorType.CONFLICT_ERROR,
            shouldLog: false,
            isOperational: true,
            category: "CONFLICT",
        });
    }
    static unauthorizedPayoutAccess(payoutId) {
        return new DomainError_1.DomainError((0, errorMessageFormatter_1.formatMessage)(PayoutMesages_1.PAYOUT_ERROR_MESSAGES.UNAUTHORIZED_PAYOUT_ACCESS, {
            payoutId,
        }), "UNAUTHORIZED_PAYOUT_ACCESS", {
            statusCode: HttpStatusCodes_1.HttpStatusCodes.FORBIDDEN,
            errorType: ErrorType_1.ErrorType.AUTHORIZATION_ERROR,
            shouldLog: false,
            isOperational: true,
            category: "AUTH",
        });
    }
}
exports.PayoutErrors = PayoutErrors;
//# sourceMappingURL=PayoutErrors.js.map