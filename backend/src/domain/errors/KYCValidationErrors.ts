import { DomainError } from "./DomainError";

export class KYCNotFoundError extends DomainError {
  constructor(message: string = "KYC document not found") {
    super(message);
    this.name = "KYCNotFoundError";
  }
}

export class ProfilePictureNotUploadedError extends DomainError {
  constructor(
    message: string = "Profile picture is required for KYC approval"
  ) {
    super(message);
    this.name = "ProfilePictureNotUploadedError";
  }
}

export class LicenseNotApprovedError extends DomainError {
  constructor(
    message: string = "Latest license must be approved before updating driver KYC status"
  ) {
    super(message);
    this.name = "LicenseNotApprovedError";
  }
}

export class NonLicenseKYCNotApprovedError extends DomainError {
  constructor(
    message: string = "At least one non-license KYC document (Aadhaar, PAN, or Passport) must be approved"
  ) {
    super(message);
    this.name = "NonLicenseKYCNotApprovedError";
  }
}

export class InvalidKYCStatusTransitionError extends DomainError {
  constructor(message: string = "Invalid KYC status transition") {
    super(message);
    this.name = "InvalidKYCStatusTransitionError";
  }
}
