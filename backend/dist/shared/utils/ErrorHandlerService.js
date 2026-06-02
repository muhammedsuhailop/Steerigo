"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorHandlerService = void 0;
const inversify_1 = require("inversify");
const ErrorClassificationService_1 = require("@shared/errors/ErrorClassificationService");
const ErrorResponseBuilder_1 = require("@shared/errors/ErrorResponseBuilder");
const Logger_1 = require("./Logger");
const HttpStatusCodes_1 = require("@shared/enums/HttpStatusCodes");
let ErrorHandlerService = class ErrorHandlerService {
    static handleError(error, context) {
        Logger_1.Logger.debug("[ErrorHandlerService] Handling error", {
            context,
            errorType: error?.constructor?.name,
        });
        try {
            // Classify the error
            const errorDetails = this.classificationService.classify(error, context);
            // Log if needed (based on error classification)
            if (errorDetails.shouldLog) {
                Logger_1.Logger.error("[ErrorHandlerService] Error requires logging", {
                    context,
                    statusCode: errorDetails.statusCode,
                    type: errorDetails.type,
                    message: errorDetails.message,
                    error: error instanceof Error ? error.stack : String(error),
                });
            }
            else {
                Logger_1.Logger.debug("[ErrorHandlerService] Error handled (no logging required)", {
                    context,
                    statusCode: errorDetails.statusCode,
                    type: errorDetails.type,
                });
            }
            // Build API response
            const response = this.responseBuilder.build(errorDetails);
            return {
                response,
                statusCode: errorDetails.statusCode,
            };
        }
        catch (handlingError) {
            // Error occurred while handling error
            Logger_1.Logger.error("[ErrorHandlerService] Critical error in error handler", {
                context,
                originalError: error,
                handlingError: handlingError instanceof Error
                    ? handlingError.message
                    : String(handlingError),
                stack: handlingError instanceof Error ? handlingError.stack : undefined,
            });
            // Return a safe fallback response
            return {
                response: {
                    success: false,
                    message: "An unexpected error occurred. Please try again later.",
                },
                statusCode: HttpStatusCodes_1.HttpStatusCodes.INTERNAL_SERVER_ERROR,
            };
        }
    }
    static handleValidationErrors(errors) {
        Logger_1.Logger.debug("[ErrorHandlerService] Handling validation errors", {
            errorCount: errors.length,
        });
        const message = errors.map((err) => err.msg).join(", ");
        const response = {
            success: false,
            message: message || "Validation failed",
        };
        return { response, statusCode: HttpStatusCodes_1.HttpStatusCodes.BAD_REQUEST };
    }
    static isOperationalError(error) {
        try {
            const errorDetails = this.classificationService.classify(error);
            return errorDetails.isOperational;
        }
        catch {
            return false;
        }
    }
};
exports.ErrorHandlerService = ErrorHandlerService;
ErrorHandlerService.classificationService = new ErrorClassificationService_1.ErrorClassificationService();
ErrorHandlerService.responseBuilder = new ErrorResponseBuilder_1.ErrorResponseBuilder();
exports.ErrorHandlerService = ErrorHandlerService = __decorate([
    (0, inversify_1.injectable)()
], ErrorHandlerService);
//# sourceMappingURL=ErrorHandlerService.js.map