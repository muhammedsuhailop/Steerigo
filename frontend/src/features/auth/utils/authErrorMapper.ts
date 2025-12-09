import { errorHandler } from "@/shared/utils/errorHandler";
import {
  BaseError,
  ErrorType,
} from "@/shared/components/ui/ErrorHandling/ErrorHandling.types";

export interface AuthErrorResult {
  message: string;
  isUserActionable: boolean;
  shouldShowInForm: boolean;
}

export class AuthErrorMapper {
  private static readonly USER_MESSAGES = {
    NETWORK_ERROR:
      "Unable to connect. Please check your internet connection and try again.",
    SERVER_ERROR:
      "Something went wrong on our end. Please try again in a moment.",
    INVALID_CREDENTIALS:
      "Invalid email or password. Please check your credentials and try again.",
    VALIDATION_ERROR: "Please check your input and try again.",
    UNKNOWN: "An unexpected error occurred. Please try again.",
    AUTHORIZATION_ERROR: "Account access restricted",
  };
  static USER_FRIENDLY_MESSAGES: any;

  static processAuthError(
    error: any,
    context: string = "authentication"
  ): AuthErrorResult {
    // Debug in development
    if (import.meta.env.DEV) {
      console.warn("Auth Error:", error);
    }

    // Check for technical errors first
    if (this.isTechnicalError(error)) {
      return {
        message: this.USER_MESSAGES.SERVER_ERROR,
        isUserActionable: false,
        shouldShowInForm: true,
      };
    }

    // Process with existing error handler
    const processedError = this.normalizeError(error);
    const parsedError: BaseError = errorHandler.parseApiError(
      processedError,
      context
    );
    errorHandler.logError(parsedError);

    return {
      message: this.getUserMessage(parsedError),
      isUserActionable: this.isUserActionable(parsedError.type),
      shouldShowInForm: this.shouldShowInForm(parsedError.type),
    };
  }

  private static normalizeError(error: any): any {
    // RTK Query format
    if (error?.status && error?.data) {
      return {
        response: { status: error.status, data: error.data },
        message: error.data?.message || `HTTP ${error.status}`,
      };
    }
    return error;
  }

  private static isTechnicalError(error: any): boolean {
    const message = error?.data?.message || error?.message || "";
    const technicalPatterns = [
      "ssl",
      "database",
      "connection",
      "internal error",
      "timeout",
      "error:",
      "exception:",
      "stack trace",
      "c:\\",
      ".c:",
    ];

    return technicalPatterns.some((pattern) =>
      message.toLowerCase().includes(pattern)
    );
  }

  private static getUserMessage(parsedError: BaseError): string {
    switch (parsedError.type) {
      case ErrorType.VALIDATION:
        return (
          parsedError.userMessage ||
          parsedError.message ||
          this.USER_MESSAGES.VALIDATION_ERROR
        );

      case ErrorType.AUTHENTICATION:
        const msg = parsedError.message.toLowerCase();
        if (msg.includes("invalid") || msg.includes("password")) {
          return this.USER_MESSAGES.INVALID_CREDENTIALS;
        }
        return this.USER_MESSAGES.INVALID_CREDENTIALS;

      case ErrorType.AUTHORIZATION:
        return (
          parsedError.userMessage || this.USER_MESSAGES.AUTHORIZATION_ERROR
        );

      case ErrorType.NETWORK:
        return this.USER_MESSAGES.NETWORK_ERROR;

      case ErrorType.SERVER:
        return this.USER_MESSAGES.SERVER_ERROR;

      case ErrorType.CLIENT:
        return parsedError.userMessage || this.USER_MESSAGES.VALIDATION_ERROR;

      default:
        return this.USER_MESSAGES.UNKNOWN;
    }
  }

  private static isUserActionable(type: ErrorType): boolean {
    return [
      ErrorType.VALIDATION,
      ErrorType.AUTHENTICATION,
      ErrorType.CLIENT,
    ].includes(type);
  }

  private static shouldShowInForm(type: ErrorType): boolean {
    return [
      ErrorType.VALIDATION,
      ErrorType.AUTHENTICATION,
      ErrorType.CLIENT,
    ].includes(type);
  }
}

export const authErrorMapper = AuthErrorMapper;
