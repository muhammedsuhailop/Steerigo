import { DomainError } from "./DomainError";
import { AuthErrorMessages } from "@shared/constants/AuthConstants";

export class EmailNotVerifiedError extends DomainError {
  constructor() {
    super(AuthErrorMessages.EMAIL_NOT_VERIFIED);
    this.name = "EmailNotVerifiedError";
  }
}
