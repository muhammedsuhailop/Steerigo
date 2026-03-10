import { ADMIN_ERROR_MESSAGES } from "@shared/constants/AdminMessages";
import { DomainError } from "./DomainError";
import { ErrorType } from "@shared/enums/ErrorType";
import { HttpStatusCodes } from "@shared/enums/HttpStatusCodes";

export class AdminUserNotFoundError extends DomainError {
  constructor(userId?: string) {
    const baseMessage = ADMIN_ERROR_MESSAGES.USER.NOT_FOUND;

    super(
      `${baseMessage}${userId ? ` with ID: ${userId}` : ""}`,
      "ADMIN_USER_NOT_FOUND",
      {
        statusCode: HttpStatusCodes.NOT_FOUND,
        errorType: ErrorType.NOT_FOUND_ERROR,
        shouldLog: false,
        isOperational: true,
        category: "NOT_FOUND",
      },
    );

    this.name = "AdminUserNotFoundError";
  }
}

export class AdminInvalidActionError extends DomainError {
  constructor(action: string) {
    super(
      `${ADMIN_ERROR_MESSAGES.USER.INVALID_ACTION}: ${action}`,
      "ADMIN_INVALID_ACTION",
      {
        statusCode: HttpStatusCodes.BAD_REQUEST,
        errorType: ErrorType.VALIDATION_ERROR,
        shouldLog: false,
        isOperational: true,
        category: "VALIDATION",
      },
    );

    this.name = "AdminInvalidActionError";
  }
}

export class AdminUnauthorizedActionError extends DomainError {
  constructor(action: string, reason?: string) {
    const baseMessage = ADMIN_ERROR_MESSAGES.USER.UNAUTHORIZED_ACTION;

    super(
      `${baseMessage}: ${action}${reason ? `. ${reason}` : ""}`,
      "ADMIN_UNAUTHORIZED_ACTION",
      {
        statusCode: HttpStatusCodes.FORBIDDEN,
        errorType: ErrorType.AUTHORIZATION_ERROR,
        shouldLog: true,
        isOperational: true,
        category: "AUTH",
      },
    );

    this.name = "AdminUnauthorizedActionError";
  }
}
