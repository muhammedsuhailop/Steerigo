import { DomainError } from "./DomainError";

export class UserNotFoundError extends DomainError {
  constructor(userId: string) {
    super(`User not found with ID: ${userId}`);
    this.name = "UserNotFoundError";
  }
}

export class DriverProfileNotFoundError extends DomainError {
  constructor(userId: string) {
    super(`Driver profile not found for user ID: ${userId}`);
    this.name = "DriverProfileNotFoundError";
  }
}

export class KycDocumentNotFoundError extends DomainError {
  constructor(driverId: string, docType?: string) {
    const message = docType
      ? `KYC document of type '${docType}' not found for driver ID: ${driverId}`
      : `KYC documents not found for driver ID: ${driverId}`;
    super(message);
    this.name = "KycDocumentNotFoundError";
  }
}

export class ResourceNotFoundError extends DomainError {
  constructor(resource: string, identifier: string) {
    super(`${resource} not found: ${identifier}`);
    this.name = "ResourceNotFoundError";
  }
}

export class DriverAccessDeniedError extends DomainError {
  constructor(userId: string, reason: string) {
    super(`Access denied for driver ${userId}: ${reason}`);
    this.name = "DriverAccessDeniedError";
  }
}
