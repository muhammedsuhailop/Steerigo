import { DomainError } from "./DomainError";

export class RideRequestErrors {
  static driverNotFound(driverId: string): DomainError {
    return new DomainError(
      `Driver with ID ${driverId} not found`,
    );
  }

  static driverNotAvailable(driverId: string): DomainError {
    return new DomainError(
      `Driver with ID ${driverId} is not available`,
    );
  }

  static userNotFound(userId: string): DomainError {
    return new DomainError(
      `User with ID ${userId} not found`,
    );
  }

  static invalidFare(fare: number): DomainError {
    return new DomainError(
      `Invalid fare amount: ${fare}. Fare must be positive`,
    );
  }

  static invalidPickupTime(pickupTime: Date): DomainError {
    return new DomainError(
      `Invalid pickup time: ${pickupTime}. Pickup time must be in the future`,
    );
  }

  static duplicateRideRequest(riderId: string, driverId: string): DomainError {
    return new DomainError(
      `Rider ${riderId} already has a pending request to driver ${driverId}`,
    );
  }

  static rideRequestCreationFailed(reason?: string): DomainError {
    return new DomainError(
      `Failed to create ride request${reason ? `: ${reason}` : ""}`,
    );
  }

  static invalidLocation(fieldName: string): DomainError {
    return new DomainError(
      `Invalid ${fieldName} location coordinates`,
    );
  }

  static invalidRideType(rideType: string): DomainError {
    return new DomainError(
      `Invalid ride type: ${rideType}. Must be "One Way" or "Round Trip"`,
    );
  }
}
