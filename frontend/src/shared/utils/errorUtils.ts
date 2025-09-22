import {
  BaseError,
  ErrorType,
  ErrorSeverity,
  ApiErrorResponse,
  ValidationError,
  NetworkError,
  ServerError,
} from "../components/ui/ErrorHandling/ErrorHandling.types";
import { addError, clearErrorsByContext, removeError } from "../components/ui/ErrorHandling/errorSlice";
import { store } from "../../app/store";

// Auth-specific error contexts
export const AuthContext = {
  LOGIN: "auth:login",
  SIGNUP: "auth:signup",
  OTP_VERIFICATION: "auth:otp_verification",
  PASSWORD_RESET: "auth:password_reset",
  PASSWORD_UPDATE: "auth:password_update",
  TOKEN_REFRESH: "auth:token_refresh",
  GOOGLE_AUTH: "auth:google_auth",
  LOGOUT: "auth:logout",
} as const;

export class ErrorHandler {
  private static instance: ErrorHandler;

  public static getInstance(): ErrorHandler {
    if (!ErrorHandler.instance) {
      ErrorHandler.instance = new ErrorHandler();
    }
    return ErrorHandler.instance;
  }

  // Dispatch error to centralized system
  public dispatchError(error: BaseError): void {
    this.logError(error);
    store.dispatch(addError(error));
  }

  // Remove error by code
  public removeError(errorCode: string): void {
    store.dispatch(removeError(errorCode));
  }

  // Clear errors by auth context
  public clearAuthErrors(context: string): void {
    store.dispatch(clearErrorsByContext(context));
  }

  // Handle auth-specific errors
  public handleAuthError(
    error: any,
    context: string,
    customUserMessage?: string
  ): BaseError {
    const parsedError = this.parseApiError(error, context);

    // Override user message for auth-specific contexts
    if (customUserMessage) {
      parsedError.userMessage = customUserMessage;
    } else {
      parsedError.userMessage = this.getAuthUserMessage(context, parsedError);
    }

    this.dispatchError(parsedError);
    return parsedError;
  }

  private getAuthUserMessage(context: string, error: BaseError): string {
    const authMessages: Record<string, string> = {
      [AuthContext.LOGIN]: "Login failed. Please check your credentials and try again.",
      [AuthContext.SIGNUP]: "Account creation failed. Please check your information.",
      [AuthContext.OTP_VERIFICATION]: "OTP verification failed. Please check your code.",
      [AuthContext.PASSWORD_RESET]: "Password reset failed. Please try again.",
      [AuthContext.PASSWORD_UPDATE]: "Password update failed. Please try again.",
      [AuthContext.TOKEN_REFRESH]: "Session expired. Please log in again.",
      [AuthContext.GOOGLE_AUTH]: "Google authentication failed. Please try again.",
      [AuthContext.LOGOUT]: "Logout failed. Please try again.",
    };

    if (context in authMessages) {
      return authMessages[context as keyof typeof authMessages];
    }

    return error.userMessage || this.getDefaultUserMessage(error.type);
  }

