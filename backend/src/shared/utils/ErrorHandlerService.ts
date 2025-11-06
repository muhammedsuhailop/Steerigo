import { ApiResponse } from "@shared/types/Common";
import { Logger } from "@shared/utils/Logger";
import {
  DomainError,
  InvalidCredentialsError,
  UserAlreadyExistsError,
  MaxOtpAttemptsError,
  OtpExpiredError,
  RefreshTokenExpiredError,
  RefreshTokenRevokedError,
  AccountStatusError,
  MobileAlreadyExistsError,
} from "@domain/errors";
import {
  DriverAlreadyAvailableError,
  InvalidStatusTransitionError,
  DriverAvailabilityNotFoundError,
  DriverProfileNotFoundError,
  ExpiredAvailabilityError,
} from "@domain/errors/DriverAvailabilityErrors";
import {
  DriverAccessDeniedError,
  KycDocumentNotFoundError,
  ResourceNotFoundError,
  UserNotFoundError,
} from "@domain/errors/DriverProfileErrors";

export enum ErrorType {
  CLIENT_ERROR = "CLIENT_ERROR",
  SERVER_ERROR = "SERVER_ERROR",
  AUTHENTICATION_ERROR = "AUTHENTICATION_ERROR",
  VALIDATION_ERROR = "VALIDATION_ERROR",
  NETWORK_ERROR = "NETWORK_ERROR",
  DATABASE_ERROR = "DATABASE_ERROR",
  AUTHORIZATION_ERROR = "AUTHORIZATION_ERROR",
  NOT_FOUND_ERROR = "NOT_FOUND_ERROR",
  CONFLICT_ERROR = "CONFLICT_ERROR",
}

export interface ErrorDetails {
  statusCode: number;
  message: string;
  type: ErrorType;
  shouldLog: boolean;
  isOperational: boolean;
}

export class ErrorHandlerService {
  private static readonly ERROR_MAP = new Map<string, ErrorDetails>([
    // Authentication Errors
    [
      InvalidCredentialsError.name,
      {
        statusCode: 401,
        message: "Invalid credentials provided",
        type: ErrorType.AUTHENTICATION_ERROR,
        shouldLog: false,
        isOperational: true,
      },
    ],

    // Client Errors - Duplicates/Conflicts
    [
      UserAlreadyExistsError.name,
      {
        statusCode: 409,
        message: "An account with this email already exists",
        type: ErrorType.CONFLICT_ERROR,
        shouldLog: false,
        isOperational: true,
      },
    ],

    [
      MobileAlreadyExistsError.name,
      {
        statusCode: 409,
        message: "This mobile number is already registered",
        type: ErrorType.CONFLICT_ERROR,
        shouldLog: false,
        isOperational: true,
      },
    ],

    [
      AccountStatusError.name,
      {
        statusCode: 403,
        message: "Account access restricted",
        type: ErrorType.AUTHORIZATION_ERROR,
        shouldLog: false,
        isOperational: true,
      },
    ],

    [
      MaxOtpAttemptsError.name,
      {
        statusCode: 429,
        message: "Maximum OTP attempts exceeded. Please request a new OTP",
        type: ErrorType.CLIENT_ERROR,
        shouldLog: false,
        isOperational: true,
      },
    ],

    [
      OtpExpiredError.name,
      {
        statusCode: 400,
        message: "OTP has expired. Please request a new one",
        type: ErrorType.CLIENT_ERROR,
        shouldLog: false,
        isOperational: true,
      },
    ],

    // Driver Availability Errors
    [
      DriverAlreadyAvailableError.name,
      {
        statusCode: 409,
        message: "Driver already has an active availability record",
        type: ErrorType.CONFLICT_ERROR,
        shouldLog: false,
        isOperational: true,
      },
    ],

    [
      InvalidStatusTransitionError.name,
      {
        statusCode: 409,
        message: "Invalid status transition",
        type: ErrorType.CONFLICT_ERROR,
        shouldLog: false,
        isOperational: true,
      },
    ],

    [
      DriverAvailabilityNotFoundError.name,
      {
        statusCode: 404,
        message: "Driver availability not found",
        type: ErrorType.NOT_FOUND_ERROR,
        shouldLog: false,
        isOperational: true,
      },
    ],

    [
      DriverProfileNotFoundError.name,
      {
        statusCode: 404,
        message: "Driver profile not found",
        type: ErrorType.NOT_FOUND_ERROR,
        shouldLog: false,
        isOperational: true,
      },
    ],

    [
      ExpiredAvailabilityError.name,
      {
        statusCode: 400,
        message: "Availability period has expired",
        type: ErrorType.CLIENT_ERROR,
        shouldLog: false,
        isOperational: true,
      },
    ],

    // Profile-Related Errors
    [
      UserNotFoundError.name,
      {
        statusCode: 404,
        message: "User not found. Please check the user ID and try again",
        type: ErrorType.NOT_FOUND_ERROR,
        shouldLog: false,
        isOperational: true,
      },
    ],

    [
      DriverProfileNotFoundError.name,
      {
        statusCode: 404,
        message:
          "Driver profile not found. Please complete driver registration first",
        type: ErrorType.NOT_FOUND_ERROR,
        shouldLog: false,
        isOperational: true,
      },
    ],

    [
      KycDocumentNotFoundError.name,
      {
        statusCode: 404,
        message: "KYC document not found. Please upload the required documents",
        type: ErrorType.NOT_FOUND_ERROR,
        shouldLog: false,
        isOperational: true,
      },
    ],

    [
      ResourceNotFoundError.name,
      {
        statusCode: 404,
        message: "Requested resource not found",
        type: ErrorType.NOT_FOUND_ERROR,
        shouldLog: false,
        isOperational: true,
      },
    ],

    [
      DriverAccessDeniedError.name,
      {
        statusCode: 403,
        message: "Access denied. Your driver account is not active",
        type: ErrorType.AUTHORIZATION_ERROR,
        shouldLog: false,
        isOperational: true,
      },
    ],

    // Token Errors
    [
      RefreshTokenExpiredError.name,
      {
        statusCode: 401,
        message: "Session expired. Please log in again",
        type: ErrorType.AUTHENTICATION_ERROR,
        shouldLog: false,
        isOperational: true,
      },
    ],

    [
      RefreshTokenRevokedError.name,
      {
        statusCode: 401,
        message: "Session expired. Please log in again",
        type: ErrorType.AUTHENTICATION_ERROR,
        shouldLog: false,
        isOperational: true,
      },
    ],
  ]);

