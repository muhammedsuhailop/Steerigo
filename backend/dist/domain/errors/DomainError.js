"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DomainError = void 0;
const ErrorMetadata_1 = require("@shared/errors/ErrorMetadata");
class DomainError extends Error {
    constructor(message, code, metadata) {
        super(message);
        this.name = "DomainError";
        this.code = code;
        this.metadata = this.buildMetadata(code, metadata);
        Object.setPrototypeOf(this, DomainError.prototype);
    }
    buildMetadata(code, override) {
        const defaults = ErrorMetadata_1.ErrorMetadataInferrer.inferFromCode(code);
        return {
            ...defaults,
            ...override,
        };
    }
    getMetadata() {
        return this.metadata;
    }
    getStatusCode() {
        return this.metadata.statusCode;
    }
    getErrorType() {
        return this.metadata.errorType;
    }
    shouldLog() {
        return this.metadata.shouldLog;
    }
    isOperational() {
        return this.metadata.isOperational;
    }
}
exports.DomainError = DomainError;
//# sourceMappingURL=DomainError.js.map