import { DomainError } from "./DomainError";

export class PasswordResetError extends DomainError {
  constructor(message: string = "Password reset failed") {
    super(message);
    this.name = "PasswordResetError";
  }
}
