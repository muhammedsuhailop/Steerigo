import { IErrorClassifier } from "./IErrorClassifier";
import { ErrorDetails } from "../ErrorDetails";
import { ErrorType } from "@shared/enums/ErrorType";
import { Logger } from "@shared/utils/Logger";
import { HttpStatusCodes } from "@shared/enums/HttpStatusCodes";

export class UnknownErrorClassifier implements IErrorClassifier {
  readonly priority = 99;

  canHandle(_error: unknown): boolean {
    return true;
  }

  classify(error: unknown): ErrorDetails {
    Logger.error("[UnknownErrorClassifier] Unhandled error type", {
      error: error instanceof Error ? error.message : String(error),
      type: error?.constructor?.name,
      stack: error instanceof Error ? error.stack : undefined,
    });

    const message =
      error instanceof Error
        ? error.message
        : "An unexpected error occurred. Please try again later.";

    return {
      statusCode: HttpStatusCodes.INTERNAL_SERVER_ERROR,
      message: message,
      type: ErrorType.SERVER_ERROR,
      shouldLog: true,
      isOperational: false,
    };
  }
}
