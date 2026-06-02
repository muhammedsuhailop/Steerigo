"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorResponseBuilder = void 0;
const inversify_1 = require("inversify");
const Logger_1 = require("@shared/utils/Logger");
let ErrorResponseBuilder = class ErrorResponseBuilder {
    build(errorDetails) {
        Logger_1.Logger.debug("[ErrorResponseBuilder] Building error response", {
            statusCode: errorDetails.statusCode,
            errorType: errorDetails.type,
        });
        return {
            success: false,
            message: errorDetails.message,
        };
    }
    buildWithData(errorDetails, additionalData) {
        Logger_1.Logger.debug("[ErrorResponseBuilder] Building detailed error response", {
            statusCode: errorDetails.statusCode,
            errorType: errorDetails.type,
            hasAdditionalData: !!additionalData,
        });
        return {
            success: false,
            message: errorDetails.message,
            ...(additionalData && { data: additionalData }),
        };
    }
};
exports.ErrorResponseBuilder = ErrorResponseBuilder;
exports.ErrorResponseBuilder = ErrorResponseBuilder = __decorate([
    (0, inversify_1.injectable)()
], ErrorResponseBuilder);
//# sourceMappingURL=ErrorResponseBuilder.js.map