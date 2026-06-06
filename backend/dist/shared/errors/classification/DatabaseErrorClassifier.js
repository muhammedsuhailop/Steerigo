"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseErrorClassifier = void 0;
const ErrorType_1 = require("../../enums/ErrorType");
const Logger_1 = require("../../utils/Logger");
const HttpStatusCodes_1 = require("../../enums/HttpStatusCodes");
class DatabaseErrorClassifier {
    constructor() {
        this.priority = 3;
        this.DATABASE_PATTERNS = [
            "database",
            "connection",
            "mongodb",
            "mongoose",
            "sql",
            "redis",
            "timeout",
            "econnrefused",
            "enotfound",
            "etimedout",
        ];
    }
    canHandle(error) {
        if (typeof error !== "object" || error === null)
            return false;
        const message = this.getStringProp(error, "message")?.toLowerCase() || "";
        const code = String(this.getStringProp(error, "code") ?? "").toLowerCase();
        return this.DATABASE_PATTERNS.some((pattern) => message.includes(pattern) || code.includes(pattern));
    }
    classify(error) {
        Logger_1.Logger.debug("[DatabaseErrorClassifier] Classifying database error");
        // Check for MongoDB duplicate key error (E11000)
        if (this.isMongoDbDuplicateKeyError(error)) {
            return this.handleDuplicateKeyError(error);
        }
        // Generic database/connection error
        Logger_1.Logger.warn("[DatabaseErrorClassifier] Database connection error", {
            message: this.getStringProp(error, "message"),
            code: this.getStringProp(error, "code"),
        });
        return {
            statusCode: HttpStatusCodes_1.HttpStatusCodes.SERVICE_UNAVAILABLE,
            message: "Database service temporarily unavailable. Please try again later.",
            type: ErrorType_1.ErrorType.DATABASE_ERROR,
            shouldLog: true,
            isOperational: false,
        };
    }
    isMongoDbDuplicateKeyError(error) {
        const code = this.getNumberProp(error, "code");
        const message = this.getStringProp(error, "message") ?? "";
        return (code === 11000 ||
            message.includes("E11000 duplicate key error") ||
            message.includes("duplicate key error collection"));
    }
    handleDuplicateKeyError(error) {
        const message = this.getStringProp(error, "message")?.toLowerCase() || "";
        Logger_1.Logger.debug("[DatabaseErrorClassifier] Handling duplicate key error", {
            message,
        });
        // Check what field caused the duplicate
        if (message.includes("email")) {
            return {
                statusCode: HttpStatusCodes_1.HttpStatusCodes.CONFLICT,
                message: "An account with this email already exists",
                type: ErrorType_1.ErrorType.CONFLICT_ERROR,
                shouldLog: false,
                isOperational: true,
            };
        }
        if (message.includes("mobile") || message.includes("phone")) {
            return {
                statusCode: HttpStatusCodes_1.HttpStatusCodes.CONFLICT,
                message: "This mobile number is already registered",
                type: ErrorType_1.ErrorType.CONFLICT_ERROR,
                shouldLog: false,
                isOperational: true,
            };
        }
        // Generic duplicate key error
        return {
            statusCode: HttpStatusCodes_1.HttpStatusCodes.CONFLICT,
            message: "A record with this information already exists",
            type: ErrorType_1.ErrorType.CONFLICT_ERROR,
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
    getNumberProp(obj, prop) {
        if (typeof obj === "object" && obj !== null && prop in obj) {
            const value = obj[prop];
            return typeof value === "number" ? value : undefined;
        }
        return undefined;
    }
}
exports.DatabaseErrorClassifier = DatabaseErrorClassifier;
//# sourceMappingURL=DatabaseErrorClassifier.js.map