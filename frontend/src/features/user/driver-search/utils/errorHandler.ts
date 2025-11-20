import { SerializedError } from "@reduxjs/toolkit";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import {
  RIDE_REQUEST_ERROR_CODES,
  type RideRequestError,
  type RideRequestErrorCode,
} from "../types/rideRequest.types";

interface BackendError {
  success: boolean;
  message?: string;
  error?: string;
  errorCode?: string;
  details?: Record<string, unknown>;
}

const ERROR_MESSAGES: Record<RideRequestErrorCode, string> = {
  [RIDE_REQUEST_ERROR_CODES.DRIVER_NOT_FOUND]:
    "Driver not found. Please try selecting another driver.",
  [RIDE_REQUEST_ERROR_CODES.DRIVER_NOT_AVAILABLE]:
    "This driver is currently unavailable. Please select another driver.",
  [RIDE_REQUEST_ERROR_CODES.USER_NOT_FOUND]:
    "User account not found. Please log in again.",
  [RIDE_REQUEST_ERROR_CODES.INVALID_FARE]:
    "Invalid fare calculation. Please search again.",
  [RIDE_REQUEST_ERROR_CODES.INVALID_PICKUP_TIME]:
    "Pickup time must be in the future. Please select a valid time.",
  [RIDE_REQUEST_ERROR_CODES.DUPLICATE_RIDE_REQUEST]:
    "You already have a pending request to this driver.",
  [RIDE_REQUEST_ERROR_CODES.RIDE_REQUEST_CREATION_FAILED]:
    "Failed to create ride request. Please try again.",
  [RIDE_REQUEST_ERROR_CODES.INVALID_LOCATION]:
    "Invalid location coordinates. Please select locations again.",
  [RIDE_REQUEST_ERROR_CODES.INVALID_RIDE_TYPE]:
    "Invalid ride type. Please select One Way or Round Trip.",
  [RIDE_REQUEST_ERROR_CODES.NETWORK_ERROR]:
    "Network error. Please check your connection and try again.",
  [RIDE_REQUEST_ERROR_CODES.UNKNOWN_ERROR]:
    "An unexpected error occurred. Please try again.",
};

function isFetchBaseQueryError(error: unknown): error is FetchBaseQueryError {
  return typeof error === "object" && error != null && "status" in error;
}

function isSerializedError(error: unknown): error is SerializedError {
  return typeof error === "object" && error != null && "message" in error;
}

function extractErrorCode(error: FetchBaseQueryError): RideRequestErrorCode {
  if (error.status === "FETCH_ERROR") {
    return RIDE_REQUEST_ERROR_CODES.NETWORK_ERROR;
  }

  const data = error.data as BackendError | undefined;

  if (data?.errorCode) {
    const code = data.errorCode as RideRequestErrorCode;
    if (Object.values(RIDE_REQUEST_ERROR_CODES).includes(code)) {
      return code;
    }
  }

  return RIDE_REQUEST_ERROR_CODES.UNKNOWN_ERROR;
}

function extractErrorMessage(
  _error: FetchBaseQueryError,
  code: RideRequestErrorCode
): string {
  return ERROR_MESSAGES[code];
}

export function parseRideRequestError(
  error: FetchBaseQueryError | SerializedError | undefined
): RideRequestError {
  if (!error) {
    return {
      code: RIDE_REQUEST_ERROR_CODES.UNKNOWN_ERROR,
      message: ERROR_MESSAGES[RIDE_REQUEST_ERROR_CODES.UNKNOWN_ERROR],
    };
  }

  if (isFetchBaseQueryError(error)) {
    const code = extractErrorCode(error);
    const message = extractErrorMessage(error, code);
    const data = error.data as BackendError | undefined;

    return {
      code,
      message,
      details: data?.details,
    };
  }

  if (isSerializedError(error)) {
    return {
      code: RIDE_REQUEST_ERROR_CODES.UNKNOWN_ERROR,
      message:
        error.message || ERROR_MESSAGES[RIDE_REQUEST_ERROR_CODES.UNKNOWN_ERROR],
    };
  }

  return {
    code: RIDE_REQUEST_ERROR_CODES.UNKNOWN_ERROR,
    message: ERROR_MESSAGES[RIDE_REQUEST_ERROR_CODES.UNKNOWN_ERROR],
  };
}

export function getErrorMessage(code: RideRequestErrorCode): string {
  return (
    ERROR_MESSAGES[code] ||
    ERROR_MESSAGES[RIDE_REQUEST_ERROR_CODES.UNKNOWN_ERROR]
  );
}
