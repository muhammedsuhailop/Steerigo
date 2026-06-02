"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DomainErrorClassifier = void 0;
const DomainError_1 = require("@domain/errors/DomainError");
const ErrorType_1 = require("@shared/enums/ErrorType");
const Logger_1 = require("@shared/utils/Logger");
const HttpStatusCodes_1 = require("@shared/enums/HttpStatusCodes");
class DomainErrorClassifier {
    constructor() {
        this.priority = 1;
    }
    canHandle(error) {
        return error instanceof DomainError_1.DomainError;
    }
    classify(error) {
        const domainError = error;
        Logger_1.Logger.debug("[DomainErrorClassifier] Classifying domain error", {
            code: domainError.code,
            name: domainError.name,
            hasMetadata: !!domainError.metadata,
        });
        if (domainError.metadata) {
            Logger_1.Logger.debug("[DomainErrorClassifier] Using error metadata", {
                statusCode: domainError.metadata.statusCode,
                errorType: domainError.metadata.errorType,
            });
            return {
                statusCode: domainError.metadata.statusCode,
                message: domainError.message,
                type: domainError.metadata.errorType,
                shouldLog: domainError.metadata.shouldLog,
                isOperational: domainError.metadata.isOperational,
            };
        }
        // Fallback
        Logger_1.Logger.warn("[DomainErrorClassifier] Domain error missing metadata, using fallback", {
            code: domainError.code,
            message: domainError.message,
        });
        return {
            statusCode: HttpStatusCodes_1.HttpStatusCodes.INTERNAL_SERVER_ERROR,
            message: domainError.message,
            type: ErrorType_1.ErrorType.SERVER_ERROR,
            shouldLog: true,
            isOperational: false,
        };
    }
}
exports.DomainErrorClassifier = DomainErrorClassifier;
//# sourceMappingURL=DomainErrorClassifier.js.map