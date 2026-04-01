import { DomainError } from "./DomainError";
import { ErrorType } from "@shared/enums/ErrorType";
import { HttpStatusCodes } from "@shared/enums/HttpStatusCodes";
import { formatMessage } from "@shared/utils/errorMessageFormatter";
import { COUPON_ERROR_MESSAGES } from "@shared/constants/CouponMessages";

export class CouponErrors {
  static couponNotFound(couponId: string): DomainError {
    return new DomainError(
      formatMessage(COUPON_ERROR_MESSAGES.COUPON_NOT_FOUND, { couponId }),
      "COUPON_NOT_FOUND",
      {
        statusCode: HttpStatusCodes.NOT_FOUND,
        errorType: ErrorType.NOT_FOUND_ERROR,
        shouldLog: false,
        isOperational: true,
        category: "NOT_FOUND",
      },
    );
  }

  static couponCodeAlreadyExists(code: string): DomainError {
    return new DomainError(
      formatMessage(COUPON_ERROR_MESSAGES.COUPON_CODE_EXISTS, { code }),
      "COUPON_CODE_EXISTS",
      {
        statusCode: HttpStatusCodes.CONFLICT,
        errorType: ErrorType.CONFLICT_ERROR,
        shouldLog: false,
        isOperational: true,
        category: "CONFLICT",
      },
    );
  }

  static invalidDiscountValue(reason: string): DomainError {
    return new DomainError(
      formatMessage(COUPON_ERROR_MESSAGES.INVALID_DISCOUNT_VALUE, { reason }),
      "INVALID_DISCOUNT_VALUE",
      {
        statusCode: HttpStatusCodes.BAD_REQUEST,
        errorType: ErrorType.VALIDATION_ERROR,
        shouldLog: false,
        isOperational: true,
        category: "VALIDATION",
      },
    );
  }

  static invalidDiscountType(discountType: string): DomainError {
    return new DomainError(
      formatMessage(COUPON_ERROR_MESSAGES.INVALID_DISCOUNT_TYPE, {
        discountType,
      }),
      "INVALID_DISCOUNT_TYPE",
      {
        statusCode: HttpStatusCodes.BAD_REQUEST,
        errorType: ErrorType.VALIDATION_ERROR,
        shouldLog: false,
        isOperational: true,
        category: "VALIDATION",
      },
    );
  }

  static invalidValidityPeriod(): DomainError {
    return new DomainError(
      COUPON_ERROR_MESSAGES.INVALID_VALIDITY_PERIOD,
      "INVALID_VALIDITY_PERIOD",
      {
        statusCode: HttpStatusCodes.BAD_REQUEST,
        errorType: ErrorType.VALIDATION_ERROR,
        shouldLog: false,
        isOperational: true,
        category: "VALIDATION",
      },
    );
  }

  static invalidCouponData(reason: string): DomainError {
    return new DomainError(
      formatMessage(COUPON_ERROR_MESSAGES.INVALID_COUPON_DATA, { reason }),
      "INVALID_COUPON_DATA",
      {
        statusCode: HttpStatusCodes.BAD_REQUEST,
        errorType: ErrorType.VALIDATION_ERROR,
        shouldLog: false,
        isOperational: true,
        category: "VALIDATION",
      },
    );
  }

  static couponNotValid(code: string): DomainError {
    return new DomainError(
      formatMessage(COUPON_ERROR_MESSAGES.COUPON_NOT_VALID, { code }),
      "COUPON_NOT_VALID",
      {
        statusCode: HttpStatusCodes.BAD_REQUEST,
        errorType: ErrorType.VALIDATION_ERROR,
        shouldLog: false,
        isOperational: true,
        category: "VALIDATION",
      },
    );
  }

  static minimumAmountNotSatisfied(
    minAmount: number,
    rideAmount: number,
  ): DomainError {
    return new DomainError(
      formatMessage(COUPON_ERROR_MESSAGES.MINIMUM_AMOUNT_NOT_SATISFIED, {
        minAmount: String(minAmount),
        rideAmount: String(rideAmount),
      }),
      "MINIMUM_AMOUNT_NOT_SATISFIED",
      {
        statusCode: HttpStatusCodes.BAD_REQUEST,
        errorType: ErrorType.VALIDATION_ERROR,
        shouldLog: false,
        isOperational: true,
        category: "VALIDATION",
      },
    );
  }

  static couponAlreadyAppliedToRide(rideId: string): DomainError {
    return new DomainError(
      formatMessage(COUPON_ERROR_MESSAGES.COUPON_ALREADY_APPLIED, { rideId }),
      "COUPON_ALREADY_APPLIED",
      {
        statusCode: HttpStatusCodes.CONFLICT,
        errorType: ErrorType.CONFLICT_ERROR,
        shouldLog: false,
        isOperational: true,
        category: "CONFLICT",
      },
    );
  }

  static cannotApplyCouponAfterPayment(rideId: string): DomainError {
    return new DomainError(
      formatMessage(COUPON_ERROR_MESSAGES.CANNOT_APPLY_COUPON_AFTER_PAYMENT, {
        rideId,
      }),
      "CANNOT_APPLY_COUPON_AFTER_PAYMENT",
      {
        statusCode: HttpStatusCodes.BAD_REQUEST,
        errorType: ErrorType.VALIDATION_ERROR,
        shouldLog: false,
        isOperational: true,
        category: "VALIDATION",
      },
    );
  }

  static couponUsageLimitExceeded(code: string): DomainError {
    return new DomainError(
      formatMessage(COUPON_ERROR_MESSAGES.COUPON_USAGE_LIMIT_EXCEEDED, {
        code,
      }),
      "COUPON_USAGE_LIMIT_EXCEEDED",
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
