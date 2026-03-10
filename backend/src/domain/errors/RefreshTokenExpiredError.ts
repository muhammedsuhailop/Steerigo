import { AuthErrorMessages } from "@shared/constants/AuthConstants";
import { DomainError } from "./DomainError";
import { ErrorType } from "@shared/enums/ErrorType";
import { HttpStatusCodes } from "@shared/enums/HttpStatusCodes";

export class RefreshTokenExpiredError extends DomainError {
  constructor() {
    super(AuthErrorMessages.REFRESH_TOKEN_EXPIRED, "REFRESH_TOKEN_EXPIRED", {
      statusCode: HttpStatusCodes.UNAUTHORIZED,
      errorType: ErrorType.AUTHENTICATION_ERROR,
      shouldLog: false,
      isOperational: true,
      category: "AUTH",
    });
    this.name = "RefreshTokenExpiredError";
  }
}
