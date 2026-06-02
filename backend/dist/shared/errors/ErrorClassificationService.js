"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorClassificationService = void 0;
const inversify_1 = require("inversify");
const DomainErrorClassifier_1 = require("./classification/DomainErrorClassifier");
const DatabaseErrorClassifier_1 = require("./classification/DatabaseErrorClassifier");
const NetworkErrorClassifier_1 = require("./classification/NetworkErrorClassifier");
const ValidationErrorClassifier_1 = require("./classification/ValidationErrorClassifier");
const UnknownErrorClassifier_1 = require("./classification/UnknownErrorClassifier");
const Logger_1 = require("@shared/utils/Logger");
const ErrorType_1 = require("@shared/enums/ErrorType");
let ErrorClassificationService = class ErrorClassificationService {
    constructor() {
        this.classifiers = [
            new DomainErrorClassifier_1.DomainErrorClassifier(), // Priority 1
            new ValidationErrorClassifier_1.ValidationErrorClassifier(), // Priority 2
            new DatabaseErrorClassifier_1.DatabaseErrorClassifier(), // Priority 3
            new NetworkErrorClassifier_1.NetworkErrorClassifier(), // Priority 4
            new UnknownErrorClassifier_1.UnknownErrorClassifier(), // Priority 99 - Catch-all (always last)
        ].sort((a, b) => a.priority - b.priority);
    }
    classify(error, context) {
        Logger_1.Logger.debug("[ErrorClassificationService] Starting classification", {
            context,
            errorType: error?.constructor?.name,
            errorMessage: error instanceof Error ? error.message : String(error),
        });
        // Find the first classifier that can handle this error
        for (const classifier of this.classifiers) {
            if (classifier.canHandle(error)) {
                Logger_1.Logger.debug("[ErrorClassificationService] Classifier matched", {
                    classifier: classifier.constructor.name,
                    priority: classifier.priority,
                });
                const result = classifier.classify(error);
                Logger_1.Logger.debug("[ErrorClassificationService] Classification complete", {
                    classifier: classifier.constructor.name,
                    statusCode: result.statusCode,
                    errorType: result.type,
                    shouldLog: result.shouldLog,
                });
                return result;
            }
        }
        // Should never reach here due to UnknownErrorClassifier (canHandle always returns true)
        Logger_1.Logger.error("[ErrorClassificationService] No classifier found (this should never happen)", {
            error,
            context,
        });
        return {
            statusCode: 500,
            message: "An unexpected error occurred",
            type: ErrorType_1.ErrorType.SERVER_ERROR,
            shouldLog: true,
            isOperational: false,
        };
    }
    addClassifier(classifier) {
        this.classifiers.push(classifier);
        this.classifiers.sort((a, b) => a.priority - b.priority);
        Logger_1.Logger.debug("[ErrorClassificationService] Custom classifier added", {
            classifier: classifier.constructor.name,
            priority: classifier.priority,
            totalClassifiers: this.classifiers.length,
        });
    }
};
exports.ErrorClassificationService = ErrorClassificationService;
exports.ErrorClassificationService = ErrorClassificationService = __decorate([
    (0, inversify_1.injectable)(),
    __metadata("design:paramtypes", [])
], ErrorClassificationService);
//# sourceMappingURL=ErrorClassificationService.js.map