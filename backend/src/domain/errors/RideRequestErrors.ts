import { RideRequestStatus } from "@domain/value-objects/RideRequestStatus";
import { DomainError } from "./DomainError";
import { ErrorType } from "@shared/enums/ErrorType";
import { HttpStatusCodes } from "@shared/enums/HttpStatusCodes";
import { formatMessage } from "@shared/utils/errorMessageFormatter";
import { RIDE_REQUEST_ERROR_MESSAGES } from "@shared/constants/RideRequestMessages";

export class RideRequestErrors {
  static driverNotFound(driverId: string): DomainError {
    return new DomainError(
      formatMessage(RIDE_REQUEST_ERROR_MESSAGES.DRIVER_NOT_FOUND, {
        driverId,
      }),
      "DRIVER_NOT_FOUND",
      {
        statusCode: HttpStatusCodes.NOT_FOUND,
        errorType: ErrorType.NOT_FOUND_ERROR,
        shouldLog: false,
        isOperational: true,
        category: "NOT_FOUND",
      },
    );
  }

  static rideRequestNotFound(requestId: string): DomainError {
    return new DomainError(
      formatMessage(RIDE_REQUEST_ERROR_MESSAGES.RIDE_REQUEST_NOT_FOUND, {
        requestId,
      }),
      "RIDE_REQUEST_NOT_FOUND",
      {
        statusCode: HttpStatusCodes.NOT_FOUND,
        errorType: ErrorType.NOT_FOUND_ERROR,
        shouldLog: false,
        isOperational: true,
        category: "NOT_FOUND",
      },
    );
  }

  static noPendingRequestsFound(): DomainError {
    return new DomainError(
      RIDE_REQUEST_ERROR_MESSAGES.NO_PENDING_REQUEST_FOUND,
      "NO_PENDING_REQUEST_FOUND",
      {
        statusCode: HttpStatusCodes.NOT_FOUND,
        errorType: ErrorType.NOT_FOUND_ERROR,
        shouldLog: false,
        isOperational: true,
        category: "NOT_FOUND",
      },
    );
  }

  static userNotFound(userId: string): DomainError {
    return new DomainError(
      formatMessage(RIDE_REQUEST_ERROR_MESSAGES.USER_NOT_FOUND, {
        userId,
      }),
      "USER_NOT_FOUND",
      {
        statusCode: HttpStatusCodes.NOT_FOUND,
        errorType: ErrorType.NOT_FOUND_ERROR,
        shouldLog: false,
        isOperational: true,
        category: "NOT_FOUND",
      },
    );
  }

  static invalidFare(fare: number): DomainError {
    return new DomainError(
      formatMessage(RIDE_REQUEST_ERROR_MESSAGES.INVALID_FARE, {
        fare: String(fare),
      }),
      "INVALID_FARE",
      {
        statusCode: HttpStatusCodes.BAD_REQUEST,
        errorType: ErrorType.VALIDATION_ERROR,
        shouldLog: false,
        isOperational: true,
        category: "VALIDATION",
      },
    );
  }

  static invalidPickupTime(pickupTime: Date): DomainError {
    return new DomainError(
      formatMessage(RIDE_REQUEST_ERROR_MESSAGES.INVALID_PICKUP_TIME, {
        pickupTime: pickupTime.toISOString(),
      }),
      "INVALID_PICKUP_TIME",
      {
        statusCode: HttpStatusCodes.BAD_REQUEST,
        errorType: ErrorType.VALIDATION_ERROR,
        shouldLog: false,
        isOperational: true,
        category: "VALIDATION",
      },
    );
  }

  static invalidLocation(fieldName: string): DomainError {
    return new DomainError(
      formatMessage(RIDE_REQUEST_ERROR_MESSAGES.INVALID_LOCATION, {
        fieldName,
      }),
      "INVALID_LOCATION",
      {
        statusCode: HttpStatusCodes.BAD_REQUEST,
        errorType: ErrorType.VALIDATION_ERROR,
        shouldLog: false,
        isOperational: true,
        category: "VALIDATION",
      },
    );
  }

  static invalidRideType(rideType: string): DomainError {
    return new DomainError(
      formatMessage(RIDE_REQUEST_ERROR_MESSAGES.INVALID_RIDE_TYPE, {
        rideType,
      }),
      "INVALID_RIDE_TYPE",
      {
        statusCode: HttpStatusCodes.BAD_REQUEST,
        errorType: ErrorType.VALIDATION_ERROR,
        shouldLog: false,
        isOperational: true,
        category: "VALIDATION",
      },
    );
  }

