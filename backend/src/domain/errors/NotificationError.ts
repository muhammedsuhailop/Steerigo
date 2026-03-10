import { DomainError } from "./DomainError";
import { ErrorType } from "@shared/enums/ErrorType";
import { HttpStatusCodes } from "@shared/enums/HttpStatusCodes";
import { formatMessage } from "@shared/utils/errorMessageFormatter";
import { NOTIFICATION_ERROR_MESSAGES } from "@shared/constants/NotificationMessages";

export class NotificationErrors {
  static notificationNotFound(notificationId: string): DomainError {
    return new DomainError(
      formatMessage(NOTIFICATION_ERROR_MESSAGES.NOTIFICATION_NOT_FOUND, {
        notificationId,
      }),
      "NOTIFICATION_NOT_FOUND",
      {
        statusCode: HttpStatusCodes.NOT_FOUND,
        errorType: ErrorType.NOT_FOUND_ERROR,
        shouldLog: false,
        isOperational: true,
        category: "NOT_FOUND",
      },
    );
  }

  static notificationIdOrMarkAllRequired(): DomainError {
    return new DomainError(
      NOTIFICATION_ERROR_MESSAGES.NOTIFICATION_ID_OR_MARK_ALL_REQUIRED,
      "NOTIFICATION_ID_OR_MARK_ALL_REQUIRED",
      {
        statusCode: HttpStatusCodes.BAD_REQUEST,
        errorType: ErrorType.VALIDATION_ERROR,
        shouldLog: false,
        isOperational: true,
        category: "VALIDATION",
      },
    );
  }
}
