import { RIDE_ERROR_MESSAGES } from "@shared/constants/RideMessages";
import { DomainError } from "./DomainError";
import { ErrorType } from "@shared/enums/ErrorType";
import { HttpStatusCodes } from "@shared/enums/HttpStatusCodes";

import { formatMessage } from "@shared/utils/errorMessageFormatter";

export class RideErrors {
  static rideNotFound(rideId: string): DomainError {
    return new DomainError(
      formatMessage(RIDE_ERROR_MESSAGES.RIDE_NOT_FOUND, { rideId }),
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

  static rideAlreadyAccepted(rideId: string): DomainError {
    return new DomainError(
      formatMessage(RIDE_ERROR_MESSAGES.RIDE_ALREADY_ACCEPTED, { rideId }),
      "RIDE_ALREADY_ACCEPTED",
      {
        statusCode: HttpStatusCodes.CONFLICT,
        errorType: ErrorType.CONFLICT_ERROR,
        shouldLog: false,
        isOperational: true,
        category: "CONFLICT",
      },
    );
  }

  static rideAlreadyStarted(rideId: string): DomainError {
    return new DomainError(
      formatMessage(RIDE_ERROR_MESSAGES.RIDE_ALREADY_STARTED, { rideId }),
      "RIDE_ALREADY_STARTED",
      {
        statusCode: HttpStatusCodes.CONFLICT,
        errorType: ErrorType.CONFLICT_ERROR,
        shouldLog: false,
        isOperational: true,
        category: "CONFLICT",
      },
    );
  }

  static rideAlreadyCompleted(rideId: string): DomainError {
    return new DomainError(
      formatMessage(RIDE_ERROR_MESSAGES.RIDE_ALREADY_COMPLETED, { rideId }),
      "RIDE_ALREADY_COMPLETED",
      {
        statusCode: HttpStatusCodes.CONFLICT,
        errorType: ErrorType.CONFLICT_ERROR,
        shouldLog: false,
        isOperational: true,
        category: "CONFLICT",
      },
    );
  }

  static rideAlreadyCancelled(rideId: string): DomainError {
    return new DomainError(
      formatMessage(RIDE_ERROR_MESSAGES.RIDE_ALREADY_CANCELLED, { rideId }),
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

  static driverAlreadyHasActiveRide(
    driverId: string,
    existingRideId: string,
  ): DomainError {
    return new DomainError(
      formatMessage(RIDE_ERROR_MESSAGES.DRIVER_HAS_ACTIVE_RIDE, {
        driverId,
        rideId: existingRideId,
      }),
      "DRIVER_HAS_ACTIVE_RIDE",
      {
        statusCode: HttpStatusCodes.CONFLICT,
        errorType: ErrorType.CONFLICT_ERROR,
        shouldLog: false,
        isOperational: true,
        category: "CONFLICT",
      },
    );
  }

  static riderAlreadyHasActiveRide(
    riderId: string,
    existingRideId: string,
  ): DomainError {
    return new DomainError(
      formatMessage(RIDE_ERROR_MESSAGES.RIDER_HAS_ACTIVE_RIDE, {
        riderId,
        rideId: existingRideId,
      }),
      "RIDER_HAS_ACTIVE_RIDE",
      {
        statusCode: HttpStatusCodes.CONFLICT,
        errorType: ErrorType.CONFLICT_ERROR,
        shouldLog: false,
        isOperational: true,
        category: "CONFLICT",
      },
    );
  }

  static invalidRideStatusTransition(
    from: string,
    to: string,
    rideId: string,
  ): DomainError {
    return new DomainError(
      formatMessage(RIDE_ERROR_MESSAGES.INVALID_STATUS_TRANSITION, {
        from,
        to,
        rideId,
      }),
      "INVALID_STATUS_TRANSITION",
      {
        statusCode: HttpStatusCodes.BAD_REQUEST,
        errorType: ErrorType.VALIDATION_ERROR,
        shouldLog: false,
        isOperational: true,
        category: "VALIDATION",
      },
    );
  }

  static rideCreationFailed(reason: string): DomainError {
    return new DomainError(
      formatMessage(RIDE_ERROR_MESSAGES.RIDE_CREATION_FAILED, { reason }),
      "RIDE_CREATION_FAILED",
      {
        statusCode: HttpStatusCodes.INTERNAL_SERVER_ERROR,
        errorType: ErrorType.SERVER_ERROR,
        shouldLog: true,
        isOperational: false,
        category: "SERVER",
      },
    );
  }

  static unauthorizedRideAccess(rideId: string): DomainError {
    return new DomainError(
      formatMessage(RIDE_ERROR_MESSAGES.UNAUTHORIZED_RIDE_ACCESS, { rideId }),
      "UNAUTHORIZED_RIDE_ACCESS",
      {
        statusCode: HttpStatusCodes.FORBIDDEN,
        errorType: ErrorType.AUTHORIZATION_ERROR,
        shouldLog: false,
        isOperational: true,
        category: "AUTH",
      },
    );
  }

  static cannotMarkAsArrived(
    rideId: string,
    currentStatus: string,
  ): DomainError {
    return new DomainError(
      formatMessage(RIDE_ERROR_MESSAGES.CANNOT_MARK_AS_ARRIVED, {
        rideId,
        currentStatus,
      }),
      "CANNOT_MARK_AS_ARRIVED",
      {
        statusCode: HttpStatusCodes.BAD_REQUEST,
        errorType: ErrorType.VALIDATION_ERROR,
        shouldLog: false,
        isOperational: true,
        category: "VALIDATION",
      },
    );
  }

  static cannotRateIncompleteRide(rideId: string): DomainError {
    return new DomainError(
      formatMessage(RIDE_ERROR_MESSAGES.CANNOT_RATE_INCOMPLETE_RIDE, {
        rideId,
      }),
      "CANNOT_RATE_INCOMPLETE_RIDE",
      {
        statusCode: HttpStatusCodes.BAD_REQUEST,
        errorType: ErrorType.VALIDATION_ERROR,
        shouldLog: false,
        isOperational: true,
        category: "VALIDATION",
      },
    );
  }

  static rideAlreadyRated(rideId: string): DomainError {
    return new DomainError(
      formatMessage(RIDE_ERROR_MESSAGES.RIDE_ALREADY_RATED, { rideId }),
      "RIDE_ALREADY_RATED",
      {
        statusCode: HttpStatusCodes.CONFLICT,
        errorType: ErrorType.CONFLICT_ERROR,
        shouldLog: false,
        isOperational: true,
        category: "CONFLICT",
      },
    );
  }

  static driverNotFoundForRide(rideId: string): DomainError {
    return new DomainError(
      formatMessage(RIDE_ERROR_MESSAGES.DRIVER_NOT_FOUND_FOR_RIDE, {
        rideId,
      }),
      "DRIVER_NOT_FOUND_FOR_RIDE",
      {
        statusCode: HttpStatusCodes.NOT_FOUND,
        errorType: ErrorType.NOT_FOUND_ERROR,
        shouldLog: false,
        isOperational: true,
        category: "NOT_FOUND",
      },
    );
  }

  static invalidRatingValue(): DomainError {
    return new DomainError(
      formatMessage(RIDE_ERROR_MESSAGES.INVALID_RATING_VALUE, {}),
      "INVALID_RATING_VALUE",
      {
        statusCode: HttpStatusCodes.BAD_REQUEST,
        errorType: ErrorType.VALIDATION_ERROR,
        shouldLog: false,
        isOperational: true,
        category: "VALIDATION",
      },
    );
  }

  static invalidRatingData(reason: string): DomainError {
    return new DomainError(
      formatMessage(RIDE_ERROR_MESSAGES.INVALID_RATING_DATA, { reason }),
      "INVALID_RATING_DATA",
      {
        statusCode: HttpStatusCodes.BAD_REQUEST,
        errorType: ErrorType.VALIDATION_ERROR,
        shouldLog: false,
        isOperational: true,
        category: "VALIDATION",
      },
    );
  }

  static rideNotEligibleForCoupon(
    rideId: string,
    currentStatus: string,
  ): DomainError {
    return new DomainError(
      formatMessage(RIDE_ERROR_MESSAGES.RIDE_NOT_ELIGIBLE_FOR_COUPON, {
        rideId,
        currentStatus,
      }),
      "RIDE_NOT_ELIGIBLE_FOR_COUPON",
      {
        statusCode: HttpStatusCodes.BAD_REQUEST,
        errorType: ErrorType.VALIDATION_ERROR,
        shouldLog: false,
        isOperational: true,
        category: "VALIDATION",
      },
    );
  }

  static timeSlotConflict(): DomainError {
    return new DomainError(
      "You already have another ride during this time slot.",
      "RIDE_TIME_SLOT_CONFLICT",
      {
        statusCode: HttpStatusCodes.CONFLICT,
        errorType: ErrorType.CONFLICT_ERROR,
        shouldLog: false,
        isOperational: true,
        category: "CONFLICT",
      },
    );
  }

  static invalidVerificationCode(rideId: string): DomainError {
    return new DomainError(
      formatMessage(RIDE_ERROR_MESSAGES.INVALID_VERIFICATION_CODE, { rideId }),
      "INVALID_VERIFICATION_CODE",
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