  // Parse API error response
  public parseApiError(error: any, context?: string): BaseError {
    const timestamp = new Date();
    const requestId =
      error.response?.headers?.["x-request-id"] || this.generateRequestId();

    // Network errors (no response)
    if (
      error.code === "ECONNABORTED" ||
      error.code === "ERR_NETWORK" ||
      error.code === "NETWORK_ERROR"
    ) {
      return {
        type: ErrorType.NETWORK,
        code: "NETWORK_ERROR",
        message: "Network connection failed",
        userMessage: "Please check your internet connection and try again.",
        severity: ErrorSeverity.HIGH,
        timestamp,
        requestId,
        context,
        details: { originalError: error.message },
      } as NetworkError;
    }

    // No response received
    if (!error.response) {
      return {
        type: ErrorType.NETWORK,
        code: "NO_RESPONSE",
        message: "No response received from server",
        userMessage:
          "Server is temporarily unavailable. Please try again later.",
        severity: ErrorSeverity.HIGH,
        timestamp,
        requestId,
        context,
      } as NetworkError;
    }

    const { status, data } = error.response;

    // Handle different HTTP status codes
    switch (status) {
      case 400:
        return this.handleBadRequest(data, timestamp, requestId, context);
      case 401:
        return this.handleUnauthorized(data, timestamp, requestId, context);
      case 403:
        return this.handleForbidden(data, timestamp, requestId, context);
      case 404:
        return this.handleNotFound(data, timestamp, requestId, context);
      case 409:
        return this.handleConflict(data, timestamp, requestId, context);
      case 422:
        return this.handleValidationError(data, timestamp, requestId, context);
      case 429:
        return this.handleRateLimit(data, timestamp, requestId, context);
      case 500:
      case 502:
      case 503:
      case 504:
        return this.handleServerError(
          status,
          data,
          timestamp,
          requestId,
          error.config?.url,
          context
        );
      default:
        return this.handleUnknownError(
          status,
          data,
          timestamp,
          requestId,
          context
        );
    }
  }

  private handleBadRequest(
    data: any,
    timestamp: Date,
    requestId: string,
    context?: string
  ): BaseError {
    return {
      type: ErrorType.CLIENT,
      code: "BAD_REQUEST",
      message: data?.error?.message || data?.message || "Bad request",
      userMessage:
        data?.error?.userMessage ||
        data?.userMessage ||
        "Invalid request. Please check your input and try again.",
      severity: ErrorSeverity.MEDIUM,
      timestamp,
      requestId,
      context,
      details: data?.error?.details || data?.details,
    };
  }

  private handleUnauthorized(
    data: any,
    timestamp: Date,
    requestId: string,
    context?: string
  ): BaseError {
    return {
      type: ErrorType.AUTHENTICATION,
      code: "UNAUTHORIZED",
      message: data?.error?.message || data?.message || "Authentication failed",
      userMessage: "Your session has expired. Please log in again.",
      severity: ErrorSeverity.HIGH,
      timestamp,
      requestId,
      context,
    };
  }

  private handleForbidden(
    data: any,
    timestamp: Date,
    requestId: string,
    context?: string
  ): BaseError {
    return {
      type: ErrorType.AUTHORIZATION,
      code: "FORBIDDEN",
      message: data?.error?.message || data?.message || "Access forbidden",
      userMessage: "You don't have permission to perform this action.",
      severity: ErrorSeverity.MEDIUM,
      timestamp,
      requestId,
      context,
    };
  }

  private handleNotFound(
    data: any,
    timestamp: Date,
    requestId: string,
    context?: string
  ): BaseError {
    return {
      type: ErrorType.CLIENT,
      code: "NOT_FOUND",
      message: data?.error?.message || data?.message || "Resource not found",
      userMessage: "The requested resource was not found.",
      severity: ErrorSeverity.MEDIUM,
      timestamp,
      requestId,
      context,
    };
  }

  private handleConflict(
    data: any,
    timestamp: Date,
    requestId: string,
    context?: string
  ): BaseError {
    return {
      type: ErrorType.CLIENT,
      code: "CONFLICT",
      message: data?.error?.message || data?.message || "Resource conflict",
      userMessage:
        data?.error?.userMessage ||
        data?.userMessage ||
        "This action conflicts with existing data.",
      severity: ErrorSeverity.MEDIUM,
      timestamp,
      requestId,
      context,
    };
  }

  private handleValidationError(
    data: any,
    timestamp: Date,
    requestId: string,
    context?: string
  ): ValidationError {
    return {
      type: ErrorType.VALIDATION,
      code: "VALIDATION_ERROR",
      message: data?.error?.message || data?.message || "Validation failed",
      userMessage:
        data?.error?.userMessage ||
        data?.userMessage ||
        "Please correct the highlighted fields and try again.",
      severity: ErrorSeverity.MEDIUM,
      timestamp,
      requestId,
      context,
      field: data?.error?.field || data?.field || "",
      value: data?.error?.value || data?.value,
      details: data?.error?.details || data?.details,
    };
  }

