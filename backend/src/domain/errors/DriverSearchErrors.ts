import { DomainError } from "./DomainError";

export class NoDriversAvailableError extends DomainError {
  constructor(message: string = "No drivers available in the specified area") {
    super(message);
    this.name = "NoDriversAvailableError";
  }
}

export class InvalidLocationError extends DomainError {
  constructor(message: string = "Invalid location coordinates") {
    super(message);
    this.name = "InvalidLocationError";
  }
}

export class InvalidSearchDateError extends DomainError {
  constructor(message: string = "Invalid search date provided") {
    super(message);
    this.name = "InvalidSearchDateError";
  }
}

export class DriverFilterNotMatchError extends DomainError {
  constructor(
    message: string = "No drivers match your vehicle type preferences"
  ) {
    super(message);
    this.name = "DriverFilterNotMatchError";
  }
}

export class LocationServiceError extends DomainError {
  constructor(message: string = "Error processing location") {
    super(message);
    this.name = "LocationServiceError";
  }
}
