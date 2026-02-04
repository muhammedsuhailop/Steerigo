import { DomainError } from "./DomainError";

export class RideErrors {
  static rideNotFound(rideId: string): DomainError {
    return new DomainError(
      `Ride with ID ${rideId} not found`,
      "RIDE_NOT_FOUND",
    );
  }

  static rideAlreadyAccepted(rideId: string): DomainError {
    return new DomainError(
      `Ride ${rideId} has already been accepted`,
      "RIDE_ALREADY_ACCEPTED",
    );
  }

  static rideAlreadyStarted(rideId: string): DomainError {
    return new DomainError(
      `Ride ${rideId} has already been started`,
      "RIDE_ALREADY_STARTED",
    );
  }

  static rideAlreadyCompleted(rideId: string): DomainError {
    return new DomainError(
      `Ride ${rideId} has already been completed`,
      "RIDE_ALREADY_COMPLETED",
    );
  }

  static rideAlreadyCancelled(rideId: string): DomainError {
    return new DomainError(
      `Ride ${rideId} has been cancelled`,
      "RIDE_ALREADY_CANCELLED",
    );
  }

  static driverAlreadyHasActiveRide(
    driverId: string,
    existingRideId: string,
  ): DomainError {
    return new DomainError(
      `Driver ${driverId} already has an active ride: ${existingRideId}`,
      "DRIVER_HAS_ACTIVE_RIDE",
    );
  }

  static riderAlreadyHasActiveRide(
    riderId: string,
    existingRideId: string,
  ): DomainError {
    return new DomainError(
      `Rider ${riderId} already has an active ride: ${existingRideId}`,
      "RIDER_HAS_ACTIVE_RIDE",
    );
  }

  static invalidRideStatusTransition(
    from: string,
    to: string,
    rideId: string,
  ): DomainError {
    return new DomainError(
      `Cannot transition ride ${rideId} from ${from} to ${to}`,
      "INVALID_STATUS_TRANSITION",
    );
  }

  static rideCreationFailed(reason: string): DomainError {
    return new DomainError(
      `Failed to create ride: ${reason}`,
      "RIDE_CREATION_FAILED",
    );
  }
}
