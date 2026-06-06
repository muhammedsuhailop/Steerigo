"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnknownErrorClassifier = void 0;
const ErrorType_1 = require("../../enums/ErrorType");
const Logger_1 = require("../../utils/Logger");
const HttpStatusCodes_1 = require("../../enums/HttpStatusCodes");
class UnknownErrorClassifier {
    constructor() {
        this.priority = 99;
    }
    canHandle(_error) {
        return true;
    }
    classify(error) {
        Logger_1.Logger.error("[UnknownErrorClassifier] Unhandled error type", {
            error: error instanceof Error ? error.message : String(error),
            type: error?.constructor?.name,
            stack: error instanceof Error ? error.stack : undefined,
        });
        const message = error instanceof Error
            ? error.message
            : "An unexpected error occurred. Please try again later.";
        return {
            statusCode: HttpStatusCodes_1.HttpStatusCodes.INTERNAL_SERVER_ERROR,
            message: message,
            type: ErrorType_1.ErrorType.SERVER_ERROR,
            shouldLog: true,
            isOperational: false,
        };
    }
}
exports.UnknownErrorClassifier = UnknownErrorClassifier;
//# sourceMappingURL=UnknownErrorClassifier.js.map