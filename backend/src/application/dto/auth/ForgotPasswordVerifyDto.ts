import { Email } from "@domain/value-objects/Email";

export class ForgotPasswordVerifyDto {
  private email: Email;
  private otp: string;
  private newPassword: string;

  constructor(data: { email: string; otp: string; newPassword: string }) {
    this.email = Email.create(data.email);
    this.otp = data.otp;
    this.newPassword = data.newPassword;
  }

  static fromRequest(data: {
    email: string;
    otp: string;
    newPassword: string;
  }): ForgotPasswordVerifyDto {
    return new ForgotPasswordVerifyDto(data);
  }

  getEmail(): string {
    return this.email.getValue();
  }

  getOtp(): string {
    return this.otp;
  }

  getNewPassword(): string {
    return this.newPassword;
  }
}
