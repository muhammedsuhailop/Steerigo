import { AuthErrorMessages } from "@shared/constants/AuthConstants";
import { DomainError } from "./DomainError";
import { ErrorType } from "@shared/enums/ErrorType";
import { HttpStatusCodes } from "@shared/enums/HttpStatusCodes";

export class OtpNotFoundError extends DomainError {
  constructor() {
    super(AuthErrorMessages.OTP_NOT_FOUND, "OTP_NOT_FOUND", {
      statusCode: HttpStatusCodes.NOT_FOUND,
      errorType: ErrorType.NOT_FOUND_ERROR,
      shouldLog: false,
      isOperational: true,
      category: "NOT_FOUND",
    });
    this.name = "OtpNotFoundError";
  }
}
