import { Email } from "@domain/value-objects/Email";
import { da } from "zod/v4/locales";

export class ResendOtpDto {
  private email: Email;

  constructor(data: { email: string }) {
    this.email = Email.create(data.email);
  }

  static fromRequest(data: { email: string }): ResendOtpDto {
    return new ResendOtpDto(data);
  }

  getEmail(): string {
    return this.email.getValue();
  }
}
