import { Email } from "@domain/value-objects/Email";

export class ForgotPasswordRequestDto {
  private email: Email;

  constructor(data: { email: string }) {
    this.email = Email.create(data.email);
  }

  getEmail(): string {
    return this.email.getValue();
  }
}
