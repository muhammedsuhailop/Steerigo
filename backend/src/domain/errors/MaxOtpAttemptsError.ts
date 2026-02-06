import { AuthErrorMessages } from "@shared/constants/AuthConstants";
import { DomainError } from "./DomainError";
import { ErrorType } from "@shared/enums/ErrorType";
import { HttpStatusCodes } from "@shared/enums/HttpStatusCodes";

export class MaxOtpAttemptsError extends DomainError {
  constructor() {
    super(AuthErrorMessages.MAX_OTP_ATTEMPTS, "MAX_OTP_ATTEMPTS", {
      statusCode: HttpStatusCodes.TOO_MANY_REQUESTS,
      errorType: ErrorType.VALIDATION_ERROR,
      shouldLog: false,
      isOperational: true,
      category: "VALIDATION",
    });
    this.name = "MaxOtpAttemptsError";
  }
}
