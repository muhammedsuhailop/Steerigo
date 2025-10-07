import { DomainError } from "../errors/DomainError";

export class Email {
  private readonly value: string;

  private constructor(value: string) {
    this.value = value;
  }

  static create(email: string): Email {
    if (!email) {
      throw new DomainError("Email is required");
    }

    const trimmedEmail = email.trim();

    if (!this.isValid(trimmedEmail)) {
      throw new DomainError("Invalid email format");
    }

    if (trimmedEmail.length > 255) {
      throw new DomainError("Email must be less than 255 characters");
    }

    return new Email(trimmedEmail.toLowerCase());
  }

  private static isValid(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  getValue(): string {
    return this.value;
  }

  equals(other: Email): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }
}
