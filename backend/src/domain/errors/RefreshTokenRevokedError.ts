import { AuthErrorMessages } from "@shared/constants/AuthConstants";
import { DomainError } from "./DomainError";
import { ErrorType } from "@shared/enums/ErrorType";
import { HttpStatusCodes } from "@shared/enums/HttpStatusCodes";

export class RefreshTokenRevokedError extends DomainError {
  constructor() {
    super(AuthErrorMessages.REFRESH_TOKEN_REVOKED, "REFRESH_TOKEN_REVOKED", {
      statusCode: HttpStatusCodes.UNAUTHORIZED,
      errorType: ErrorType.AUTHENTICATION_ERROR,
      shouldLog: false,
      isOperational: true,
      category: "AUTH",
    });
    this.name = "RefreshTokenRevokedError";
  }
}
