import { AccountStatusError } from "../AccountStatusError";
import {
  AccountStatusMessageStrategy,
  SuspendedAccountStrategy,
  BlockedAccountStrategy,
  DeactivatedAccountStrategy,
  PendingVerificationStrategy,
  DefaultAccountStatusStrategy,
} from "../strategies/AccountStatusMessageStrategy";

export class AccountStatusErrorFactory {
  private static strategies: Map<string, AccountStatusMessageStrategy> =
    new Map([
      ["Suspended", new SuspendedAccountStrategy()],
      ["Blocked", new BlockedAccountStrategy()],
      ["Deactivated", new DeactivatedAccountStrategy()],
      ["Pending Verification", new PendingVerificationStrategy()],
    ]);

  static createError(status: string): AccountStatusError {
    const strategy =
      this.strategies.get(status) || new DefaultAccountStatusStrategy();
    const message = strategy.getMessage();
    return new AccountStatusError(message, status);
  }

  static registerStrategy(
    status: string,
    strategy: AccountStatusMessageStrategy
  ): void {
    this.strategies.set(status, strategy);
  }
}
