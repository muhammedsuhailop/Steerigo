import { AuthMessages } from "@shared/constants/AuthConstants";
import { DomainError } from "./DomainError";
import { ErrorType } from "@shared/enums/ErrorType";
import { HttpStatusCodes } from "@shared/enums/HttpStatusCodes";

export class UserAlreadyExistsError extends DomainError {
  constructor(message: string = AuthMessages.EMAIL_ALREADY_EXISIT) {
    super(message, "USER_ALREADY_EXISTS", {
      statusCode: HttpStatusCodes.CONFLICT,
      errorType: ErrorType.CONFLICT_ERROR,
      shouldLog: false,
      isOperational: true,
      category: "CONFLICT",
    });

    this.name = "UserAlreadyExistsError";
  }
}
