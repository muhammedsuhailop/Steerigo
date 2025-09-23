import { DomainError } from "./DomainError";

export class AccountStatusError extends DomainError {
  constructor(status: string) {
    let message: string;

    switch (status) {
      case "Suspended":
        message = "Your account has been suspended. Please contact support.";
        break;
      case "Blocked":
        message = "Your account has been blocked. Please contact support.";
        break;
      case "Deactivated":
        message =
          "Your account has been deactivated. Please contact support to reactivate.";
        break;
      case "Pending Verification":
        message = "Please verify your email address before logging in.";
        break;
      default:
        message = "Your account is not active. Please contact support.";
    }

    super(message);
    this.name = "AccountStatusError";
  }
}
