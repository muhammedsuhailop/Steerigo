import { DomainError } from "./DomainError";
import { ErrorType } from "@shared/enums/ErrorType";
import { HttpStatusCodes } from "@shared/enums/HttpStatusCodes";

export class AccountStatusError extends DomainError {
  constructor(
    message: string,
    public readonly status: string,
  ) {
    super(message, "ACCOUNT_STATUS_ERROR", {
      statusCode: HttpStatusCodes.FORBIDDEN,
      errorType: ErrorType.AUTHORIZATION_ERROR,
      shouldLog: true,
      isOperational: true,
      category: "AUTH",
    });
    this.name = "AccountStatusError";
  }
}
