"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleControllerError = exports.asyncHandler = exports.handleValidationErrors = exports.notFound = exports.handle = exports.ErrorHandlerMiddleware = void 0;
const express_validator_1 = require("express-validator");
const Logger_1 = require("../../shared/utils/Logger");
const ErrorHandlerService_1 = require("../../shared/utils/ErrorHandlerService");
class ErrorHandlerMiddleware {
    // Global error handler - catches all unhandled errors
    static handle(err, req, res, _next) {
        // Use the centralized error handler service
        const { response, statusCode } = ErrorHandlerService_1.ErrorHandlerService.handleError(err, `${req.method} ${req.path}`);
        // Enhanced logging with request context
        Logger_1.Logger.error("Unhandled error occurred", {
            error: err.message,
            stack: err.stack,
            url: req.url,
            method: req.method,
            userAgent: req.headers["user-agent"],
            ip: req.ip,
            userId: req.user?.userId,
            ...(process.env.NODE_ENV !== "production" && {
                body: req.body,
                query: req.query,
                params: req.params,
            }),
        });
        res.status(statusCode).json(response);
    }
    //404 handler for API routes
    static notFound(req, res) {
        const response = {
            success: false,
            message: `API endpoint ${req.originalUrl} not found`,
        };
        Logger_1.Logger.warn("API endpoint not found", {
            url: req.originalUrl,
            method: req.method,
            ip: req.ip,
        });
        res.status(404).json(response);
    }
    // Validation error handler - for express-validator
    static handleValidationErrors(req, res, next) {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            const { response, statusCode } = ErrorHandlerService_1.ErrorHandlerService.handleValidationErrors(errors.array());
            Logger_1.Logger.warn("Validation error", {
                errors: errors.array(),
                url: req.url,
                method: req.method,
                body: req.body,
            });
            res.status(statusCode).json(response);
            return;
        }
        next();
    }
    // Async error handler wrapper for controllers
    static asyncHandler(fn) {
        return (req, res, next) => {
            Promise.resolve(fn(req, res, next)).catch(next);
        };
    }
    // Standard controller error handler
    static handleControllerError(error, context) {
        return ErrorHandlerService_1.ErrorHandlerService.handleError(error, context);
    }
}
exports.ErrorHandlerMiddleware = ErrorHandlerMiddleware;
exports.handle = ErrorHandlerMiddleware.handle, exports.notFound = ErrorHandlerMiddleware.notFound, exports.handleValidationErrors = ErrorHandlerMiddleware.handleValidationErrors, exports.asyncHandler = ErrorHandlerMiddleware.asyncHandler, exports.handleControllerError = ErrorHandlerMiddleware.handleControllerError;
//# sourceMappingURL=errorHandler.js.map