import type { AppDispatch } from "@/app/store/store";
import { addError } from "@/shared/components/ui/ErrorHandling/errorSlice";
import {
  BaseError,
  ErrorSeverity,
  ErrorType,
} from "@/shared/components/ui/ErrorHandling/ErrorHandling.types";
import { errorHandler } from "@/shared/utils/errorHandler";

// Centralized service for routing errors, logging, and dispatching toast notifications
export class ErrorDispatcher {
  private static dispatch: AppDispatch | null = null;

  // Initialize dispatcher with Redux dispatch
  public static setDispatch(dispatch: AppDispatch): void {
    ErrorDispatcher.dispatch = dispatch;
    if (import.meta.env.DEV) {
      console.log("ErrorDispatcher initialized");
    }
  }

  // Core method to dispatch a single error
  public static dispatchError(
    error: BaseError,
    showToast: boolean = true
  ): void {
    if (!ErrorDispatcher.dispatch) {
      console.warn("ErrorDispatcher not initialized");
      errorHandler.logError(error);
      return;
    }

    const normalizedError: BaseError = {
      ...error,
      timestamp: error.timestamp || new Date().toISOString(),
      requestId: error.requestId || ErrorDispatcher.generateRequestId(),
      severity: error.severity || ErrorSeverity.MEDIUM,
    };

    // Log error
    errorHandler.logError(normalizedError);

    // Show toast if enabled
    if (showToast) {
      if (import.meta.env.DEV) {
        console.debug(
          `Toast: [${normalizedError.severity}] ${normalizedError.code} - ${normalizedError.userMessage}`
        );
      }
      ErrorDispatcher.dispatch(addError(normalizedError));
    }
  }

  // Dispatch multiple errors
  public static dispatchErrors(
    errors: BaseError[],
    showToast: boolean = true
  ): void {
    errors.forEach((error) => {
      ErrorDispatcher.dispatchError(error, showToast);
    });
  }

  // Parse raw errors and dispatch them with context
  public static dispatchWithContext(
    error: BaseError | Error | any,
    context: string,
    severity: ErrorSeverity = ErrorSeverity.MEDIUM
  ): void {
    let baseError: BaseError;

    if (error instanceof Error) {
      baseError = {
        type: ErrorType.CLIENT,
        code: "ERROR",
        message: error.message,
        userMessage: error.message,
        severity,
        timestamp: new Date().toISOString(),
        requestId: ErrorDispatcher.generateRequestId(),
        context,
        details: {
          name: error.name,
          stack: error.stack,
        },
      };
    } else if (error && typeof error === "object" && "type" in error) {
      baseError = {
        ...error,
        context: context || error.context,
        severity: severity || error.severity,
      };
    } else {
      baseError = {
        type: ErrorType.UNKNOWN,
        code: "UNKNOWN_ERROR",
        message: String(error ?? "Unknown error occurred"),
        userMessage: "An unexpected error occurred.",
        severity,
        timestamp: new Date().toISOString(),
        requestId: ErrorDispatcher.generateRequestId(),
        context,
      };
    }

    ErrorDispatcher.dispatchError(baseError);
  }

  // Get icon name for toast
  public static getIconForSeverity(severity: ErrorSeverity): string {
    switch (severity) {
      case ErrorSeverity.LOW:
        return "info";
      case ErrorSeverity.MEDIUM:
        return "alert-circle";
      case ErrorSeverity.HIGH:
      case ErrorSeverity.CRITICAL:
        return "alert-triangle";
      default:
        return "help-circle";
    }
  }

  // Get color for toast
  public static getColorForSeverity(severity: ErrorSeverity): string {
    switch (severity) {
      case ErrorSeverity.LOW:
        return "blue";
      case ErrorSeverity.MEDIUM:
        return "yellow";
      case ErrorSeverity.HIGH:
        return "red";
      case ErrorSeverity.CRITICAL:
        return "dark-red";
      default:
        return "gray";
    }
  }

  // Get standard title per error type
  public static getTitleForType(type: ErrorType): string {
    const titles: Record<ErrorType, string> = {
      [ErrorType.AUTHENTICATION]: "Authentication Failed",
      [ErrorType.AUTHORIZATION]: "Access Denied",
      [ErrorType.VALIDATION]: "Invalid Input",
      [ErrorType.NETWORK]: "Connection Error",
      [ErrorType.SERVER]: "Server Error",
      [ErrorType.CLIENT]: "Request Error",
      [ErrorType.UNKNOWN]: "Unknown Error",
    };
    return titles[type] || `Error: ${type}`;
  }

  // Determine if error can be retried
  public static isRetryable(error: BaseError): boolean {
    const retryableCodes = [
      "NETWORK_ERROR",
      "TIMEOUT",
      "SERVER_ERROR",
      "NO_RESPONSE",
      "RATE_LIMIT",
    ];
    return retryableCodes.includes(error.code);
  }

  // Determine if user must act based on error type
  public static isUserActionable(error: BaseError): boolean {
    return [
      ErrorType.VALIDATION,
      ErrorType.AUTHENTICATION,
      ErrorType.AUTHORIZATION,
    ].includes(error.type);
  }

  // Generate unique request ID
  private static generateRequestId(): string {
    return (
      "err_" +
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15)
    );
  }
}

// Export singleton
export const errorDispatcher = ErrorDispatcher;