  private static readonly GENERIC_MESSAGES = {
    [ErrorType.SERVER_ERROR]:
      "Something went wrong on our end. Please try again later",
    [ErrorType.DATABASE_ERROR]:
      "Service temporarily unavailable. Please try again later",
    [ErrorType.NETWORK_ERROR]: "Connection issue occurred. Please try again",
    [ErrorType.VALIDATION_ERROR]: "Invalid input provided",
    [ErrorType.CLIENT_ERROR]: "Bad request",
    [ErrorType.AUTHENTICATION_ERROR]: "Authentication failed",
    [ErrorType.AUTHORIZATION_ERROR]: "Access forbidden",
    [ErrorType.NOT_FOUND_ERROR]: "Resource not found",
    [ErrorType.CONFLICT_ERROR]: "Request conflicts with current state",
  };

  // Main error handling method - converts any error to standardized API response
  static handleError(
    error: any,
    context?: string
  ): { response: ApiResponse; statusCode: number } {
    const errorDetails = this.classifyError(error);

    if (errorDetails.shouldLog) {
      this.logError(error, context, errorDetails);
    }

    // Create standardized response
    const response: ApiResponse = {
      success: false,
      message: errorDetails.message,
      ...(process.env.NODE_ENV === "development" && {
        error: error.message, // Include technical details only in development
      }),
    };

    return { response, statusCode: errorDetails.statusCode };
  }

  // Handle validation errors from express-validator
  static handleValidationErrors(errors: any[]): {
    response: ApiResponse;
    statusCode: number;
  } {
    const message = errors.map((err) => err.msg).join(", ");

    const response: ApiResponse = {
      success: false,
      message: message || "Validation failed",
    };

    return { response, statusCode: 400 };
  }

