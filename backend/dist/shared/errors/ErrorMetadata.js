"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorMetadataInferrer = void 0;
const ErrorType_1 = require("../enums/ErrorType");
class ErrorMetadataInferrer {
    static inferFromCode(code) {
        if (!code) {
            return {
                statusCode: 500,
                errorType: ErrorType_1.ErrorType.SERVER_ERROR,
                shouldLog: true,
                isOperational: false,
                category: "SERVER",
            };
        }
        const codeUpper = code.toUpperCase();
        // NOT_FOUND patterns (404)
        if (codeUpper.includes("NOT_FOUND") || codeUpper.endsWith("_NOT_FOUND")) {
            return {
                statusCode: 404,
                errorType: ErrorType_1.ErrorType.NOT_FOUND_ERROR,
                shouldLog: false,
                isOperational: true,
                category: "NOT_FOUND",
            };
        }
        // VALIDATION patterns (400)
        if (codeUpper.startsWith("INVALID_") || codeUpper.includes("_INVALID")) {
            return {
                statusCode: 400,
                errorType: ErrorType_1.ErrorType.VALIDATION_ERROR,
                shouldLog: false,
                isOperational: true,
                category: "VALIDATION",
            };
        }
        // CONFLICT patterns (409)
        if (codeUpper.includes("ALREADY_") || codeUpper.includes("DUPLICATE_")) {
            return {
                statusCode: 409,
                errorType: ErrorType_1.ErrorType.CONFLICT_ERROR,
                shouldLog: false,
                isOperational: true,
                category: "CONFLICT",
            };
        }
        // AUTHENTICATION patterns (401)
        if (codeUpper.includes("UNAUTHORIZED") ||
            codeUpper.includes("FORBIDDEN") ||
            codeUpper.includes("AUTH")) {
            return {
                statusCode: 401,
                errorType: ErrorType_1.ErrorType.AUTHENTICATION_ERROR,
                shouldLog: false,
                isOperational: true,
                category: "AUTH",
            };
        }
        // AUTHORIZATION patterns (403)
        if (codeUpper.includes("PERMISSION") ||
            codeUpper.includes("ACCESS_DENIED")) {
            return {
                statusCode: 403,
                errorType: ErrorType_1.ErrorType.AUTHORIZATION_ERROR,
                shouldLog: false,
                isOperational: true,
                category: "AUTH",
            };
        }
        // Default: Server error (500)
        return {
            statusCode: 500,
            errorType: ErrorType_1.ErrorType.SERVER_ERROR,
            shouldLog: true,
            isOperational: false,
            category: "SERVER",
        };
    }
}
exports.ErrorMetadataInferrer = ErrorMetadataInferrer;
//# sourceMappingURL=ErrorMetadata.js.map