import {
  BaseError,
  ErrorType,
  ErrorSeverity,
  ApiErrorResponse,
  ValidationError,
  NetworkError,
  ServerError,
} from "@/shared/components/ui/ErrorHandling/ErrorHandling.types";

interface PotentialAxiosError {
  message?: string;
  code?: string;
  config?: { url?: string };
  response?: {
    status: number;
    headers?: Record<string, string>;
    data?: unknown;
  };
}

interface PotentialBaseError {
  type?: ErrorType;
  code?: string;
  userMessage?: string;
  timestamp?: string | { toISOString: () => string };
}

export class ErrorHandler {
  private static instance: ErrorHandler;

  public static getInstance(): ErrorHandler {
    if (!ErrorHandler.instance) {
      ErrorHandler.instance = new ErrorHandler();
    }
    return ErrorHandler.instance;
  }

  // Type guard for ApiErrorResponse using unknown
  private isApiErrorResponse(data: unknown): data is ApiErrorResponse {
    if (!data || typeof data !== "object") return false;
    const d = data as ApiErrorResponse;
    return (
      d.error &&
      typeof d.error === "object" &&
      "code" in d.error &&
      "message" in d.error &&
      "userMessage" in d.error
    );
  }

  // Detect common network error codes safely
  private isNetworkError(error: PotentialAxiosError): boolean {
    const networkErrorCodes = [
      "ECONNABORTED",
      "ERR_NETWORK",
      "NETWORK_ERROR",
      "ETIMEDOUT",
      "ENOTFOUND",
      "ERR_NETWORK_UNREACHABLE",
    ];
    return !!error.code && networkErrorCodes.includes(error.code);
  }

  // Extract or generate a request ID safely
  private extractRequestId(error: PotentialAxiosError): string {
    const dataAsRecord = error.response?.data as
      | Record<string, unknown>
      | undefined;

    return (
      error.response?.headers?.["x-request-id"] ||
      (typeof dataAsRecord?.requestId === "string"
        ? dataAsRecord.requestId
        : "") ||
      this.generateRequestId()
    );
  }

  // Main entry point for parsing errors
  public parseApiError(error: unknown, context?: string): BaseError {
    // 1. Check if it's already a BaseError
    const potential = error as PotentialBaseError;
    if (
      potential &&
      (potential.type ||
        potential.code === "NO_RESPONSE" ||
        potential.userMessage)
    ) {
      return error as BaseError;
    }

    const err = error as PotentialAxiosError;
    const timestamp = new Date().toISOString();
    const requestId = this.extractRequestId(err);

    //  Handle Network Errors
    if (this.isNetworkError(err)) {
      return {
        type: ErrorType.NETWORK,
        code: "NETWORK_ERROR",
        message: "Network connection failed",
        userMessage: "Please check your internet connection and try again.",
        severity: ErrorSeverity.HIGH,
        timestamp,
        requestId,
        context,
        details: { originalError: err.message ?? "Unknown Network Error" },
      } as NetworkError;
    }

    // Handle "No Response"
    if (!err.response) {
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

    const { status, data } = err.response;
    const apiError = this.isApiErrorResponse(data) ? data : null;

    // Status-based Routing
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
        return this.handleConflict(
          apiError,
          data,
          timestamp,
          requestId,
          context,
        );
      case 422:
        return this.handleValidationError(
          apiError,
          timestamp,
          requestId,
          context,
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
          err.config?.url,
          context,
        );
      default:
        return this.handleUnknownError(
          status,
          apiError,
          timestamp,
          requestId,
          context,
        );
    }
  }

  private handleBadRequest(
    data: ApiErrorResponse | null,
    timestamp: string,
    requestId: string,
    context?: string,
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
    timestamp: string,
    requestId: string,
    context?: string,
  ): BaseError {
    return {
      type: ErrorType.AUTHENTICATION,
      code: "UNAUTHORIZED",
      message: data?.error.message ?? "Authentication failed",
      userMessage:
        data?.error.userMessage ??
        "Your session has expired. Please log in again.",
      severity: ErrorSeverity.HIGH,
      timestamp,
      requestId,
      context,
    };
  }

  private handleForbidden(
    data: ApiErrorResponse | null,
    timestamp: string,
    requestId: string,
    context?: string,
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
    timestamp: string,
    requestId: string,
    context?: string,
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
    rawData: unknown,
    timestamp: string,
    requestId: string,
    context?: string,
  ): BaseError {
    if (import.meta.env.DEV) {
      console.log(
        "%c[ErrorHandler] handleConflict invoked",
        "color:#f39c12;font-weight:bold;",
        { data, context },
      );
    }

    let backendMessage = "Resource conflict";
    if (data?.error?.message) {
      backendMessage = data.error.message;
    } else if (rawData && typeof rawData === "object") {
      const r = rawData as Record<string, unknown>;
      if (typeof r.message === "string") backendMessage = r.message;
      else if (typeof r.error === "string") backendMessage = r.error;
    }

    return {
      type: ErrorType.CLIENT,
      code: "CONFLICT",
      message: backendMessage,
      userMessage: data?.error.userMessage ?? backendMessage,
      severity: ErrorSeverity.MEDIUM,
      timestamp,
      requestId,
      context,
    };
  }

  private handleValidationError(
    data: ApiErrorResponse | null,
    timestamp: string,
    requestId: string,
    context?: string,
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
    timestamp: string,
    requestId: string,
    context?: string,
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
      details: {
        retryAfter: (data?.error.details as Record<string, unknown>)
          ?.retryAfter,
      },
    };
  }

  private handleServerError(
    status: number,
    data: ApiErrorResponse | null,
    timestamp: string,
    requestId: string,
    url?: string,
    context?: string,
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
    timestamp: string,
    requestId: string,
    context?: string,
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

  private generateRequestId(): string {
    return (
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15)
    );
  }

  public logError(error: BaseError): void {
    const timestampStr =
      typeof error.timestamp === "string"
        ? error.timestamp
        : (error.timestamp as any)?.toISOString?.() || new Date().toISOString();

    const logData = {
      ...error,
      userAgent: navigator.userAgent,
      url: window.location.href,
      timestamp: timestampStr,
    };

    if (import.meta.env.DEV) {
      console.group(
        `[${error.severity.toUpperCase()}] ${error.type.toUpperCase()}`,
      );
      console.error("Error:", error.message);
      console.error("User Message:", error.userMessage);
      console.groupEnd();
    }

    if (import.meta.env.PROD && error.severity !== ErrorSeverity.LOW) {
      this.sendToMonitoring(logData);
    }
  }

  private sendToMonitoring(errorData: Record<string, unknown>): void {
    fetch("/api/logs/errors", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(errorData),
    }).catch(() => {});
  }

  public getUserMessage(error: BaseError): string {
    return error.userMessage || this.getDefaultUserMessage(error.type);
  }

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

export const errorHandler = ErrorHandler.getInstance();
