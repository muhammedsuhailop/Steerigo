import { DomainError } from "./DomainError";

export class RideRequestErrors {
  static driverNotFound(driverId: string): DomainError {
    return new DomainError(
      `Driver with ID ${driverId} not found`,
      "DRIVER_NOT_FOUND"
    );
  }

  static driverNotAvailable(driverId: string): DomainError {
    return new DomainError(
      `Driver with ID ${driverId} is not available`,
      "DRIVER_NOT_AVAILABLE"
    );
  }

  static userNotFound(userId: string): DomainError {
    return new DomainError(
      `User with ID ${userId} not found`,
      "USER_NOT_FOUND"
    );
  }

  static invalidFare(fare: number): DomainError {
    return new DomainError(
      `Invalid fare amount: ${fare}. Fare must be positive`,
      "INVALID_FARE"
    );
  }

  static invalidPickupTime(pickupTime: Date): DomainError {
    return new DomainError(
      `Invalid pickup time: ${pickupTime}. Pickup time must be in the future`,
      "INVALID_PICKUP_TIME"
    );
  }

  static duplicateRideRequest(riderId: string, driverId: string): DomainError {
    return new DomainError(
      `Rider ${riderId} already has a pending request to driver ${driverId}`,
      "DUPLICATE_RIDE_REQUEST"
    );
  }

  static rideRequestCreationFailed(reason?: string): DomainError {
    return new DomainError(
      `Failed to create ride request${reason ? `: ${reason}` : ""}`,
      "RIDE_REQUEST_CREATION_FAILED"
    );
  }

  static invalidLocation(fieldName: string): DomainError {
    return new DomainError(
      `Invalid ${fieldName} location coordinates`,
      "INVALID_LOCATION"
    );
  }

  static invalidRideType(rideType: string): DomainError {
    return new DomainError(
      `Invalid ride type: ${rideType}. Must be "One Way" or "Round Trip"`,
      "INVALID_RIDE_TYPE"
    );
  }
}
