import { AuthErrorMessages } from "@shared/constants/AuthConstants";
import { DomainError } from "./DomainError";
import { ErrorType } from "@shared/enums/ErrorType";
import { HttpStatusCodes } from "@shared/enums/HttpStatusCodes";

export class EmailNotVerifiedError extends DomainError {
  constructor() {
    super(AuthErrorMessages.EMAIL_NOT_VERIFIED, "EMAIL_NOT_VERIFIED", {
      statusCode: HttpStatusCodes.FORBIDDEN,
      errorType: ErrorType.AUTHORIZATION_ERROR,
      shouldLog: false,
      isOperational: true,
      category: "AUTH",
    });
    this.name = "EmailNotVerifiedError";
  }
}
