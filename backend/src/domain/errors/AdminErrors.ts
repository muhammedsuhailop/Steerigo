import { DomainError } from "./DomainError";

export class AdminUserNotFoundError extends DomainError {
  constructor(userId?: string) {
    super(`User not found${userId ? ` with ID: ${userId}` : ""}`);
  }
}

export class AdminInvalidActionError extends DomainError {
  constructor(action: string) {
    super(`Invalid admin action: ${action}`);
  }
}

export class AdminUnauthorizedActionError extends DomainError {
  constructor(action: string, reason?: string) {
    super(
      `Unauthorized to perform action: ${action}${reason ? `. ${reason}` : ""}`
    );
  }
}
