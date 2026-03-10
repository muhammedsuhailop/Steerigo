import { DRIVER_ERROR_MESSAGES } from "@shared/constants/DriverMessages";
import { DomainError } from "./DomainError";
import { ErrorType } from "@shared/enums/ErrorType";
import { HttpStatusCodes } from "@shared/enums/HttpStatusCodes";

export class DriverNotFoundError extends DomainError {
  constructor(driverId?: string) {
    super(
      `${
        DRIVER_ERROR_MESSAGES.DRIVER_PROFILE_NOT_FOUND
      }${driverId ? ` with ID: ${driverId}` : ""}`,
      "DRIVER_NOT_FOUND",
      {
        statusCode: HttpStatusCodes.NOT_FOUND,
        errorType: ErrorType.NOT_FOUND_ERROR,
        shouldLog: false,
        isOperational: true,
        category: "NOT_FOUND",
      },
    );
    this.name = "DriverNotFoundError";
  }
}
