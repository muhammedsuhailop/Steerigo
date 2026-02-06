import { AuthErrorMessages } from "@shared/constants/AuthConstants";
import { DomainError } from "./DomainError";
import { ErrorType } from "@shared/enums/ErrorType";
import { HttpStatusCodes } from "@shared/enums/HttpStatusCodes";

export class MobileAlreadyExistsError extends DomainError {
  constructor() {
    super(AuthErrorMessages.MOBILE_ALREADY_EXISTS, "MOBILE_ALREADY_EXISTS", {
      statusCode: HttpStatusCodes.CONFLICT,
      errorType: ErrorType.CONFLICT_ERROR,
      shouldLog: false,
      isOperational: true,
      category: "CONFLICT",
    });
    this.name = "MobileAlreadyExistsError";
  }
}
