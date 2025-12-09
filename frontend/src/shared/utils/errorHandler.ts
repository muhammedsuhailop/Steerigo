import {
  BaseError,
  ErrorType,
  ErrorSeverity,
  ApiErrorResponse,
  ValidationError,
  NetworkError,
  ServerError,
} from "@/shared/components/ui/ErrorHandling/ErrorHandling.types";

// Centralized error handling and parsing. Converts Axios errors to BaseError objects.
export class ErrorHandler {
  private static instance: ErrorHandler;

  // Singleton instance
  public static getInstance(): ErrorHandler {
    if (!ErrorHandler.instance) {
      ErrorHandler.instance = new ErrorHandler();
    }
    return ErrorHandler.instance;
  }

  // Type guard for ApiErrorResponse
  private isApiErrorResponse(data: any): data is ApiErrorResponse {
    return (
      data &&
      typeof data === "object" &&
      "error" in data &&
      typeof data.error === "object" &&
      "code" in data.error &&
      "message" in data.error &&
      "userMessage" in data.error
    );
  }

  // Detect common network error codes
  private isNetworkError(error: any): boolean {
    const networkErrorCodes = [
      "ECONNABORTED",
      "ERR_NETWORK",
      "NETWORK_ERROR",
      "ETIMEDOUT",
      "ENOTFOUND",
      "ERR_NETWORK_UNREACHABLE",
    ];
    return networkErrorCodes.includes(error.code);
  }

  // Extract or generate a request ID
  private extractRequestId(error: any): string {
    return (
      error.response?.headers?.["x-request-id"] ||
      error.response?.data?.requestId ||
      this.generateRequestId()
    );
  }

  // Parse Axios error into BaseError
  public parseApiError(error: any, context?: string): BaseError {
    const timestamp = new Date();
    const requestId = this.extractRequestId(error);

    if (this.isNetworkError(error)) {
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
    const apiError = this.isApiErrorResponse(data) ? data : null;

    switch (status) {
      case 400:
        return this.handleBadRequest(apiError, timestamp, requestId, context);
      case 401:
        return this.handleUnauthorized(apiError, timestamp, requestId, context);
      case 403:
        return this.handleForbidden(apiError, timestamp, requestId, context);
      case 404:
        return this.handleNotFound(apiError, timestamp, requestId, context);
      case 409:
        return this.handleConflict(apiError, timestamp, requestId, context);
      case 422:
        return this.handleValidationError(
          apiError,
          timestamp,
          requestId,
          context
        );
      case 429:
        return this.handleRateLimit(apiError, timestamp, requestId, context);
      case 500:
      case 502:
      case 503:
      case 504:
        return this.handleServerError(
          status,
          apiError,
          timestamp,
          requestId,
          error.config?.url,
          context
        );
      default:
        return this.handleUnknownError(
          status,
          apiError,
          timestamp,
          requestId,
          context
        );
    }
  }

  private handleBadRequest(
    data: ApiErrorResponse | null,
    timestamp: Date,
    requestId: string,
    context?: string
  ): BaseError {
    return {
      type: ErrorType.CLIENT,
      code: "BAD_REQUEST",
      message: data?.error.message ?? "Bad request",
      userMessage:
        data?.error.userMessage ??
        "Invalid request. Please check your input and try again.",
      severity: ErrorSeverity.MEDIUM,
      timestamp,
      requestId,
      context,
      details: data?.error.details,
    };
  }

  private handleUnauthorized(
    data: ApiErrorResponse | null,
    timestamp: Date,
    requestId: string,
    context?: string
  ): BaseError {
    return {
      type: ErrorType.AUTHENTICATION,
      code: "UNAUTHORIZED",
      message: data?.error.message ?? "Authentication failed",
      userMessage: "Your session has expired. Please log in again.",
      severity: ErrorSeverity.HIGH,
      timestamp,
      requestId,
      context,
    };
  }

  private handleForbidden(
    data: ApiErrorResponse | null,
    timestamp: Date,
    requestId: string,
    context?: string
  ): BaseError {
    return {
      type: ErrorType.AUTHORIZATION,
      code: "FORBIDDEN",
      message: data?.error.message ?? "Access forbidden",
      userMessage:
        data?.error.userMessage ?? "You don't have permission for this action.",
      severity: ErrorSeverity.MEDIUM,
      timestamp,
      requestId,
      context,
    };
  }

  private handleNotFound(
    data: ApiErrorResponse | null,
    timestamp: Date,
    requestId: string,
    context?: string
  ): BaseError {
    return {
      type: ErrorType.CLIENT,
      code: "NOT_FOUND",
      message: data?.error.message ?? "Resource not found",
      userMessage: "The requested resource was not found.",
      severity: ErrorSeverity.MEDIUM,
      timestamp,
      requestId,
      context,
    };
  }

  private handleConflict(
    data: ApiErrorResponse | null,
    timestamp: Date,
    requestId: string,
    context?: string
  ): BaseError {
    return {
      type: ErrorType.CLIENT,
      code: "CONFLICT",
      message: data?.error.message ?? "Resource conflict",
      userMessage:
        data?.error.userMessage ?? "This action conflicts with existing data.",
      severity: ErrorSeverity.MEDIUM,
      timestamp,
      requestId,
      context,
    };
  }

  private handleValidationError(
    data: ApiErrorResponse | null,
    timestamp: Date,
    requestId: string,
    context?: string
  ): ValidationError {
    return {
      type: ErrorType.VALIDATION,
      code: "VALIDATION_ERROR",
      message: data?.error.message ?? "Validation failed",
      userMessage:
        data?.error.userMessage ??
        "Please correct the highlighted fields and try again.",
      severity: ErrorSeverity.MEDIUM,
      timestamp,
      requestId,
      context,
      field: data?.error.field ?? "",
      value: data?.error.details,
      details: data?.error.details,
    };
  }

  private handleRateLimit(
    data: ApiErrorResponse | null,
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
      details: { retryAfter: data?.error.details?.retryAfter },
    };
  }