  private handleRateLimit(
    data: any,
    timestamp: Date,
    requestId: string,
    context?: string
  ): BaseError {
    return {
      type: ErrorType.CLIENT,
      code: "RATE_LIMIT",
      message: "Rate limit exceeded",
      userMessage: "Too many requests. Please wait a moment and try again.",
      severity: ErrorSeverity.MEDIUM,
      timestamp,
      requestId,
      context,
      details: { retryAfter: data?.retryAfter },
    };
  }

  private handleServerError(
    status: number,
    data: any,
    timestamp: Date,
    requestId: string,
    url?: string,
    context?: string
  ): ServerError {
    return {
      type: ErrorType.SERVER,
      code: "SERVER_ERROR",
      message:
        data?.error?.message || data?.message || `Server error (${status})`,
      userMessage: "Something went wrong on our end. Please try again later.",
      severity: ErrorSeverity.HIGH,
      timestamp,
      requestId,
      context,
      status,
      url: url || "",
    };
  }

  private handleUnknownError(
    status: number,
    data: any,
    timestamp: Date,
    requestId: string,
    context?: string
  ): BaseError {
    return {
      type: ErrorType.UNKNOWN,
      code: "UNKNOWN_ERROR",
      message:
        data?.error?.message || data?.message || `Unknown error (${status})`,
      userMessage: "An unexpected error occurred. Please try again.",
      severity: ErrorSeverity.HIGH,
      timestamp,
      requestId,
      context,
      details: { status, data },
    };
  }

  // Generate request ID for tracking
  private generateRequestId(): string {
    return (
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15)
    );
  }

  // Log error for monitoring
  public logError(error: BaseError): void {
    const logData = {
      ...error,
      userAgent: navigator.userAgent,
      url: window.location.href,
      timestamp: error.timestamp.toISOString(),
    };

    // Console logging for development
    if (import.meta.env.DEV) {
      console.group(
        `🚨 [${error.severity.toUpperCase()}] ${error.type.toUpperCase()}`
      );
      console.error("Error:", error.message);
      console.error("User Message:", error.userMessage);
      console.error("Context:", error.context);
      console.error("Details:", logData);
      console.groupEnd();
    }

    // Send to monitoring service in production
    if (import.meta.env.PROD && error.severity !== ErrorSeverity.LOW) {
      this.sendToMonitoring(logData);
    }
  }

  private sendToMonitoring(errorData: any): void {
    // Integrate with monitoring services like Sentry, LogRocket, etc.
    // For now, send to a logging endpoint
    try {
      fetch("/api/logs/errors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(errorData),
      }).catch(() => {
        // Silently fail - don't let logging errors break the app
      });
    } catch {
      // Silently fail
    }
  }

  // Get user-friendly error message
  public getUserMessage(error: BaseError): string {
    return error.userMessage || this.getDefaultUserMessage(error.type);
  }

  private getDefaultUserMessage(type: ErrorType): string {
    const defaultMessages = {
      [ErrorType.VALIDATION]: "Please check your input and try again.",
      [ErrorType.AUTHENTICATION]: "Please log in to continue.",
      [ErrorType.AUTHORIZATION]: "You don't have permission for this action.",
      [ErrorType.NETWORK]: "Please check your connection and try again.",
      [ErrorType.SERVER]: "Something went wrong. Please try again later.",
      [ErrorType.CLIENT]: "Invalid request. Please try again.",
      [ErrorType.UNKNOWN]: "An unexpected error occurred.",
    };
    return defaultMessages[type];
  }
}

// Export singleton instance
export const errorHandler = ErrorHandler.getInstance();