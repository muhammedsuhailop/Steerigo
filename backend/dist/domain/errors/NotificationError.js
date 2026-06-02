"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationErrors = void 0;
const DomainError_1 = require("./DomainError");
const ErrorType_1 = require("../../shared/enums/ErrorType");
const HttpStatusCodes_1 = require("../../shared/enums/HttpStatusCodes");
const errorMessageFormatter_1 = require("../../shared/utils/errorMessageFormatter");
const NotificationMessages_1 = require("../../shared/constants/NotificationMessages");
class NotificationErrors {
    static notificationNotFound(notificationId) {
        return new DomainError_1.DomainError((0, errorMessageFormatter_1.formatMessage)(NotificationMessages_1.NOTIFICATION_ERROR_MESSAGES.NOTIFICATION_NOT_FOUND, {
            notificationId,
        }), "NOTIFICATION_NOT_FOUND", {
            statusCode: HttpStatusCodes_1.HttpStatusCodes.NOT_FOUND,
            errorType: ErrorType_1.ErrorType.NOT_FOUND_ERROR,
            shouldLog: false,
            isOperational: true,
            category: "NOT_FOUND",
        });
    }
    static notificationIdOrMarkAllRequired() {
        return new DomainError_1.DomainError(NotificationMessages_1.NOTIFICATION_ERROR_MESSAGES.NOTIFICATION_ID_OR_MARK_ALL_REQUIRED, "NOTIFICATION_ID_OR_MARK_ALL_REQUIRED", {
            statusCode: HttpStatusCodes_1.HttpStatusCodes.BAD_REQUEST,
            errorType: ErrorType_1.ErrorType.VALIDATION_ERROR,
            shouldLog: false,
            isOperational: true,
            category: "VALIDATION",
        });
    }
}
exports.NotificationErrors = NotificationErrors;
//# sourceMappingURL=NotificationError.js.map