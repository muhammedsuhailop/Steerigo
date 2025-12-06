import { DomainError } from "@domain/errors";
import { ApiResponse } from "@shared/types/Common";
import { Logger } from "./Logger";

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
    // ===== VALIDATION ERRORS (400) =====
    [
      "ValidationError",
      {
        statusCode: 400,
        message: "Validation failed",
        type: ErrorType.VALIDATION_ERROR,
        shouldLog: false,
        isOperational: true,
      },
    ],
    [
      "InvalidLatitudeError",
      {
        statusCode: 400,
        message: "Latitude must be a number between -90 and 90",
        type: ErrorType.VALIDATION_ERROR,
        shouldLog: false,
        isOperational: true,
      },
    ],
    [
      "InvalidLongitudeError",
      {
        statusCode: 400,
        message: "Longitude must be a number between -180 and 180",
        type: ErrorType.VALIDATION_ERROR,
        shouldLog: false,
        isOperational: true,
      },
    ],
    [
      "InvalidSearchDateFormatError",
      {
        statusCode: 400,
        message: "Search date must be a valid date",
        type: ErrorType.VALIDATION_ERROR,
        shouldLog: false,
        isOperational: true,
      },
    ],
    [
      "InvalidSearchDateRangeError",
      {
        statusCode: 400,
        message: "Search date must be in the future or current",
        type: ErrorType.VALIDATION_ERROR,
        shouldLog: false,
        isOperational: true,
      },
    ],
    [
      "InvalidTimeRequiredError",
      {
        statusCode: 400,
        message: "Time required must be between 1 and 240 minutes",
        type: ErrorType.VALIDATION_ERROR,
        shouldLog: false,
        isOperational: true,
      },
    ],
    [
      "InvalidRadiusError",
      {
        statusCode: 400,
        message: "Radius must be between 0 and 50 km",
        type: ErrorType.VALIDATION_ERROR,
        shouldLog: false,
        isOperational: true,
      },
    ],
    [
      "InvalidLimitError",
      {
        statusCode: 400,
        message: "Limit must be between 1 and 100",
        type: ErrorType.VALIDATION_ERROR,
        shouldLog: false,
        isOperational: true,
      },
    ],
    [
      "InvalidGearTypeError",
      {
        statusCode: 400,
        message: "Invalid gear type provided",
        type: ErrorType.VALIDATION_ERROR,
        shouldLog: false,
        isOperational: true,
      },
    ],
    [
      "InvalidBodyTypeError",
      {
        statusCode: 400,
        message: "Invalid body type provided",
        type: ErrorType.VALIDATION_ERROR,
        shouldLog: false,
        isOperational: true,
      },
    ],

    // ===== RIDE REQUEST VALIDATION ERRORS (400) =====
    [
      "INVALID_FARE",
      {
        statusCode: 400,
        message: "Invalid fare amount. Fare must be positive",
        type: ErrorType.VALIDATION_ERROR,
        shouldLog: false,
        isOperational: true,
      },
    ],
    [
      "INVALID_PICKUP_TIME",
      {
        statusCode: 400,
        message: "Invalid pickup time. Pickup time must be in the future",
        type: ErrorType.VALIDATION_ERROR,
        shouldLog: false,
        isOperational: true,
      },
    ],
    [
      "INVALID_LOCATION",
      {
        statusCode: 400,
        message: "Invalid location coordinates",
        type: ErrorType.VALIDATION_ERROR,
        shouldLog: false,
        isOperational: true,
      },
    ],
    [
      "INVALID_RIDE_TYPE",
      {
        statusCode: 400,
        message: 'Invalid ride type. Must be "One Way" or "Round Trip"',
        type: ErrorType.VALIDATION_ERROR,
        shouldLog: false,
        isOperational: true,
      },
    ],

    // ===== RIDE REQUEST NOT FOUND ERRORS (404) =====
    [
      "DRIVER_NOT_FOUND",
      {
        statusCode: 404,
        message: "Driver not found or no longer available",
        type: ErrorType.NOT_FOUND_ERROR,
        shouldLog: false,
        isOperational: true,
      },
    ],
    [
      "USER_NOT_FOUND",
      {
        statusCode: 404,
        message: "User not found. Please check the user ID and try again",
        type: ErrorType.NOT_FOUND_ERROR,
        shouldLog: false,
        isOperational: true,
      },
    ],

    // ===== RIDE REQUEST CONFLICT ERRORS (409) =====
    [
      "DRIVER_NOT_AVAILABLE",
      {
        statusCode: 409,
        message: "Driver is currently not available for ride requests",
        type: ErrorType.CONFLICT_ERROR,
        shouldLog: false,
        isOperational: true,
      },
    ],
    [
      "DUPLICATE_RIDE_REQUEST",
      {
        statusCode: 409,
        message: "You already have a pending request to this driver",
        type: ErrorType.CONFLICT_ERROR,
        shouldLog: false,
        isOperational: true,
      },
    ],

    // ===== RIDE REQUEST CREATION ERRORS (500) =====
    [
      "RIDE_REQUEST_CREATION_FAILED",
      {
        statusCode: 500,
        message: "Failed to create ride request. Please try again",
        type: ErrorType.SERVER_ERROR,
        shouldLog: true,
        isOperational: false,
      },
    ],

    // ===== KYC VALIDATION ERRORS (400) =====
    [
      "KYCNotFoundError",
      {
        statusCode: 400,
        message: "No KYC documents found for this driver",
        type: ErrorType.VALIDATION_ERROR,
        shouldLog: false,
        isOperational: true,
      },
    ],
    [
      "ProfilePictureNotUploadedError",
      {
        statusCode: 400,
        message: "Driver must upload a profile picture before KYC approval",
        type: ErrorType.VALIDATION_ERROR,
        shouldLog: false,
        isOperational: true,
      },
    ],
    [
      "LicenseNotApprovedError",
      {
        statusCode: 400,
        message:
          "Latest license must be approved before updating driver KYC status",
        type: ErrorType.VALIDATION_ERROR,
        shouldLog: false,
        isOperational: true,
      },
    ],
    [
      "NonLicenseKYCNotApprovedError",
      {
        statusCode: 400,
        message:
          "At least one non-license KYC document (Aadhaar, PAN, or Passport) must be approved",
        type: ErrorType.VALIDATION_ERROR,
        shouldLog: false,
        isOperational: true,
      },
    ],
    [
      "InvalidKYCStatusTransitionError",
      {
        statusCode: 400,
        message: "Invalid KYC status transition",
        type: ErrorType.VALIDATION_ERROR,
        shouldLog: false,
        isOperational: true,
      },
    ],

    // ===== SEARCH ERRORS (400/404) =====
    [
      "NoDriversAvailableError",
      {
        statusCode: 404,
        message: "No drivers available in the specified area",
        type: ErrorType.NOT_FOUND_ERROR,
        shouldLog: false,
        isOperational: true,
      },
    ],
    [
      "InvalidLocationError",
      {
        statusCode: 400,
        message: "Invalid location coordinates provided",
        type: ErrorType.VALIDATION_ERROR,
        shouldLog: false,
        isOperational: true,
      },
    ],
    [
      "InvalidSearchDateError",
      {
        statusCode: 400,
        message: "Invalid search date provided",
        type: ErrorType.VALIDATION_ERROR,
        shouldLog: false,
        isOperational: true,
      },
    ],
    [
      "DriverFilterNotMatchError",
      {
        statusCode: 404,
        message: "No drivers match your vehicle type preferences",
        type: ErrorType.NOT_FOUND_ERROR,
        shouldLog: false,
        isOperational: true,
      },
    ],
    [
      "LocationServiceError",
      {
        statusCode: 503,
        message: "Location service temporarily unavailable",
        type: ErrorType.NETWORK_ERROR,
        shouldLog: true,
        isOperational: false,
      },
    ],

    // ===== AUTHENTICATION ERRORS (401) =====
    [
      "InvalidCredentialsError",
      {
        statusCode: 401,
        message: "Invalid credentials provided",
        type: ErrorType.AUTHENTICATION_ERROR,
        shouldLog: false,
        isOperational: true,
      },
    ],
    [
      "RefreshTokenExpiredError",
      {
        statusCode: 401,
        message: "Session expired. Please log in again",
        type: ErrorType.AUTHENTICATION_ERROR,
        shouldLog: false,
        isOperational: true,
      },
    ],
    [
      "RefreshTokenRevokedError",
      {
        statusCode: 401,
        message: "Session expired. Please log in again",
        type: ErrorType.AUTHENTICATION_ERROR,
        shouldLog: false,
        isOperational: true,
      },
    ],

    // ===== CONFLICT ERRORS (409) =====
    [
      "UserAlreadyExistsError",
      {
        statusCode: 409,
        message: "An account with this email already exists",
        type: ErrorType.CONFLICT_ERROR,
        shouldLog: false,
        isOperational: true,
      },
    ],
    [
      "MobileAlreadyExistsError",
      {
        statusCode: 409,
        message: "This mobile number is already registered",
        type: ErrorType.CONFLICT_ERROR,
        shouldLog: false,
        isOperational: true,
      },
    ],
    [
      "DriverAlreadyAvailableError",
      {
        statusCode: 409,
        message: "Driver already has an active availability record",
        type: ErrorType.CONFLICT_ERROR,
        shouldLog: false,
        isOperational: true,
      },
    ],
    [
      "InvalidStatusTransitionError",
      {
        statusCode: 409,
        message: "Invalid status transition",
        type: ErrorType.CONFLICT_ERROR,
        shouldLog: false,
        isOperational: true,
      },
    ],

    // ===== NOT FOUND ERRORS (404) =====
    [
      "UserNotFoundError",
      {
        statusCode: 404,
        message: "User not found. Please check the user ID and try again",
        type: ErrorType.NOT_FOUND_ERROR,
        shouldLog: false,
        isOperational: true,
      },
    ],
    [
      "DriverNotFoundError",
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
      "DriverProfileNotFoundError",
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
      "DriverAvailabilityNotFoundError",
      {
        statusCode: 404,
        message: "Driver availability not found",
        type: ErrorType.NOT_FOUND_ERROR,
        shouldLog: false,
        isOperational: true,
      },
    ],
    [
      "KycDocumentNotFoundError",
      {
        statusCode: 404,
        message: "KYC document not found. Please upload the required documents",
        type: ErrorType.NOT_FOUND_ERROR,
        shouldLog: false,
        isOperational: true,
      },
    ],
    [
      "ResourceNotFoundError",
      {
        statusCode: 404,
        message: "Requested resource not found",
        type: ErrorType.NOT_FOUND_ERROR,
        shouldLog: false,
        isOperational: true,
      },
    ],

    // ===== AUTHORIZATION ERRORS (403) =====
    [
      "AccountStatusError",
      {
        statusCode: 403,
        message: "Account access restricted",
        type: ErrorType.AUTHORIZATION_ERROR,
        shouldLog: false,
        isOperational: true,
      },
    ],
    [
      "DriverAccessDeniedError",
      {
        statusCode: 403,
        message: "Access denied. Your driver account is not active",
        type: ErrorType.AUTHORIZATION_ERROR,
        shouldLog: false,
        isOperational: true,
      },
    ],

    // ===== RATE LIMITING (429) =====
    [
      "MaxOtpAttemptsError",
      {
        statusCode: 429,
        message: "Maximum OTP attempts exceeded. Please request a new OTP",
        type: ErrorType.CLIENT_ERROR,
        shouldLog: false,
        isOperational: true,
      },
    ],
    [
      "OtpExpiredError",
      {
        statusCode: 400,
        message: "OTP has expired. Please request a new one",
        type: ErrorType.CLIENT_ERROR,
        shouldLog: false,
        isOperational: true,
      },
    ],
    [
      "ExpiredAvailabilityError",
      {
        statusCode: 400,
        message: "Availability period has expired",
        type: ErrorType.CLIENT_ERROR,
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

  // Typed helpers

  private static hasProp<T extends string>(
    obj: unknown,
    prop: T
  ): obj is Record<T, unknown> {
    return typeof obj === "object" && obj !== null && prop in (obj as object);
  }

  private static getStringProp(obj: unknown, prop: string): string | undefined {
    if (!this.hasProp(obj, prop)) return undefined;
    const v = (obj as Record<string, unknown>)[prop];
    return typeof v === "string" ? v : undefined;
  }

  private static getNumberProp(obj: unknown, prop: string): number | undefined {
    if (!this.hasProp(obj, prop)) return undefined;
    const v = (obj as Record<string, unknown>)[prop];
    return typeof v === "number" ? v : undefined;
  }

  private static getStringArray(
    obj: unknown,
    prop: string
  ): string[] | undefined {
    if (!this.hasProp(obj, prop)) return undefined;
    const v = (obj as Record<string, unknown>)[prop];
    if (Array.isArray(v)) {
      return v.filter((i): i is string => typeof i === "string");
    }
    return undefined;
  }

  // Main error handling method - converts any error to standardized API response
  // Preserves original error message from domain errors
  static handleError(
    error: unknown,
    context?: string
  ): { response: ApiResponse; statusCode: number } {
    const errorDetails = this.classifyError(error);

    if (errorDetails.shouldLog) {
      this.logError(error, context, errorDetails);
    }

    // Use original error message from domain errors
    const message =
      error instanceof DomainError && this.getStringProp(error, "message")
        ? this.getStringProp(error, "message")!
        : errorDetails.message;

    // Create standardized response
    const response: ApiResponse = {
      success: false,
      message,
      ...(process.env.NODE_ENV === "development" && {
        // safe property accessors, stay guarded
        error: this.getStringProp(error, "message"),
        errorCode: this.getStringProp(error, "code"),
        field: this.getStringProp(error, "field"),
      }),
    };

    return { response, statusCode: errorDetails.statusCode };
  }

  // Handle validation errors from express-validator
  static handleValidationErrors(errors: Array<{ msg: string }>): {
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
  private static classifyError(error: unknown): ErrorDetails {
    // Check for DomainError with code property (for RideRequestErrors)
    if (error instanceof DomainError && this.hasProp(error, "code")) {
      const code = this.getStringProp(error, "code");
      if (code) {
        const errorByCode = this.ERROR_MAP.get(code);
        if (errorByCode) {
          return errorByCode;
        }
      }
    }

    // Check if it's a known domain error by exact name match
    if (typeof error === "object" && error !== null) {
      const ctorName = (error as { constructor?: { name?: string } })
        .constructor?.name;
      if (ctorName && this.ERROR_MAP.has(ctorName)) {
        return this.ERROR_MAP.get(ctorName)!;
      }
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
          this.getStringProp(error, "message") ||
          this.GENERIC_MESSAGES[ErrorType.VALIDATION_ERROR],
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

  private static isDatabaseError(error: unknown): boolean {
    const message = this.getStringProp(error, "message")?.toLowerCase() || "";
    const code = String(this.getStringProp(error, "code") ?? "").toLowerCase();

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

  private static isMongoDbDuplicateKeyError(error: unknown): boolean {
    const code = this.getNumberProp(error, "code");
    const message = this.getStringProp(error, "message") ?? "";
    return (
      code === 11000 ||
      message.includes("E11000 duplicate key error") ||
      message.includes("duplicate key error collection")
    );
  }

  private static handleDuplicateKeyError(error: unknown): ErrorDetails {
    const message = this.getStringProp(error, "message")?.toLowerCase() || "";

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

  private static isNetworkError(error: unknown): boolean {
    const message = this.getStringProp(error, "message")?.toLowerCase() || "";

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

  private static isValidationError(error: unknown): boolean {
    const message = this.getStringProp(error, "message")?.toLowerCase() || "";
    return (
      message.includes("validation") ||
      (message.includes("invalid") && !this.isNetworkError(error))
    );
  }

  private static logError(
    error: unknown,
    context?: string,
    details?: ErrorDetails
  ): void {
    const logData: Record<string, unknown> = {
      error: this.getStringProp(error, "message"),
      errorCode: this.getStringProp(error, "code"),
      stack:
        typeof error === "object" && error !== null && "stack" in error
          ? (error as { stack?: unknown }).stack
          : undefined,
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

  static isOperationalError(error: unknown): boolean {
    if (error instanceof DomainError) return true;

    const errorDetails = this.classifyError(error);
    return errorDetails.isOperational;
  }
}
