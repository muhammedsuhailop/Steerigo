import { IErrorClassifier } from "./IErrorClassifier";
import { ErrorDetails } from "../ErrorDetails";
import { ErrorType } from "@shared/enums/ErrorType";
import { Logger } from "@shared/utils/Logger";
import { HttpStatusCodes } from "@shared/enums/HttpStatusCodes";

export class DatabaseErrorClassifier implements IErrorClassifier {
  readonly priority = 3;

  private readonly DATABASE_PATTERNS = [
    "database",
    "connection",
    "mongodb",
    "mongoose",
    "sql",
    "redis",
    "timeout",
    "econnrefused",
    "enotfound",
    "etimedout",
  ];

  canHandle(error: unknown): boolean {
    if (typeof error !== "object" || error === null) return false;

    const message = this.getStringProp(error, "message")?.toLowerCase() || "";
    const code = String(this.getStringProp(error, "code") ?? "").toLowerCase();

    return this.DATABASE_PATTERNS.some(
      (pattern) => message.includes(pattern) || code.includes(pattern),
    );
  }

  classify(error: unknown): ErrorDetails {
    Logger.debug("[DatabaseErrorClassifier] Classifying database error");

    // Check for MongoDB duplicate key error (E11000)
    if (this.isMongoDbDuplicateKeyError(error)) {
      return this.handleDuplicateKeyError(error);
    }

    // Generic database/connection error
    Logger.warn("[DatabaseErrorClassifier] Database connection error", {
      message: this.getStringProp(error, "message"),
      code: this.getStringProp(error, "code"),
    });

    return {
      statusCode: HttpStatusCodes.SERVICE_UNAVAILABLE,
      message:
        "Database service temporarily unavailable. Please try again later.",
      type: ErrorType.DATABASE_ERROR,
      shouldLog: true,
      isOperational: false,
    };
  }

  private isMongoDbDuplicateKeyError(error: unknown): boolean {
    const code = this.getNumberProp(error, "code");
    const message = this.getStringProp(error, "message") ?? "";

    return (
      code === 11000 ||
      message.includes("E11000 duplicate key error") ||
      message.includes("duplicate key error collection")
    );
  }

  private handleDuplicateKeyError(error: unknown): ErrorDetails {
    const message = this.getStringProp(error, "message")?.toLowerCase() || "";

    Logger.debug("[DatabaseErrorClassifier] Handling duplicate key error", {
      message,
    });

    // Check what field caused the duplicate
    if (message.includes("email")) {
      return {
        statusCode: HttpStatusCodes.CONFLICT,
        message: "An account with this email already exists",
        type: ErrorType.CONFLICT_ERROR,
        shouldLog: false,
        isOperational: true,
      };
    }

    if (message.includes("mobile") || message.includes("phone")) {
      return {
        statusCode: HttpStatusCodes.CONFLICT,
        message: "This mobile number is already registered",
        type: ErrorType.CONFLICT_ERROR,
        shouldLog: false,
        isOperational: true,
      };
    }

    // Generic duplicate key error
    return {
      statusCode: HttpStatusCodes.CONFLICT,
      message: "A record with this information already exists",
      type: ErrorType.CONFLICT_ERROR,
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

  private getNumberProp(obj: unknown, prop: string): number | undefined {
    if (typeof obj === "object" && obj !== null && prop in obj) {
      const value = (obj as Record<string, unknown>)[prop];
      return typeof value === "number" ? value : undefined;
    }
    return undefined;
  }
}
