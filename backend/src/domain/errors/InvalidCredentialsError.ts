import { AuthMessages } from "@shared/constants/AuthConstants";
import { DomainError } from "./DomainError";
import { ErrorType } from "@shared/enums/ErrorType";
import { HttpStatusCodes } from "@shared/enums/HttpStatusCodes";

export class InvalidCredentialsError extends DomainError {
  constructor() {
    super(AuthMessages.INVALID_CREDENTIALS, "INVALID_CREDENTIALS", {
      statusCode: HttpStatusCodes.UNAUTHORIZED,
      errorType: ErrorType.AUTHENTICATION_ERROR,
      shouldLog: false,
      isOperational: true,
      category: "AUTH",
    });
    this.name = "InvalidCredentialsError";
  }
}

export class InvalidCurrentPasswordError extends DomainError {
  constructor() {
    super(AuthMessages.INVALID_CURRENT_PASSWORD, "INVALID_CURRENT_PASSWORD", {
      statusCode: HttpStatusCodes.BAD_REQUEST,
      errorType: ErrorType.AUTHENTICATION_ERROR,
      shouldLog: false,
      isOperational: true,
      category: "AUTH",
    });

    this.name = "InvalidCurrentPasswordError";
  }
}
