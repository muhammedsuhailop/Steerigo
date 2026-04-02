import { DomainError } from "./DomainError";
import { ErrorType } from "@shared/enums/ErrorType";
import { HttpStatusCodes } from "@shared/enums/HttpStatusCodes";
import { formatMessage } from "@shared/utils/errorMessageFormatter";
import { TRANSACTION_ERROR_MESSAGES } from "@shared/constants/TransactionMessages";

export class TransactionErrors {
  static transactionNotFound(transactionId: string): DomainError {
    return new DomainError(
      formatMessage(TRANSACTION_ERROR_MESSAGES.TRANSACTION_NOT_FOUND, {
        transactionId,
      }),
      "TRANSACTION_NOT_FOUND",
      {
        statusCode: HttpStatusCodes.NOT_FOUND,
        errorType: ErrorType.NOT_FOUND_ERROR,
        shouldLog: false,
        isOperational: true,
        category: "NOT_FOUND",
      },
    );
  }

  static invalidTransactionType(type: string): DomainError {
    return new DomainError(
      formatMessage(TRANSACTION_ERROR_MESSAGES.INVALID_TRANSACTION_TYPE, {
        type,
      }),
      "INVALID_TRANSACTION_TYPE",
      {
        statusCode: HttpStatusCodes.BAD_REQUEST,
        errorType: ErrorType.VALIDATION_ERROR,
        shouldLog: false,
        isOperational: true,
        category: "VALIDATION",
      },
    );
  }

  static invalidTransactionDirection(direction: string): DomainError {
    return new DomainError(
      formatMessage(TRANSACTION_ERROR_MESSAGES.INVALID_TRANSACTION_DIRECTION, {
        direction,
      }),
      "INVALID_TRANSACTION_DIRECTION",
      {
        statusCode: HttpStatusCodes.BAD_REQUEST,
        errorType: ErrorType.VALIDATION_ERROR,
        shouldLog: false,
        isOperational: true,
        category: "VALIDATION",
      },
    );
  }

  static invalidOwnerType(ownerType: string): DomainError {
    return new DomainError(
      formatMessage(TRANSACTION_ERROR_MESSAGES.INVALID_OWNER_TYPE, {
        ownerType,
      }),
      "INVALID_OWNER_TYPE",
      {
        statusCode: HttpStatusCodes.BAD_REQUEST,
        errorType: ErrorType.VALIDATION_ERROR,
        shouldLog: false,
        isOperational: true,
        category: "VALIDATION",
      },
    );
  }

  static invalidDateField(fieldName: string): DomainError {
    return new DomainError(
      formatMessage(TRANSACTION_ERROR_MESSAGES.INVALID_DATE_FIELD, {
        fieldName,
      }),
      "INVALID_DATE_FIELD",
      {
        statusCode: HttpStatusCodes.BAD_REQUEST,
        errorType: ErrorType.VALIDATION_ERROR,
        shouldLog: false,
        isOperational: true,
        category: "VALIDATION",
      },
    );
  }

  static invalidDateRange(): DomainError {
    return new DomainError(
      TRANSACTION_ERROR_MESSAGES.INVALID_DATE_RANGE,
      "INVALID_DATE_RANGE",
      {
        statusCode: HttpStatusCodes.BAD_REQUEST,
        errorType: ErrorType.VALIDATION_ERROR,
        shouldLog: false,
        isOperational: true,
        category: "VALIDATION",
      },
    );
  }

  static invalidPaginationField(fieldName: string): DomainError {
    return new DomainError(
      formatMessage(TRANSACTION_ERROR_MESSAGES.INVALID_PAGINATION_FIELD, {
        fieldName,
      }),
      "INVALID_PAGINATION_FIELD",
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
