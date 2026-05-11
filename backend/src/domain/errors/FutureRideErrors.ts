import { DomainError } from "./DomainError";
import { ErrorType } from "@shared/enums/ErrorType";
import { HttpStatusCodes } from "@shared/enums/HttpStatusCodes";
import { formatMessage } from "@shared/utils/errorMessageFormatter";
import { FUTURE_RIDE_ERROR_MESSAGES } from "@shared/constants/FutureRideMessages";

export class FutureRideErrors {
  static noDriversFound(): DomainError {
    return new DomainError(
      FUTURE_RIDE_ERROR_MESSAGES.NO_DRIVERS_FOUND,
      "FUTURE_RIDE_NO_DRIVERS_FOUND",
      {
        statusCode: HttpStatusCodes.NOT_FOUND,
        errorType: ErrorType.NOT_FOUND_ERROR,
        shouldLog: false,
        isOperational: true,
        category: "NOT_FOUND",
      },
    );
  }

  static requestGroupNotFound(requestGroupId: string): DomainError {
    return new DomainError(
      formatMessage(FUTURE_RIDE_ERROR_MESSAGES.REQUEST_GROUP_NOT_FOUND, {
        requestGroupId,
      }),
      "FUTURE_RIDE_GROUP_NOT_FOUND",
      {
        statusCode: HttpStatusCodes.NOT_FOUND,
        errorType: ErrorType.NOT_FOUND_ERROR,
        shouldLog: false,
        isOperational: true,
        category: "NOT_FOUND",
      },
    );
  }

  static unauthorizedCancellation(requestGroupId: string): DomainError {
    return new DomainError(
      formatMessage(FUTURE_RIDE_ERROR_MESSAGES.UNAUTHORIZED_CANCELLATION, {
        requestGroupId,
      }),
      "FUTURE_RIDE_UNAUTHORIZED_CANCELLATION",
      {
        statusCode: HttpStatusCodes.FORBIDDEN,
        errorType: ErrorType.AUTHORIZATION_ERROR,
        shouldLog: false,
        isOperational: true,
        category: "AUTH",
      },
    );
  }

  static cannotCancelRequest(
    requestGroupId: string,
    status: string,
  ): DomainError {
    return new DomainError(
      formatMessage(FUTURE_RIDE_ERROR_MESSAGES.CANNOT_CANCEL, {
        requestGroupId,
        status,
      }),
      "FUTURE_RIDE_CANNOT_CANCEL",
      {
        statusCode: HttpStatusCodes.CONFLICT,
        errorType: ErrorType.CONFLICT_ERROR,
        shouldLog: false,
        isOperational: true,
        category: "CONFLICT",
      },
    );
  }

  static pickupTimeTooSoon(): DomainError {
    return new DomainError(
      FUTURE_RIDE_ERROR_MESSAGES.PICKUP_TIME_TOO_SOON,
      "FUTURE_RIDE_PICKUP_TIME_TOO_SOON",
      {
        statusCode: HttpStatusCodes.BAD_REQUEST,
        errorType: ErrorType.VALIDATION_ERROR,
        shouldLog: false,
        isOperational: true,
        category: "VALIDATION",
      },
    );
  }

  static scheduleFailed(reason: string): DomainError {
    return new DomainError(
      `${FUTURE_RIDE_ERROR_MESSAGES.SCHEDULE_FAILED} ${reason}`,
      "FUTURE_RIDE_SCHEDULE_FAILED",
      {
        statusCode: HttpStatusCodes.INTERNAL_SERVER_ERROR,
        errorType: ErrorType.SERVER_ERROR,
        shouldLog: true,
        isOperational: false,
        category: "SERVER",
      },
    );
  }
}
