import { PAYMENT_ERROR_MESSAGES } from "@shared/constants/PaymentMessages";
import { DomainError } from "./DomainError";
import { ErrorType } from "@shared/enums/ErrorType";
import { HttpStatusCodes } from "@shared/enums/HttpStatusCodes";
import { formatMessage } from "@shared/utils/errorMessageFormatter";

export class PaymentErrors {
  static rideNotCompleted(rideId: string): DomainError {
    return new DomainError(
      formatMessage(PAYMENT_ERROR_MESSAGES.RIDE_NOT_COMPLETED, { rideId }),
      "RIDE_NOT_COMPLETED",
      {
        statusCode: HttpStatusCodes.BAD_REQUEST,
        errorType: ErrorType.VALIDATION_ERROR,
        shouldLog: false,
        isOperational: true,
        category: "VALIDATION",
      },
    );
  }

  static paymentAlreadyExists(rideId: string): DomainError {
    return new DomainError(
      formatMessage(PAYMENT_ERROR_MESSAGES.PAYMENT_ALREADY_EXISTS, { rideId }),
      "PAYMENT_ALREADY_EXISTS",
      {
        statusCode: HttpStatusCodes.CONFLICT,
        errorType: ErrorType.CONFLICT_ERROR,
        shouldLog: false,
        isOperational: true,
        category: "CONFLICT",
      },
    );
  }

  static paymentNotFound(paymentId: string): DomainError {
    return new DomainError(
      formatMessage(PAYMENT_ERROR_MESSAGES.PAYMENT_NOT_FOUND, { paymentId }),
      "PAYMENT_NOT_FOUND",
      {
        statusCode: HttpStatusCodes.NOT_FOUND,
        errorType: ErrorType.NOT_FOUND_ERROR,
        shouldLog: false,
        isOperational: true,
        category: "NOT_FOUND",
      },
    );
  }

  static paymentNotPending(paymentId: string): DomainError {
    return new DomainError(
      formatMessage(PAYMENT_ERROR_MESSAGES.PAYMENT_NOT_PENDING, { paymentId }),
      "PAYMENT_NOT_PENDING",
      {
        statusCode: HttpStatusCodes.CONFLICT,
        errorType: ErrorType.CONFLICT_ERROR,
        shouldLog: false,
        isOperational: true,
        category: "CONFLICT",
      },
    );
  }

  static invalidSignature(): DomainError {
    return new DomainError(
      PAYMENT_ERROR_MESSAGES.INVALID_PAYMENT_SIGNATURE,
      "INVALID_PAYMENT_SIGNATURE",
      {
        statusCode: HttpStatusCodes.BAD_REQUEST,
        errorType: ErrorType.VALIDATION_ERROR,
        shouldLog: true,
        isOperational: true,
        category: "SECURITY",
      },
    );
  }

  static insufficientWalletBalance(
    available: string,
    required: string,
  ): DomainError {
    return new DomainError(
      formatMessage(PAYMENT_ERROR_MESSAGES.INSUFFICIENT_WALLET_BALANCE, {
        available,
        required,
      }),
      "INSUFFICIENT_WALLET_BALANCE",
      {
        statusCode: HttpStatusCodes.BAD_REQUEST,
        errorType: ErrorType.BUSINESS_ERROR,
        shouldLog: false,
        isOperational: true,
        category: "BUSINESS",
      },
    );
  }

  static walletNotFound(ownerId: string): DomainError {
    return new DomainError(
      formatMessage(PAYMENT_ERROR_MESSAGES.WALLET_NOT_FOUND, { ownerId }),
      "WALLET_NOT_FOUND",
      {
        statusCode: HttpStatusCodes.NOT_FOUND,
        errorType: ErrorType.NOT_FOUND_ERROR,
        shouldLog: false,
        isOperational: true,
        category: "NOT_FOUND",
      },
    );
  }

  static unauthorizedPaymentAccess(paymentId: string): DomainError {
    return new DomainError(
      formatMessage(PAYMENT_ERROR_MESSAGES.UNAUTHORIZED_PAYMENT_ACCESS, {
        paymentId,
      }),
      "UNAUTHORIZED_PAYMENT_ACCESS",
      {
        statusCode: HttpStatusCodes.FORBIDDEN,
        errorType: ErrorType.AUTHORIZATION_ERROR,
        shouldLog: false,
        isOperational: true,
        category: "AUTH",
      },
    );
  }

  static invalidPaymentMethod(method: string): DomainError {
    return new DomainError(
      formatMessage(PAYMENT_ERROR_MESSAGES.INVALID_PAYMENT_METHOD, { method }),
      "INVALID_PAYMENT_METHOD",
      {
        statusCode: HttpStatusCodes.BAD_REQUEST,
        errorType: ErrorType.VALIDATION_ERROR,
        shouldLog: false,
        isOperational: true,
        category: "VALIDATION",
      },
    );
  }

  static cashConfirmationUnauthorized(rideId: string): DomainError {
    return new DomainError(
      formatMessage(PAYMENT_ERROR_MESSAGES.CASH_CONFIRMATION_UNAUTHORIZED, {
        rideId,
      }),
      "CASH_CONFIRMATION_UNAUTHORIZED",
      {
        statusCode: HttpStatusCodes.FORBIDDEN,
        errorType: ErrorType.AUTHORIZATION_ERROR,
        shouldLog: false,
        isOperational: true,
        category: "AUTH",
      },
    );
  }

  static invalidPaymentAmount(expected: string, received: string): DomainError {
    return new DomainError(
      formatMessage(PAYMENT_ERROR_MESSAGES.INVALID_PAYMENT_AMOUNT, {
        expected,
        received,
      }),
      "INVALID_PAYMENT_AMOUNT",
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
