import { DomainError } from "./DomainError";

export class AccountStatusError extends DomainError {
  constructor(
    message: string,
    public readonly status: string
  ) {
    super(message);
    this.name = "AccountStatusError";
  }
}
