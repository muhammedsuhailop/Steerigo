"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidationErrorClassifier = void 0;
const ErrorType_1 = require("@shared/enums/ErrorType");
const Logger_1 = require("@shared/utils/Logger");
const HttpStatusCodes_1 = require("@shared/enums/HttpStatusCodes");
class ValidationErrorClassifier {
    constructor() {
        this.priority = 2;
    }
    canHandle(error) {
        if (typeof error !== "object" || error === null)
            return false;
        const name = this.getStringProp(error, "name");
        const message = this.getStringProp(error, "message")?.toLowerCase() || "";
        if (name === "ValidationError")
            return true;
        const validationKeywords = ["validation", "invalid", "required", "must be"];
        return validationKeywords.some((keyword) => message.includes(keyword));
    }
    classify(error) {
        Logger_1.Logger.debug("[ValidationErrorClassifier] Classifying validation error");
        const message = this.getStringProp(error, "message") || "Validation failed";
        return {
            statusCode: HttpStatusCodes_1.HttpStatusCodes.BAD_REQUEST,
            message: message,
            type: ErrorType_1.ErrorType.VALIDATION_ERROR,
            shouldLog: false,
            isOperational: true,
        };
    }
    getStringProp(obj, prop) {
        if (typeof obj === "object" && obj !== null && prop in obj) {
            const value = obj[prop];
            return typeof value === "string" ? value : undefined;
        }
        return undefined;
    }
}
exports.ValidationErrorClassifier = ValidationErrorClassifier;
//# sourceMappingURL=ValidationErrorClassifier.js.map