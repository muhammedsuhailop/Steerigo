import { AuthErrorMessages } from "@shared/constants/AuthConstants";
import { DomainError } from "./DomainError";
import { ErrorType } from "@shared/enums/ErrorType";
import { HttpStatusCodes } from "@shared/enums/HttpStatusCodes";

export class PasswordResetError extends DomainError {
  constructor(message: string = AuthErrorMessages.PASSWORD_RESET_FAILED) {
    super(message, "PASSWORD_RESET_FAILED", {
      statusCode: HttpStatusCodes.BAD_REQUEST,
      errorType: ErrorType.VALIDATION_ERROR,
      shouldLog: true,
      isOperational: true,
      category: "VALIDATION",
    });
    this.name = "PasswordResetError";
  }
}
