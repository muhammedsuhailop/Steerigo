import { Email } from "@domain/value-objects/Email";

export class SignupVerifyDto {
  private email: Email;
  private otp: string;

  constructor(data: { email: string; otp: string }) {
    this.email = Email.create(data.email);
    this.otp = data.otp;
  }

  static fromRequest(data: { email: string; otp: string }): SignupVerifyDto {
    return new SignupVerifyDto(data);
  }

  getEmail(): string {
    return this.email.getValue();
  }

  getOtp(): string {
    return this.otp;
  }
}
