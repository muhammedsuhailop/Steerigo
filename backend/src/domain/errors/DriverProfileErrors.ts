import { DRIVER_ERROR_MESSAGES } from "@shared/constants/DriverMessages";
import { DomainError } from "./DomainError";
import { ErrorType } from "@shared/enums/ErrorType";
import { HttpStatusCodes } from "@shared/enums/HttpStatusCodes";

export class UserNotFoundError extends DomainError {
  constructor(userId: string) {
    super(
      `${DRIVER_ERROR_MESSAGES.USER_NOT_FOUND} with ID: ${userId}`,
      "USER_NOT_FOUND",
      {
        statusCode: HttpStatusCodes.NOT_FOUND,
        errorType: ErrorType.NOT_FOUND_ERROR,
        shouldLog: false,
        isOperational: true,
        category: "NOT_FOUND",
      },
    );

    this.name = "UserNotFoundError";
  }
}

export class DriverProfileNotFoundError extends DomainError {
  constructor(userId: string) {
    super(
      `${DRIVER_ERROR_MESSAGES.DRIVER_PROFILE_NOT_FOUND} for user ID: ${userId}`,
      "DRIVER_PROFILE_NOT_FOUND",
      {
        statusCode: HttpStatusCodes.NOT_FOUND,
        errorType: ErrorType.NOT_FOUND_ERROR,
        shouldLog: false,
        isOperational: true,
        category: "NOT_FOUND",
      },
    );

    this.name = "DriverProfileNotFoundError";
  }
}

export class KycDocumentNotFoundError extends DomainError {
  constructor(driverId: string, docType?: string) {
    const base = DRIVER_ERROR_MESSAGES.KYC_DOCUMENT_NOT_FOUND;

    const message = docType
      ? `${base} of type '${docType}' for driver ID: ${driverId}`
      : `${base}s for driver ID: ${driverId}`;

    super(message, "KYC_DOCUMENT_NOT_FOUND", {
      statusCode: HttpStatusCodes.NOT_FOUND,
      errorType: ErrorType.NOT_FOUND_ERROR,
      shouldLog: false,
      isOperational: true,
      category: "NOT_FOUND",
    });

    this.name = "KycDocumentNotFoundError";
  }
}

export class ResourceNotFoundError extends DomainError {
  constructor(resource: string, identifier: string) {
    super(
      `${DRIVER_ERROR_MESSAGES.RESOURCE_NOT_FOUND}: ${resource} ${identifier}`,
      "RESOURCE_NOT_FOUND",
      {
        statusCode: HttpStatusCodes.NOT_FOUND,
        errorType: ErrorType.NOT_FOUND_ERROR,
        shouldLog: false,
        isOperational: true,
        category: "NOT_FOUND",
      },
    );

    this.name = "ResourceNotFoundError";
  }
}

export class DriverAccessDeniedError extends DomainError {
  constructor(userId: string, reason: string) {
    super(
      `${DRIVER_ERROR_MESSAGES.DRIVER_ACCESS_DENIED} ${userId}: ${reason}`,
      "DRIVER_ACCESS_DENIED",
      {
        statusCode: HttpStatusCodes.FORBIDDEN,
        errorType: ErrorType.AUTHORIZATION_ERROR,
        shouldLog: true,
        isOperational: true,
        category: "AUTH",
      },
    );

    this.name = "DriverAccessDeniedError";
  }
}
