"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NetworkErrorClassifier = void 0;
const ErrorType_1 = require("../../enums/ErrorType");
const Logger_1 = require("../../utils/Logger");
const HttpStatusCodes_1 = require("../../enums/HttpStatusCodes");
class NetworkErrorClassifier {
    constructor() {
        this.priority = 4;
        this.NETWORK_PATTERNS = [
            "network",
            "ssl",
            "tls",
            "cert",
            "certificate",
            "fetch",
            "request",
            "econnreset",
            "enotfound",
            "etimedout",
            "eaddrinuse",
        ];
    }
    canHandle(error) {
        if (typeof error !== "object" || error === null)
            return false;
        const message = this.getStringProp(error, "message")?.toLowerCase() || "";
        const code = String(this.getStringProp(error, "code") ?? "").toLowerCase();
        const name = this.getStringProp(error, "name")?.toLowerCase() || "";
        return this.NETWORK_PATTERNS.some((pattern) => message.includes(pattern) ||
            code.includes(pattern) ||
            name.includes(pattern));
    }
    classify(error) {
        Logger_1.Logger.debug("[NetworkErrorClassifier] Classifying network error");
        const message = this.getStringProp(error, "message") || "";
        const code = this.getStringProp(error, "code") || "";
        // SSL/TLS errors
        if (message.includes("ssl") ||
            message.includes("tls") ||
            message.includes("certificate")) {
            Logger_1.Logger.warn("[NetworkErrorClassifier] SSL/TLS error detected", {
                message,
                code,
            });
            return {
                statusCode: HttpStatusCodes_1.HttpStatusCodes.BAD_GATEWAY,
                message: "Secure connection error. Please contact support.",
                type: ErrorType_1.ErrorType.NETWORK_ERROR,
                shouldLog: true,
                isOperational: false,
            };
        }
        // Connection errors
        if (code === "ECONNREFUSED" || message.includes("connection refused")) {
            Logger_1.Logger.warn("[NetworkErrorClassifier] Connection refused error", {
                message,
                code,
            });
            return {
                statusCode: HttpStatusCodes_1.HttpStatusCodes.SERVICE_UNAVAILABLE,
                message: "Service temporarily unavailable. Please try again later.",
                type: ErrorType_1.ErrorType.NETWORK_ERROR,
                shouldLog: true,
                isOperational: false,
            };
        }
        // Timeout errors
        if (code === "ETIMEDOUT" || message.includes("timeout")) {
            Logger_1.Logger.warn("[NetworkErrorClassifier] Timeout error", {
                message,
                code,
            });
            return {
                statusCode: HttpStatusCodes_1.HttpStatusCodes.GATEWAY_TIMEOUT,
                message: "Request timeout. Please try again.",
                type: ErrorType_1.ErrorType.NETWORK_ERROR,
                shouldLog: true,
                isOperational: false,
            };
        }
        // Generic network error
        Logger_1.Logger.warn("[NetworkErrorClassifier] Generic network error", {
            message,
            code,
        });
        return {
            statusCode: HttpStatusCodes_1.HttpStatusCodes.SERVICE_UNAVAILABLE,
            message: "Network service temporarily unavailable. Please try again later.",
            type: ErrorType_1.ErrorType.NETWORK_ERROR,
            shouldLog: true,
            isOperational: false,
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
exports.NetworkErrorClassifier = NetworkErrorClassifier;
//# sourceMappingURL=NetworkErrorClassifier.js.map