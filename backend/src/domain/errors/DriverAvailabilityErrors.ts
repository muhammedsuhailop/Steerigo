import { DomainError } from "./DomainError";

export class DriverAvailabilityNotFoundError extends DomainError {
  constructor(driverId?: string) {
    super(
      `Driver availability not found${driverId ? ` for driver ID: ${driverId}` : ""}`
    );
  }
}

export class InvalidAvailabilityScheduleError extends DomainError {
  constructor(reason: string) {
    super(`Invalid availability schedule: ${reason}`);
  }
}

export class DriverAlreadyAvailableError extends DomainError {
  constructor(driverId: string) {
    super(`Driver ${driverId} already has an active availability record`);
  }
}

export class InvalidStatusTransitionError extends DomainError {
  constructor(currentStatus: string, newStatus: string) {
    super(`Cannot transition from ${currentStatus} to ${newStatus}`);
  }
}

export class ExpiredAvailabilityError extends DomainError {
  constructor() {
    super("Cannot perform operation on expired availability record");
  }
}

export class DriverProfileNotFoundError extends DomainError {
  constructor(userId: string) {
    super(`Driver profile not found for user ID: ${userId}`);
    this.name = "DriverProfileNotFoundError";
  }
}

export class AvailabilityExceptionNotFoundError extends DomainError {
  constructor(exceptionId: string) {
    super(`Availability Exception is not found for id : ${exceptionId}`);
    this.name = "AvailabilityExceptionNotFoundError";
  }
}