  // Classify error type and determine appropriate response
  private static classifyError(error: any): ErrorDetails {
    // Check if it's a known domain error
    if (this.ERROR_MAP.has(error.constructor.name)) {
      return this.ERROR_MAP.get(error.constructor.name)!;
    }

    // Handle MongoDB duplicate key errors
    if (this.isMongoDbDuplicateKeyError(error)) {
      return this.handleDuplicateKeyError(error);
    }

    // Check for database/connection errors
    if (this.isDatabaseError(error)) {
      return {
        statusCode: 503,
        message: this.GENERIC_MESSAGES[ErrorType.DATABASE_ERROR],
        type: ErrorType.DATABASE_ERROR,
        shouldLog: true,
        isOperational: false,
      };
    }

    // Check for network/SSL errors
    if (this.isNetworkError(error)) {
      return {
        statusCode: 503,
        message: this.GENERIC_MESSAGES[ErrorType.NETWORK_ERROR],
        type: ErrorType.NETWORK_ERROR,
        shouldLog: true,
        isOperational: false,
      };
    }

    // Check for validation errors (non-express-validator)
    if (this.isValidationError(error)) {
      return {
        statusCode: 400,
        message:
          error.message || this.GENERIC_MESSAGES[ErrorType.VALIDATION_ERROR],
        type: ErrorType.VALIDATION_ERROR,
        shouldLog: false,
        isOperational: true,
      };
    }

    // Default to server error for unknown errors
    return {
      statusCode: 500,
      message: this.GENERIC_MESSAGES[ErrorType.SERVER_ERROR],
      type: ErrorType.SERVER_ERROR,
      shouldLog: true,
      isOperational: false,
    };
  }

  // Check if error is database-related
  private static isDatabaseError(error: any): boolean {
    const message = error.message?.toLowerCase() || "";
    const code = String(error.code ?? "").toLowerCase();

    const databasePatterns = [
      "database",
      "connection",
      "mongodb",
      "sql",
      "redis",
      "timeout",
      "econnrefused",
      "enotfound",
      "etimedout",
    ];

    return databasePatterns.some(
      (pattern) => message.includes(pattern) || code.includes(pattern)
    );
  }

  // Detect MongoDB duplicate key errors
  private static isMongoDbDuplicateKeyError(error: any): boolean {
    return (
      error.code === 11000 ||
      error.message?.includes("E11000 duplicate key error") ||
      error.message?.includes("duplicate key error collection")
    );
  }

  // Handle duplicate key errors gracefully
  private static handleDuplicateKeyError(error: any): ErrorDetails {
    const message = error.message?.toLowerCase() || "";

    // Check which field is duplicated
    if (message.includes("mobile")) {
      return {
        statusCode: 409,
        message: "This mobile number is already registered",
        type: ErrorType.CONFLICT_ERROR,
        shouldLog: false,
        isOperational: true,
      };
    } else if (message.includes("email")) {
      return {
        statusCode: 409,
        message: "An account with this email already exists",
        type: ErrorType.CONFLICT_ERROR,
        shouldLog: false,
        isOperational: true,
      };
    } else {
      return {
        statusCode: 409,
        message: "This information is already registered",
        type: ErrorType.CONFLICT_ERROR,
        shouldLog: true,
        isOperational: true,
      };
    }
  }

  // Check if error is network/SSL related
  private static isNetworkError(error: any): boolean {
    const message = error.message?.toLowerCase() || "";

    const networkPatterns = [
      "ssl",
      "tls",
      "cert",
      "network",
      "socket",
      "ssl routines",
      "ssl3_read_bytes",
      "tlsv1 alert",
      "openssl",
      "c:\\ws\\deps",
    ];

    return networkPatterns.some((pattern) => message.includes(pattern));
  }

  // Check if error is validation-related
  private static isValidationError(error: any): boolean {
    const message = error.message?.toLowerCase() || "";
    return (
      message.includes("validation") ||
      (message.includes("invalid") && !this.isNetworkError(error))
    );
  }

  // Log error with appropriate level
  private static logError(
    error: any,
    context?: string,
    details?: ErrorDetails
  ): void {
    const logData = {
      error: error.message,
      stack: error.stack,
      type: details?.type,
      context,
      timestamp: new Date().toISOString(),
    };

    if (
      details?.type === ErrorType.SERVER_ERROR ||
      details?.type === ErrorType.DATABASE_ERROR
    ) {
      Logger.error("Server Error", logData);
    } else {
      Logger.warn("Operational Error", logData);
    }
  }

  // Check if error is operational (expected) vs programming error
  static isOperationalError(error: any): boolean {
    if (error instanceof DomainError) return true;

    const errorDetails = this.classifyError(error);
    return errorDetails.isOperational;
  }
}
