import { Email } from "@domain/value-objects/Email";
import { DomainError } from "@domain/errors/DomainError";

export class LoginRequestDto {
  public readonly email: Email;
  public readonly password: string;

  constructor(data: { email: string; password: string }) {
    if (!data.email) {
      throw new DomainError("Email is required");
    }

    if (!data.password) {
      throw new DomainError("Password is required");
    }

    this.email = Email.create(data.email);
    this.password = data.password;
  }

  getEmailValue(): string {
    return this.email.getValue();
  }

  getPassword(): string {
    return this.password;
  }
}
