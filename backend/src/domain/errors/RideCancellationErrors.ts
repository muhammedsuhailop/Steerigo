import { RIDE_CANCELLATION_ERROR_MESSAGES } from "@shared/constants/RideMessages";
import { DomainError } from "./DomainError";
import { ErrorType } from "@shared/enums/ErrorType";
import { HttpStatusCodes } from "@shared/enums/HttpStatusCodes";
import { formatMessage } from "@shared/utils/errorMessageFormatter";

export class RideCancellationErrors {
  static rideNotFound(rideId: string): DomainError {
    return new DomainError(
      formatMessage(RIDE_CANCELLATION_ERROR_MESSAGES.RIDE_NOT_FOUND, {
        rideId,
      }),
      "RIDE_NOT_FOUND",
      {
        statusCode: HttpStatusCodes.NOT_FOUND,
        errorType: ErrorType.NOT_FOUND_ERROR,
        shouldLog: false,
        isOperational: true,
        category: "NOT_FOUND",
      },
    );
  }

  static unauthorizedCancellation(rideId: string): DomainError {
    return new DomainError(
      formatMessage(
        RIDE_CANCELLATION_ERROR_MESSAGES.UNAUTHORIZED_CANCELLATION,
        {
          rideId,
        },
      ),
      "UNAUTHORIZED_CANCELLATION",
      {
        statusCode: HttpStatusCodes.FORBIDDEN,
        errorType: ErrorType.AUTHORIZATION_ERROR,
        shouldLog: false,
        isOperational: true,
        category: "AUTH",
      },
    );
  }

  static rideAlreadyCancelled(rideId: string): DomainError {
    return new DomainError(
      formatMessage(RIDE_CANCELLATION_ERROR_MESSAGES.RIDE_ALREADY_CANCELLED, {
        rideId,
      }),
      "RIDE_ALREADY_CANCELLED",
      {
        statusCode: HttpStatusCodes.CONFLICT,
        errorType: ErrorType.CONFLICT_ERROR,
        shouldLog: false,
        isOperational: true,
        category: "CONFLICT",
      },
    );
  }

  static cannotCancelCompletedRide(rideId: string): DomainError {
    return new DomainError(
      formatMessage(
        RIDE_CANCELLATION_ERROR_MESSAGES.CANNOT_CANCEL_COMPLETED_RIDE,
        { rideId },
      ),
      "CANNOT_CANCEL_COMPLETED_RIDE",
      {
        statusCode: HttpStatusCodes.CONFLICT,
        errorType: ErrorType.CONFLICT_ERROR,
        shouldLog: false,
        isOperational: true,
        category: "CONFLICT",
      },
    );
  }

  static cannotCancelStartedRide(rideId: string): DomainError {
    return new DomainError(
      formatMessage(
        RIDE_CANCELLATION_ERROR_MESSAGES.CANNOT_CANCEL_STARTED_RIDE,
        { rideId },
      ),
      "CANNOT_CANCEL_STARTED_RIDE",
      {
        statusCode: HttpStatusCodes.CONFLICT,
        errorType: ErrorType.CONFLICT_ERROR,
        shouldLog: false,
        isOperational: true,
        category: "CONFLICT",
      },
    );
  }

  static chargeCalculationFailed(rideId: string, reason: string): DomainError {
    return new DomainError(
      formatMessage(
        RIDE_CANCELLATION_ERROR_MESSAGES.CHARGE_CALCULATION_FAILED,
        { rideId, reason },
      ),
      "CANCELLATION_CHARGE_CALCULATION_FAILED",
      {
        statusCode: HttpStatusCodes.INTERNAL_SERVER_ERROR,
        errorType: ErrorType.SERVER_ERROR,
        shouldLog: true,
        isOperational: false,
        category: "SERVER",
      },
    );
  }

  static fareResetFailed(rideId: string, reason: string): DomainError {
    return new DomainError(
      formatMessage(RIDE_CANCELLATION_ERROR_MESSAGES.FARE_RESET_FAILED, {
        rideId,
        reason,
      }),
      "CANCELLATION_FARE_RESET_FAILED",
      {
        statusCode: HttpStatusCodes.INTERNAL_SERVER_ERROR,
        errorType: ErrorType.SERVER_ERROR,
        shouldLog: true,
        isOperational: false,
        category: "SERVER",
      },
    );
  }

  static invalidCancellationReason(reason: string): DomainError {
    return new DomainError(
      formatMessage(
        RIDE_CANCELLATION_ERROR_MESSAGES.INVALID_CANCELLATION_REASON,
        { reason },
      ),
      "INVALID_CANCELLATION_REASON",
      {
        statusCode: HttpStatusCodes.BAD_REQUEST,
        errorType: ErrorType.VALIDATION_ERROR,
        shouldLog: false,
        isOperational: true,
        category: "VALIDATION",
      },
    );
  }
}
