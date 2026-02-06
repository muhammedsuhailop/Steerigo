import { AuthErrorMessages } from "@shared/constants/AuthConstants";
import { DomainError } from "./DomainError";
import { ErrorType } from "@shared/enums/ErrorType";
import { HttpStatusCodes } from "@shared/enums/HttpStatusCodes";

export class OtpExpiredError extends DomainError {
  constructor() {
    super(AuthErrorMessages.OTP_EXPIRED, "OTP_EXPIRED", {
      statusCode: HttpStatusCodes.GONE,
      errorType: ErrorType.VALIDATION_ERROR,
      shouldLog: false,
      isOperational: true,
      category: "VALIDATION",
    });
    this.name = "OtpExpiredError";
  }
}
