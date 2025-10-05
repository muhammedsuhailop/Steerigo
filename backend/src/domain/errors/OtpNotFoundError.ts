import { DomainError } from "./DomainError";
import { AuthErrorMessages } from "@shared/constants/AuthConstants";

export class OtpNotFoundError extends DomainError {
  constructor() {
    super(AuthErrorMessages.OTP_NOT_FOUND);
    this.name = "OtpNotFoundError";
  }
}
