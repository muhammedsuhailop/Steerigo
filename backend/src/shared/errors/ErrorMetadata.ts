import { ErrorType } from "@shared/enums/ErrorType";

export interface ErrorMetadata {
  statusCode: number;
  errorType: ErrorType;
  shouldLog: boolean;
  isOperational: boolean;
  category?: "NOT_FOUND" | "VALIDATION" | "CONFLICT" | "AUTH" | "SERVER";
}

export class ErrorMetadataInferrer {
  static inferFromCode(code?: string): ErrorMetadata {
    if (!code) {
      return {
        statusCode: 500,
        errorType: ErrorType.SERVER_ERROR,
        shouldLog: true,
        isOperational: false,
        category: "SERVER",
      };
    }

    const codeUpper = code.toUpperCase();

    // NOT_FOUND patterns (404)
    if (codeUpper.includes("NOT_FOUND") || codeUpper.endsWith("_NOT_FOUND")) {
      return {
        statusCode: 404,
        errorType: ErrorType.NOT_FOUND_ERROR,
        shouldLog: false,
        isOperational: true,
        category: "NOT_FOUND",
      };
    }

    // VALIDATION patterns (400)
    if (codeUpper.startsWith("INVALID_") || codeUpper.includes("_INVALID")) {
      return {
        statusCode: 400,
        errorType: ErrorType.VALIDATION_ERROR,
        shouldLog: false,
        isOperational: true,
        category: "VALIDATION",
      };
    }

    // CONFLICT patterns (409)
    if (codeUpper.includes("ALREADY_") || codeUpper.includes("DUPLICATE_")) {
      return {
        statusCode: 409,
        errorType: ErrorType.CONFLICT_ERROR,
        shouldLog: false,
        isOperational: true,
        category: "CONFLICT",
      };
    }

    // AUTHENTICATION patterns (401)
    if (
      codeUpper.includes("UNAUTHORIZED") ||
      codeUpper.includes("FORBIDDEN") ||
      codeUpper.includes("AUTH")
    ) {
      return {
        statusCode: 401,
        errorType: ErrorType.AUTHENTICATION_ERROR,
        shouldLog: false,
        isOperational: true,
        category: "AUTH",
      };
    }

    // AUTHORIZATION patterns (403)
    if (
      codeUpper.includes("PERMISSION") ||
      codeUpper.includes("ACCESS_DENIED")
    ) {
      return {
        statusCode: 403,
        errorType: ErrorType.AUTHORIZATION_ERROR,
        shouldLog: false,
        isOperational: true,
        category: "AUTH",
      };
    }

    // Default: Server error (500)
    return {
      statusCode: 500,
      errorType: ErrorType.SERVER_ERROR,
      shouldLog: true,
      isOperational: false,
      category: "SERVER",
    };
  }
}
