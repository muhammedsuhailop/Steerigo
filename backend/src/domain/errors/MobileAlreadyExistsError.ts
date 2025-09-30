import { DomainError } from "./DomainError";

export class MobileAlreadyExistsError extends DomainError {
  constructor() {
    super("This mobile number is already registered");
    this.name = "MobileAlreadyExistsError";
  }
}
