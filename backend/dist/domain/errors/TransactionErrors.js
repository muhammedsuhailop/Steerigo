"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionErrors = void 0;
const DomainError_1 = require("./DomainError");
const ErrorType_1 = require("@shared/enums/ErrorType");
const HttpStatusCodes_1 = require("@shared/enums/HttpStatusCodes");
const errorMessageFormatter_1 = require("@shared/utils/errorMessageFormatter");
const TransactionMessages_1 = require("@shared/constants/TransactionMessages");
class TransactionErrors {
    static transactionNotFound(transactionId) {
        return new DomainError_1.DomainError((0, errorMessageFormatter_1.formatMessage)(TransactionMessages_1.TRANSACTION_ERROR_MESSAGES.TRANSACTION_NOT_FOUND, {
            transactionId,
        }), "TRANSACTION_NOT_FOUND", {
            statusCode: HttpStatusCodes_1.HttpStatusCodes.NOT_FOUND,
            errorType: ErrorType_1.ErrorType.NOT_FOUND_ERROR,
            shouldLog: false,
            isOperational: true,
            category: "NOT_FOUND",
        });
    }
    static invalidTransactionType(type) {
        return new DomainError_1.DomainError((0, errorMessageFormatter_1.formatMessage)(TransactionMessages_1.TRANSACTION_ERROR_MESSAGES.INVALID_TRANSACTION_TYPE, {
            type,
        }), "INVALID_TRANSACTION_TYPE", {
            statusCode: HttpStatusCodes_1.HttpStatusCodes.BAD_REQUEST,
            errorType: ErrorType_1.ErrorType.VALIDATION_ERROR,
            shouldLog: false,
            isOperational: true,
            category: "VALIDATION",
        });
    }
    static invalidTransactionDirection(direction) {
        return new DomainError_1.DomainError((0, errorMessageFormatter_1.formatMessage)(TransactionMessages_1.TRANSACTION_ERROR_MESSAGES.INVALID_TRANSACTION_DIRECTION, {
            direction,
        }), "INVALID_TRANSACTION_DIRECTION", {
            statusCode: HttpStatusCodes_1.HttpStatusCodes.BAD_REQUEST,
            errorType: ErrorType_1.ErrorType.VALIDATION_ERROR,
            shouldLog: false,
            isOperational: true,
            category: "VALIDATION",
        });
    }
    static invalidOwnerType(ownerType) {
        return new DomainError_1.DomainError((0, errorMessageFormatter_1.formatMessage)(TransactionMessages_1.TRANSACTION_ERROR_MESSAGES.INVALID_OWNER_TYPE, {
            ownerType,
        }), "INVALID_OWNER_TYPE", {
            statusCode: HttpStatusCodes_1.HttpStatusCodes.BAD_REQUEST,
            errorType: ErrorType_1.ErrorType.VALIDATION_ERROR,
            shouldLog: false,
            isOperational: true,
            category: "VALIDATION",
        });
    }
    static invalidDateField(fieldName) {
        return new DomainError_1.DomainError((0, errorMessageFormatter_1.formatMessage)(TransactionMessages_1.TRANSACTION_ERROR_MESSAGES.INVALID_DATE_FIELD, {
            fieldName,
        }), "INVALID_DATE_FIELD", {
            statusCode: HttpStatusCodes_1.HttpStatusCodes.BAD_REQUEST,
            errorType: ErrorType_1.ErrorType.VALIDATION_ERROR,
            shouldLog: false,
            isOperational: true,
            category: "VALIDATION",
        });
    }
    static invalidDateRange() {
        return new DomainError_1.DomainError(TransactionMessages_1.TRANSACTION_ERROR_MESSAGES.INVALID_DATE_RANGE, "INVALID_DATE_RANGE", {
            statusCode: HttpStatusCodes_1.HttpStatusCodes.BAD_REQUEST,
            errorType: ErrorType_1.ErrorType.VALIDATION_ERROR,
            shouldLog: false,
            isOperational: true,
            category: "VALIDATION",
        });
    }
    static invalidPaginationField(fieldName) {
        return new DomainError_1.DomainError((0, errorMessageFormatter_1.formatMessage)(TransactionMessages_1.TRANSACTION_ERROR_MESSAGES.INVALID_PAGINATION_FIELD, {
            fieldName,
        }), "INVALID_PAGINATION_FIELD", {
            statusCode: HttpStatusCodes_1.HttpStatusCodes.BAD_REQUEST,
            errorType: ErrorType_1.ErrorType.VALIDATION_ERROR,
            shouldLog: false,
            isOperational: true,
            category: "VALIDATION",
        });
    }
}
exports.TransactionErrors = TransactionErrors;
//# sourceMappingURL=TransactionErrors.js.map