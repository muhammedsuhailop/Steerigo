import { KYC_ERROR_MESSAGES } from "@shared/constants/DriverMessages";
import { DomainError } from "./DomainError";
import { ErrorType } from "@shared/enums/ErrorType";
import { HttpStatusCodes } from "@shared/enums/HttpStatusCodes";

export class KYCNotFoundError extends DomainError {
  constructor(message: string = KYC_ERROR_MESSAGES.KYC_NOT_FOUND) {
    super(message, "KYC_NOT_FOUND", {
      statusCode: HttpStatusCodes.NOT_FOUND,
      errorType: ErrorType.NOT_FOUND_ERROR,
      shouldLog: false,
      isOperational: true,
      category: "NOT_FOUND",
    });

    this.name = "KYCNotFoundError";
  }
}

export class ProfilePictureNotUploadedError extends DomainError {
  constructor(
    message: string = KYC_ERROR_MESSAGES.PROFILE_PICTURE_NOT_UPLOADED,
  ) {
    super(message, "PROFILE_PICTURE_NOT_UPLOADED", {
      statusCode: HttpStatusCodes.BAD_REQUEST,
      errorType: ErrorType.VALIDATION_ERROR,
      shouldLog: false,
      isOperational: true,
      category: "VALIDATION",
    });

    this.name = "ProfilePictureNotUploadedError";
  }
}

export class LicenseNotApprovedError extends DomainError {
  constructor(message: string = KYC_ERROR_MESSAGES.LICENSE_NOT_APPROVED) {
    super(message, "LICENSE_NOT_APPROVED", {
      statusCode: HttpStatusCodes.BAD_REQUEST,
      errorType: ErrorType.VALIDATION_ERROR,
      shouldLog: false,
      isOperational: true,
      category: "VALIDATION",
    });

    this.name = "LicenseNotApprovedError";
  }
}

export class NonLicenseKYCNotApprovedError extends DomainError {
  constructor(
    message: string = KYC_ERROR_MESSAGES.NON_LICENSE_KYC_NOT_APPROVED,
  ) {
    super(message, "NON_LICENSE_KYC_NOT_APPROVED", {
      statusCode: HttpStatusCodes.BAD_REQUEST,
      errorType: ErrorType.VALIDATION_ERROR,
      shouldLog: false,
      isOperational: true,
      category: "VALIDATION",
    });

    this.name = "NonLicenseKYCNotApprovedError";
  }
}

export class InvalidKYCStatusTransitionError extends DomainError {
  constructor(
    message: string = KYC_ERROR_MESSAGES.INVALID_KYC_STATUS_TRANSITION,
  ) {
    super(message, "INVALID_KYC_STATUS_TRANSITION", {
      statusCode: HttpStatusCodes.BAD_REQUEST,
      errorType: ErrorType.VALIDATION_ERROR,
      shouldLog: false,
      isOperational: true,
      category: "VALIDATION",
    });

    this.name = "InvalidKYCStatusTransitionError";
  }
}
