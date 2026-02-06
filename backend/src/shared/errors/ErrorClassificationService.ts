import { injectable } from "inversify";
import { IErrorClassifier } from "./classification/IErrorClassifier";
import { DomainErrorClassifier } from "./classification/DomainErrorClassifier";
import { DatabaseErrorClassifier } from "./classification/DatabaseErrorClassifier";
import { NetworkErrorClassifier } from "./classification/NetworkErrorClassifier";
import { ValidationErrorClassifier } from "./classification/ValidationErrorClassifier";
import { UnknownErrorClassifier } from "./classification/UnknownErrorClassifier";
import { ErrorDetails } from "./ErrorDetails";
import { Logger } from "@shared/utils/Logger";
import { ErrorType } from "@shared/enums/ErrorType";

@injectable()
export class ErrorClassificationService {
  private readonly classifiers: IErrorClassifier[];

  constructor() {
    this.classifiers = [
      new DomainErrorClassifier(), // Priority 1
      new ValidationErrorClassifier(), // Priority 2
      new DatabaseErrorClassifier(), // Priority 3
      new NetworkErrorClassifier(), // Priority 4
      new UnknownErrorClassifier(), // Priority 99 - Catch-all (always last)
    ].sort((a, b) => a.priority - b.priority);
  }

  classify(error: unknown, context?: string): ErrorDetails {
    Logger.debug("[ErrorClassificationService] Starting classification", {
      context,
      errorType: error?.constructor?.name,
      errorMessage: error instanceof Error ? error.message : String(error),
    });

    // Find the first classifier that can handle this error
    for (const classifier of this.classifiers) {
      if (classifier.canHandle(error)) {
        Logger.debug("[ErrorClassificationService] Classifier matched", {
          classifier: classifier.constructor.name,
          priority: classifier.priority,
        });

        const result = classifier.classify(error);

        Logger.debug("[ErrorClassificationService] Classification complete", {
          classifier: classifier.constructor.name,
          statusCode: result.statusCode,
          errorType: result.type,
          shouldLog: result.shouldLog,
        });

        return result;
      }
    }

    // Should never reach here due to UnknownErrorClassifier (canHandle always returns true)
    Logger.error(
      "[ErrorClassificationService] No classifier found (this should never happen)",
      {
        error,
        context,
      },
    );

    return {
      statusCode: 500,
      message: "An unexpected error occurred",
      type: ErrorType.SERVER_ERROR,
      shouldLog: true,
      isOperational: false,
    };
  }

  addClassifier(classifier: IErrorClassifier): void {
    this.classifiers.push(classifier);
    this.classifiers.sort((a, b) => a.priority - b.priority);

    Logger.debug("[ErrorClassificationService] Custom classifier added", {
      classifier: classifier.constructor.name,
      priority: classifier.priority,
      totalClassifiers: this.classifiers.length,
    });
  }
}
