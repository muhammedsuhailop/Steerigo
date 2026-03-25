import { PAYOUT_ERROR_MESSAGES } from "@shared/constants/PayoutMesages";
import { DomainError } from "./DomainError";
import { ErrorType } from "@shared/enums/ErrorType";
import { HttpStatusCodes } from "@shared/enums/HttpStatusCodes";
import { formatMessage } from "@shared/utils/errorMessageFormatter";

export class PayoutErrors {
  static payoutNotFound(payoutId: string): DomainError {
    return new DomainError(
      formatMessage(PAYOUT_ERROR_MESSAGES.PAYOUT_NOT_FOUND, { payoutId }),
      "PAYOUT_NOT_FOUND",
      {
        statusCode: HttpStatusCodes.NOT_FOUND,
        errorType: ErrorType.NOT_FOUND_ERROR,
        shouldLog: false,
        isOperational: true,
        category: "NOT_FOUND",
      },
    );
  }

  static payoutNotRequested(payoutId: string): DomainError {
    return new DomainError(
      formatMessage(PAYOUT_ERROR_MESSAGES.PAYOUT_NOT_REQUESTED, { payoutId }),
      "PAYOUT_NOT_REQUESTED",
      {
        statusCode: HttpStatusCodes.CONFLICT,
        errorType: ErrorType.CONFLICT_ERROR,
        shouldLog: false,
        isOperational: true,
        category: "CONFLICT",
      },
    );
  }

  static insufficientDriverBalance(
    available: string,
    requested: string,
  ): DomainError {
    return new DomainError(
      formatMessage(PAYOUT_ERROR_MESSAGES.INSUFFICIENT_DRIVER_BALANCE, {
        available,
        requested,
      }),
      "INSUFFICIENT_DRIVER_BALANCE",
      {
        statusCode: HttpStatusCodes.BAD_REQUEST,
        errorType: ErrorType.BUSINESS_ERROR,
        shouldLog: false,
        isOperational: true,
        category: "BUSINESS",
      },
    );
  }

  static driverWalletNotFound(driverId: string): DomainError {
    return new DomainError(
      formatMessage(PAYOUT_ERROR_MESSAGES.DRIVER_WALLET_NOT_FOUND, {
        driverId,
      }),
      "DRIVER_WALLET_NOT_FOUND",
      {
        statusCode: HttpStatusCodes.NOT_FOUND,
        errorType: ErrorType.NOT_FOUND_ERROR,
        shouldLog: false,
        isOperational: true,
        category: "NOT_FOUND",
      },
    );
  }

  static belowMinimumAmount(minimum: string, currency: string): DomainError {
    return new DomainError(
      formatMessage(PAYOUT_ERROR_MESSAGES.BELOW_MINIMUM_PAYOUT_AMOUNT, {
        minimum,
        currency,
      }),
      "BELOW_MINIMUM_PAYOUT_AMOUNT",
      {
        statusCode: HttpStatusCodes.BAD_REQUEST,
        errorType: ErrorType.VALIDATION_ERROR,
        shouldLog: false,
        isOperational: true,
        category: "VALIDATION",
      },
    );
  }

  static pendingPayoutExists(driverId: string): DomainError {
    return new DomainError(
      formatMessage(PAYOUT_ERROR_MESSAGES.PENDING_PAYOUT_EXISTS, { driverId }),
      "PENDING_PAYOUT_EXISTS",
      {
        statusCode: HttpStatusCodes.CONFLICT,
        errorType: ErrorType.CONFLICT_ERROR,
        shouldLog: false,
        isOperational: true,
        category: "CONFLICT",
      },
    );
  }

  static unauthorizedPayoutAccess(payoutId: string): DomainError {
    return new DomainError(
      formatMessage(PAYOUT_ERROR_MESSAGES.UNAUTHORIZED_PAYOUT_ACCESS, {
        payoutId,
      }),
      "UNAUTHORIZED_PAYOUT_ACCESS",
      {
        statusCode: HttpStatusCodes.FORBIDDEN,
        errorType: ErrorType.AUTHORIZATION_ERROR,
        shouldLog: false,
        isOperational: true,
        category: "AUTH",
      },
    );
  }
}
