import { DRIVER_AVAILABILITY_ERROR_MESSAGES } from "@shared/constants/DriverMessages";
import { DomainError } from "./DomainError";
import { ErrorType } from "@shared/enums/ErrorType";
import { HttpStatusCodes } from "@shared/enums/HttpStatusCodes";
import { formatMessage } from "@shared/utils/errorMessageFormatter";

export class DriverAvailabilityNotFoundError extends DomainError {
  constructor(driverId?: string) {
    const driverPart = driverId ? ` for driver ID: ${driverId}` : "";

    super(
      formatMessage(
        DRIVER_AVAILABILITY_ERROR_MESSAGES.DRIVER_AVAILABILITY_NOT_FOUND,
        { driverPart },
      ),
      "DRIVER_AVAILABILITY_NOT_FOUND",
      {
        statusCode: HttpStatusCodes.NOT_FOUND,
        errorType: ErrorType.NOT_FOUND_ERROR,
        shouldLog: false,
        isOperational: true,
        category: "NOT_FOUND",
      },
    );

    this.name = "DriverAvailabilityNotFoundError";
  }
}

export class InvalidAvailabilityScheduleError extends DomainError {
  constructor(reason: string) {
    super(
      formatMessage(
        DRIVER_AVAILABILITY_ERROR_MESSAGES.INVALID_AVAILABILITY_SCHEDULE,
        { reason },
      ),
      "INVALID_AVAILABILITY_SCHEDULE",
      {
        statusCode: HttpStatusCodes.BAD_REQUEST,
        errorType: ErrorType.VALIDATION_ERROR,
        shouldLog: false,
        isOperational: true,
        category: "VALIDATION",
      },
    );

    this.name = "InvalidAvailabilityScheduleError";
  }
}

export class DriverAlreadyAvailableError extends DomainError {
  constructor(driverId: string) {
    super(
      formatMessage(
        DRIVER_AVAILABILITY_ERROR_MESSAGES.DRIVER_ALREADY_AVAILABLE,
        { driverId },
      ),
      "DRIVER_ALREADY_AVAILABLE",
      {
        statusCode: HttpStatusCodes.CONFLICT,
        errorType: ErrorType.CONFLICT_ERROR,
        shouldLog: false,
        isOperational: true,
        category: "CONFLICT",
      },
    );

    this.name = "DriverAlreadyAvailableError";
  }
}

export class InvalidStatusTransitionError extends DomainError {
  constructor(currentStatus: string, newStatus: string) {
    super(
      formatMessage(
        DRIVER_AVAILABILITY_ERROR_MESSAGES.INVALID_STATUS_TRANSITION,
        { currentStatus, newStatus },
      ),
      "INVALID_STATUS_TRANSITION",
      {
        statusCode: HttpStatusCodes.BAD_REQUEST,
        errorType: ErrorType.VALIDATION_ERROR,
        shouldLog: false,
        isOperational: true,
        category: "VALIDATION",
      },
    );

    this.name = "InvalidStatusTransitionError";
  }
}

export class ExpiredAvailabilityError extends DomainError {
  constructor() {
    super(
      DRIVER_AVAILABILITY_ERROR_MESSAGES.EXPIRED_AVAILABILITY,
      "EXPIRED_AVAILABILITY",
      {
        statusCode: HttpStatusCodes.GONE,
        errorType: ErrorType.VALIDATION_ERROR,
        shouldLog: false,
        isOperational: true,
        category: "VALIDATION",
      },
    );

    this.name = "ExpiredAvailabilityError";
  }
}

export class DriverProfileNotFoundError extends DomainError {
  constructor(userId: string) {
    super(
      formatMessage(
        DRIVER_AVAILABILITY_ERROR_MESSAGES.DRIVER_PROFILE_NOT_FOUND,
        { userId },
      ),
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

export class AvailabilityExceptionNotFoundError extends DomainError {
  constructor(exceptionId: string) {
    super(
      formatMessage(
        DRIVER_AVAILABILITY_ERROR_MESSAGES.AVAILABILITY_EXCEPTION_NOT_FOUND,
        { exceptionId },
      ),
      "AVAILABILITY_EXCEPTION_NOT_FOUND",
      {
        statusCode: HttpStatusCodes.NOT_FOUND,
        errorType: ErrorType.NOT_FOUND_ERROR,
        shouldLog: false,
        isOperational: true,
        category: "NOT_FOUND",
      },
    );

    this.name = "AvailabilityExceptionNotFoundError";
  }
}
