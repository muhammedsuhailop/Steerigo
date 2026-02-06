import { SEARCH_DRIVER_ERROR_MESSAGES } from "@shared/constants/DriverMessages";
import { DomainError } from "./DomainError";
import { ErrorType } from "@shared/enums/ErrorType";
import { HttpStatusCodes } from "@shared/enums/HttpStatusCodes";

export class NoDriversAvailableError extends DomainError {
  constructor(
    message: string = SEARCH_DRIVER_ERROR_MESSAGES.NO_DRIVERS_AVAILABLE,
  ) {
    super(message, "NO_DRIVERS_AVAILABLE", {
      statusCode: HttpStatusCodes.NOT_FOUND,
      errorType: ErrorType.NOT_FOUND_ERROR,
      shouldLog: false,
      isOperational: true,
      category: "NOT_FOUND",
    });

    this.name = "NoDriversAvailableError";
  }
}

export class InvalidLocationError extends DomainError {
  constructor(message: string = SEARCH_DRIVER_ERROR_MESSAGES.INVALID_LOCATION) {
    super(message, "INVALID_LOCATION", {
      statusCode: HttpStatusCodes.BAD_REQUEST,
      errorType: ErrorType.VALIDATION_ERROR,
      shouldLog: false,
      isOperational: true,
      category: "VALIDATION",
    });

    this.name = "InvalidLocationError";
  }
}

export class InvalidSearchDateError extends DomainError {
  constructor(
    message: string = SEARCH_DRIVER_ERROR_MESSAGES.INVALID_SEARCH_DATE,
  ) {
    super(message, "INVALID_SEARCH_DATE", {
      statusCode: HttpStatusCodes.BAD_REQUEST,
      errorType: ErrorType.VALIDATION_ERROR,
      shouldLog: false,
      isOperational: true,
      category: "VALIDATION",
    });

    this.name = "InvalidSearchDateError";
  }
}

export class DriverFilterNotMatchError extends DomainError {
  constructor(
    message: string = SEARCH_DRIVER_ERROR_MESSAGES.DRIVER_FILTER_NOT_MATCH,
  ) {
    super(message, "DRIVER_FILTER_NOT_MATCH", {
      statusCode: HttpStatusCodes.NOT_FOUND,
      errorType: ErrorType.NOT_FOUND_ERROR,
      shouldLog: false,
      isOperational: true,
      category: "NOT_FOUND",
    });

    this.name = "DriverFilterNotMatchError";
  }
}

export class LocationServiceError extends DomainError {
  constructor(
    message: string = SEARCH_DRIVER_ERROR_MESSAGES.LOCATION_SERVICE_ERROR,
  ) {
    super(message, "LOCATION_SERVICE_ERROR", {
      statusCode: HttpStatusCodes.SERVICE_UNAVAILABLE,
      errorType: ErrorType.SERVER_ERROR,
      shouldLog: true,
      isOperational: false,
      category: "SERVER",
    });

    this.name = "LocationServiceError";
  }
}