  static driverNotAvailable(driverId: string): DomainError {
    return new DomainError(
      formatMessage(RIDE_REQUEST_ERROR_MESSAGES.DRIVER_NOT_AVAILABLE, {
        driverId,
      }),
      "DRIVER_NOT_AVAILABLE",
      {
        statusCode: HttpStatusCodes.CONFLICT,
        errorType: ErrorType.CONFLICT_ERROR,
        shouldLog: false,
        isOperational: true,
        category: "CONFLICT",
      },
    );
  }

  static duplicateRideRequest(riderId: string, driverId: string): DomainError {
    return new DomainError(
      formatMessage(RIDE_REQUEST_ERROR_MESSAGES.DUPLICATE_RIDE_REQUEST, {
        riderId,
        driverId,
      }),
      "DUPLICATE_RIDE_REQUEST",
      {
        statusCode: HttpStatusCodes.CONFLICT,
        errorType: ErrorType.CONFLICT_ERROR,
        shouldLog: false,
        isOperational: true,
        category: "CONFLICT",
      },
    );
  }

  static rideRequestNotForDriver(
    requestId: string,
    driverId: string,
  ): DomainError {
    return new DomainError(
      formatMessage(RIDE_REQUEST_ERROR_MESSAGES.REQUEST_DRIVER_MISMATCH, {
        driverId,
      }),
      "REQUEST_DRIVER_MISMATCH",
      {
        statusCode: HttpStatusCodes.FORBIDDEN,
        errorType: ErrorType.AUTHORIZATION_ERROR,
        shouldLog: false,
        isOperational: true,
        category: "AUTH",
      },
    );
  }

  static rideRequestNotPending(
    requestId: string,
    requestStatus: RideRequestStatus,
  ): DomainError {
    return new DomainError(
      formatMessage(RIDE_REQUEST_ERROR_MESSAGES.REQUEST_NOT_IN_PENDING, {
        requestId,
        status: requestStatus,
      }),
      "REQUEST_NOT_IN_PENDING",
      {
        statusCode: HttpStatusCodes.CONFLICT,
        errorType: ErrorType.CONFLICT_ERROR,
        shouldLog: false,
        isOperational: true,
        category: "CONFLICT",
      },
    );
  }

  static rideRequestCreationFailed(reason?: string): DomainError {
    const formattedReason = reason ? `: ${reason}` : "";

    return new DomainError(
      formatMessage(RIDE_REQUEST_ERROR_MESSAGES.RIDE_REQUEST_CREATION_FAILED, {
        reason: formattedReason,
      }),
      "RIDE_REQUEST_CREATION_FAILED",
      {
        statusCode: HttpStatusCodes.INTERNAL_SERVER_ERROR,
        errorType: ErrorType.SERVER_ERROR,
        shouldLog: true,
        isOperational: false,
        category: "SERVER",
      },
    );
  }
  static requestAlreadyBeingProcessed(requestId: string): DomainError {
    return new DomainError(
      formatMessage(
        RIDE_REQUEST_ERROR_MESSAGES.RIDE_REQUEST_ALREADY_PROCESSING,
        { requestId },
      ),
      "RIDE_REQUEST_ALREADY_PROCESSING",
      {
        statusCode: HttpStatusCodes.CONFLICT,
        errorType: ErrorType.CONFLICT_ERROR,
        shouldLog: false,
        isOperational: true,
        category: "CONFLICT",
      },
    );
  }

  static requestAlreadyAccepted(requestId: string): DomainError {
    return new DomainError(
      formatMessage(RIDE_REQUEST_ERROR_MESSAGES.RIDE_REQUEST_ALREADY_ACCEPTED, {
        requestId,
      }),
      "RIDE_REQUEST_ALREADY_ACCEPTED",
      {
        statusCode: HttpStatusCodes.CONFLICT,
        errorType: ErrorType.CONFLICT_ERROR,
        shouldLog: false,
        isOperational: true,
        category: "CONFLICT",
      },
    );
  }

  static rideRequestExpired(requestId: string): DomainError {
    return new DomainError(
      formatMessage(RIDE_REQUEST_ERROR_MESSAGES.RIDE_REQUEST_EXPIRED, {
        requestId,
      }),
      "RIDE_REQUEST_EXPIRED",
      {
        statusCode: HttpStatusCodes.GONE,
        errorType: ErrorType.CONFLICT_ERROR,
        shouldLog: false,
        isOperational: true,
        category: "CONFLICT",
      },
    );
  }
}
