import { IErrorClassifier } from "./IErrorClassifier";
import { DomainError } from "@domain/errors/DomainError";
import { ErrorDetails } from "../ErrorDetails";
import { ErrorType } from "@shared/enums/ErrorType";
import { Logger } from "@shared/utils/Logger";
import { HttpStatusCodes } from "@shared/enums/HttpStatusCodes";

export class DomainErrorClassifier implements IErrorClassifier {
  readonly priority = 1;

  canHandle(error: unknown): boolean {
    return error instanceof DomainError;
  }

  classify(error: unknown): ErrorDetails {
    const domainError = error as DomainError;

    Logger.debug("[DomainErrorClassifier] Classifying domain error", {
      code: domainError.code,
      name: domainError.name,
      hasMetadata: !!domainError.metadata,
    });

    if (domainError.metadata) {
      Logger.debug("[DomainErrorClassifier] Using error metadata", {
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
    Logger.warn(
      "[DomainErrorClassifier] Domain error missing metadata, using fallback",
      {
        code: domainError.code,
        message: domainError.message,
      },
    );

    return {
      statusCode: HttpStatusCodes.INTERNAL_SERVER_ERROR,
      message: domainError.message,
      type: ErrorType.SERVER_ERROR,
      shouldLog: true,
      isOperational: false,
    };
  }
}
