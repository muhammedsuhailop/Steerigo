import { IErrorClassifier } from "./IErrorClassifier";
import { ErrorDetails } from "../ErrorDetails";
import { ErrorType } from "@shared/enums/ErrorType";
import { Logger } from "@shared/utils/Logger";
import { HttpStatusCodes } from "@shared/enums/HttpStatusCodes";

export class ValidationErrorClassifier implements IErrorClassifier {
  readonly priority = 2;

  canHandle(error: unknown): boolean {
    if (typeof error !== "object" || error === null) return false;

    const name = this.getStringProp(error, "name");
    const message = this.getStringProp(error, "message")?.toLowerCase() || "";

    if (name === "ValidationError") return true;

    const validationKeywords = ["validation", "invalid", "required", "must be"];
    return validationKeywords.some((keyword) => message.includes(keyword));
  }

  classify(error: unknown): ErrorDetails {
    Logger.debug("[ValidationErrorClassifier] Classifying validation error");

    const message = this.getStringProp(error, "message") || "Validation failed";

    return {
      statusCode: HttpStatusCodes.BAD_REQUEST,
      message: message,
      type: ErrorType.VALIDATION_ERROR,
      shouldLog: false,
      isOperational: true,
    };
  }

  private getStringProp(obj: unknown, prop: string): string | undefined {
    if (typeof obj === "object" && obj !== null && prop in obj) {
      const value = (obj as Record<string, unknown>)[prop];
      return typeof value === "string" ? value : undefined;
    }
    return undefined;
  }
}
