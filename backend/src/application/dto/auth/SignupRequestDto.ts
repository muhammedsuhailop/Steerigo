import { Email } from "@domain/value-objects/Email";
import { UserRole } from "@shared/constants/AuthConstants";

export class SignupRequestDto {
  private email: Email;
  private name: string;
  private password: string;
  private mobile: string;
  private role: UserRole;

  constructor(data: {
    email: string;
    name: string;
    password: string;
    mobile: string;
    role: UserRole;
  }) {
    this.email = Email.create(data.email);
    this.name = data.name;
    this.password = data.password;
    this.mobile = data.mobile;
    this.role = data.role;
  }

  static fromRequest(data: {
    email: string;
    name: string;
    password: string;
    mobile: string;
    role: UserRole;
  }): SignupRequestDto {
    return new SignupRequestDto(data);
  }

  getEmailValue(): string {
    return this.email.getValue();
  }

  getName(): string {
    return this.name;
  }

  getPassword(): string {
    return this.password;
  }

  getMobile(): string {
    return this.mobile;
  }

  getRole(): UserRole {
    return this.role;
  }
}
