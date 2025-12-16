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
    // log raw error in dev
    if (typeof import.meta !== "undefined" && (import.meta as any).env?.DEV) {
      // eslint-disable-next-line no-console
      console.warn("Auth Error (raw):", error);
    }

    // if looks like a technical/internal error, return server message
    if (this.isTechnicalError(error)) {
      return {
        message: this.USER_MESSAGES.SERVER_ERROR,
        isUserActionable: false,
        shouldShowInForm: true,
      };
    }

    // normalize incoming error
    const processedError = this.normalizeError(error);

    // if already BaseError-like, use it directly to avoid double-parsing
    let parsedError: BaseError;
    if (
      processedError &&
      (processedError.type || processedError.code || processedError.userMessage)
    ) {
      // Already BaseError-like
      parsedError = processedError as BaseError;
    } else {
      // parse raw/axios style error
      parsedError = errorHandler.parseApiError(
        processedError,
        context
      ) as BaseError;
    }

    // log parsed error for diagnostics
    errorHandler.logError(parsedError);

    return {
      message: this.getUserMessage(parsedError),
      isUserActionable: this.isUserActionable(parsedError.type),
      shouldShowInForm: this.shouldShowInForm(parsedError.type),
    };
  }

  // normalize various error shapes into something parseApiError expects
  private static normalizeError(error: any): any {
    try {
      // if already a BaseError-like object, return as-is
      if (error && (error.type || error.code || error.userMessage)) {
        return error;
      }

      // handle axiosBaseQuery normalized shape: { status, data }
      if (
        error &&
        (typeof error.status !== "undefined" ||
          typeof error.data !== "undefined")
      ) {
        return {
          response:
            typeof error.status !== "undefined"
              ? { status: error.status, data: error.data ?? {} }
              : undefined,
          message:
            (error.data && (error.data.message || error.data.error)) ||
            error.message ||
            `HTTP ${error.status ?? "UNKNOWN"}`,
          original: error,
        };
      }

      // if it's an AxiosError with response, return as-is
      if (
        error &&
        error.response &&
        (error.response.status || error.response.data)
      ) {
        return error;
      }

      // plain object with data field
      if (error && error.data) {
        return {
          response: { status: error.status ?? "UNKNOWN", data: error.data },
          message: error.data?.message || error.message || "Error",
          original: error,
        };
      }

      // Error instance
      if (error instanceof Error) {
        return { message: error.message, original: error };
      }

      // fallback wrap
      return { message: String(error ?? "Unknown error"), original: error };
    } catch (e) {
      // fallback when normalization fails
      return { message: "Unknown error during normalization", original: error };
    }
  }

  // detect technical-level errors (DB / SSL / internal)
  private static isTechnicalError(error: any): boolean {
    const rawMessage =
      (error?.data && (error.data.message || error.data.error)) ||
      error?.message ||
      error?.original?.message ||
      "";
    const message = String(rawMessage).toLowerCase();

    const technicalPatterns = [
      "ssl",
      "database",
      "connection",
      "internal error",
      "timeout",
      "error:",
      "exception:",
      "stack trace",
      "c:\\\\",
      ".c:",
      "enotfound",
      "econnrefused",
    ];

    return technicalPatterns.some((pattern) => message.includes(pattern));
  }

  // prefer backend userMessage, handle network/no-response explicitly
  private static getUserMessage(parsedError: BaseError): string {
    // prefer explicit userMessage from backend
    if (
      parsedError?.userMessage &&
      String(parsedError.userMessage).trim() !== ""
    ) {
      return parsedError.userMessage;
    }

    // prefer message if not low-level technical
    if (parsedError?.message && String(parsedError.message).trim() !== "") {
      const lowLevel = String(parsedError.message).toLowerCase();
      if (
        ![
          "internal server error",
          "uncaught exception",
          "stacktrace",
          "stack trace",
        ].some((p) => lowLevel.includes(p))
      ) {
        if (parsedError.type === ErrorType.NETWORK) {
          return this.USER_MESSAGES.NETWORK_ERROR;
        }
        return parsedError.message;
      }
    }

    // fallback by error type
    switch (parsedError.type) {
      case ErrorType.VALIDATION:
        return (
          parsedError.userMessage ||
          parsedError.message ||
          this.USER_MESSAGES.VALIDATION_ERROR
        );

      case ErrorType.AUTHENTICATION:
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