  private handleServerError(
    status: number,
    data: ApiErrorResponse | null,
    timestamp: Date,
    requestId: string,
    url?: string,
    context?: string
  ): ServerError {
    return {
      type: ErrorType.SERVER,
      code: "SERVER_ERROR",
      message: data?.error.message ?? `Server error (${status})`,
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
    data: ApiErrorResponse | null,
    timestamp: Date,
    requestId: string,
    context?: string
  ): BaseError {
    return {
      type: ErrorType.UNKNOWN,
      code: "UNKNOWN_ERROR",
      message: data?.error.message ?? `Unknown error (${status})`,
      userMessage: "An unexpected error occurred. Please try again.",
      severity: ErrorSeverity.HIGH,
      timestamp,
      requestId,
      context,
      details: { status, data },
    };
  }

  // Generate a unique request ID
  private generateRequestId(): string {
    return (
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15)
    );
  }

  // Log error for debugging and monitoring
  public logError(error: BaseError): void {
    const logData = {
      ...error,
      userAgent: navigator.userAgent,
      url: window.location.href,
      timestamp: error.timestamp.toISOString(),
    };

    if (import.meta.env.DEV) {
      console.group(
        `[${error.severity.toUpperCase()}] ${error.type.toUpperCase()}`
      );
      console.error("Error:", error.message);
      console.error("User Message:", error.userMessage);
      console.error("Context:", error.context);
      console.error("Details:", logData);
      console.groupEnd();
    }

    if (import.meta.env.PROD && error.severity !== ErrorSeverity.LOW) {
      this.sendToMonitoring(logData);
    }
  }

  // Send error data to monitoring endpoint
  private sendToMonitoring(errorData: any): void {
    try {
      fetch("/api/logs/errors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(errorData),
      }).catch(() => {
        // ignore failures
      });
    } catch {
      // ignore failures
    }
  }

  // Get a user-facing message for an error
  public getUserMessage(error: BaseError): string {
    return error.userMessage || this.getDefaultUserMessage(error.type);
  }

  // Default messages per error type
  private getDefaultUserMessage(type: ErrorType): string {
    const defaultMessages: Record<ErrorType, string> = {
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
