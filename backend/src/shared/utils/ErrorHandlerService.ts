import { injectable } from "inversify";
import { ApiResponse } from "@shared/types/Common";
import { ErrorClassificationService } from "@shared/errors/ErrorClassificationService";
import { ErrorResponseBuilder } from "@shared/errors/ErrorResponseBuilder";
import { Logger } from "./Logger";
import { HttpStatusCodes } from "@shared/enums/HttpStatusCodes";

@injectable()
export class ErrorHandlerService {
  private static classificationService = new ErrorClassificationService();
  private static responseBuilder = new ErrorResponseBuilder();

  static handleError(
    error: unknown,
    context?: string,
  ): { response: ApiResponse; statusCode: number } {
    Logger.debug("[ErrorHandlerService] Handling error", {
      context,
      errorType: error?.constructor?.name,
    });

    try {
      // Classify the error
      const errorDetails = this.classificationService.classify(error, context);

      // Log if needed (based on error classification)
      if (errorDetails.shouldLog) {
        Logger.error("[ErrorHandlerService] Error requires logging", {
          context,
          statusCode: errorDetails.statusCode,
          type: errorDetails.type,
          message: errorDetails.message,
          error: error instanceof Error ? error.stack : String(error),
        });
      } else {
        Logger.debug(
          "[ErrorHandlerService] Error handled (no logging required)",
          {
            context,
            statusCode: errorDetails.statusCode,
            type: errorDetails.type,
          },
        );
      }

      // Build API response
      const response = this.responseBuilder.build(errorDetails);

      return {
        response,
        statusCode: errorDetails.statusCode,
      };
    } catch (handlingError) {
      // Error occurred while handling error
      Logger.error("[ErrorHandlerService] Critical error in error handler", {
        context,
        originalError: error,
        handlingError:
          handlingError instanceof Error
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
        statusCode: HttpStatusCodes.INTERNAL_SERVER_ERROR,
      };
    }
  }

  static handleValidationErrors(
    errors: Array<{ msg: string; param?: string }>,
  ): { response: ApiResponse; statusCode: number } {
    Logger.debug("[ErrorHandlerService] Handling validation errors", {
      errorCount: errors.length,
    });

    const message = errors.map((err) => err.msg).join(", ");

    const response: ApiResponse = {
      success: false,
      message: message || "Validation failed",
    };

    return { response, statusCode: HttpStatusCodes.BAD_REQUEST };
  }

  static isOperationalError(error: unknown): boolean {
    try {
      const errorDetails = this.classificationService.classify(error);
      return errorDetails.isOperational;
    } catch {
      return false;
    }
  }
}
