import { DomainError } from "./DomainError";
import { ErrorType } from "@shared/enums/ErrorType";
import { HttpStatusCodes } from "@shared/enums/HttpStatusCodes";

export class ValidationError extends DomainError {
  constructor(
    message: string,
    public readonly field?: string,
  ) {
    super(message, "VALIDATION_ERROR", {
      statusCode: HttpStatusCodes.BAD_REQUEST,
      errorType: ErrorType.VALIDATION_ERROR,
      shouldLog: false,
      isOperational: true,
      category: "VALIDATION",
    });
    this.name = "ValidationError";
  }
}

export class InvalidLatitudeError extends ValidationError {
  constructor(
    message: string = "Latitude must be a number between -90 and 90",
  ) {
    super(message, "latitude");
    this.name = "InvalidLatitudeError";
  }
}

export class InvalidLongitudeError extends ValidationError {
  constructor(
    message: string = "Longitude must be a number between -180 and 180",
  ) {
    super(message, "longitude");
    this.name = "InvalidLongitudeError";
  }
}

export class InvalidSearchDateFormatError extends ValidationError {
  constructor(message: string = "Search date must be a valid date") {
    super(message, "searchDate");
    this.name = "InvalidSearchDateFormatError";
  }
}

export class InvalidSearchDateRangeError extends ValidationError {
  constructor(
    message: string = "Search date must be in the future or current",
  ) {
    super(message, "searchDate");
    this.name = "InvalidSearchDateRangeError";
  }
}

export class InvalidTimeRequiredError extends ValidationError {
  constructor(
    message: string = "Time required must be between 1 and 480 minutes",
  ) {
    super(message, "timeRequired");
    this.name = "InvalidTimeRequiredError";
  }
}

export class InvalidRadiusError extends ValidationError {
  constructor(message: string = "Radius must be between 0 and 50 km") {
    super(message, "radiusKm");
    this.name = "InvalidRadiusError";
  }
}

export class InvalidLimitError extends ValidationError {
  constructor(message: string = "Limit must be between 1 and 100") {
    super(message, "limit");
    this.name = "InvalidLimitError";
  }
}

export class InvalidGearTypeError extends ValidationError {
  constructor(message: string) {
    super(message, "gearType");
    this.name = "InvalidGearTypeError";
  }
}

export class InvalidBodyTypeError extends ValidationError {
  constructor(message: string) {
    super(message, "bodyType");
    this.name = "InvalidBodyTypeError";
  }
}
