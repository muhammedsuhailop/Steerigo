import { AuthMessages } from "@shared/constants/AuthConstants";

export interface AccountStatusMessageStrategy {
  getMessage(): string;
}

export class SuspendedAccountStrategy implements AccountStatusMessageStrategy {
  getMessage(): string {
    return AuthMessages.ACCOUNT_SUSPENDED;
  }
}

export class BlockedAccountStrategy implements AccountStatusMessageStrategy {
  getMessage(): string {
    return AuthMessages.ACCOUNT_BLOCKED;
  }
}

export class DeactivatedAccountStrategy
  implements AccountStatusMessageStrategy
{
  getMessage(): string {
    return AuthMessages.ACCOUNT_DEACTIVATED;
  }
}

export class PendingVerificationStrategy
  implements AccountStatusMessageStrategy
{
  getMessage(): string {
    return AuthMessages.ACCOUNT_NOT_VERIFIED;
  }
}

export class DefaultAccountStatusStrategy
  implements AccountStatusMessageStrategy
{
  getMessage(): string {
    return AuthMessages.ACCOUNT_DEFAULT;
  }
}
