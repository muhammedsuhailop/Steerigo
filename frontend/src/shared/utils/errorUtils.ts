import {
  BaseError,
  ErrorType,
  ErrorSeverity,
  ApiErrorResponse,
  ValidationError,
  NetworkError,
  ServerError,
} from "../components/ui/ErrorHandling/ErrorHandling.types";

export class ErrorHandler {
  private static instance: ErrorHandler;

  public static getInstance(): ErrorHandler {
    if (!ErrorHandler.instance) {
      ErrorHandler.instance = new ErrorHandler();
    }
    return ErrorHandler.instance;
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
