import { DomainError } from "../errors/DomainError";

export class Password {
  private readonly hashedValue: string;

  private constructor(hashedValue: string) {
    this.hashedValue = hashedValue;
  }

  static createFromPlainText(plainText: string): Password {
    if (!plainText) {
      throw new DomainError("Password is required");
    }

    if (plainText.length < 8) {
      throw new DomainError("Password must be at least 8 characters long");
    }

    if (plainText.length > 128) {
      throw new DomainError("Password must be less than 128 characters");
    }

    if (!this.isStrongPassword(plainText)) {
      throw new DomainError(
        "Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character"
      );
    }

    // will be hashed in application layer
    return new Password(plainText);
  }

  static createFromHash(hashedValue: string): Password {
    if (!hashedValue) {
      throw new DomainError("Hashed password cannot be empty");
    }
    return new Password(hashedValue);
  }

  static createEmpty(): Password {
    return new Password("DUMMY_HASH_ALLOWED_EMPTY_HASH");
  }

  private static isStrongPassword(password: string): boolean {
    const hasLowerCase = /[a-z]/.test(password);
    const hasUpperCase = /[A-Z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecialChar = /[@$!%*?&]/.test(password);

    return hasLowerCase && hasUpperCase && hasNumber && hasSpecialChar;
  }

  getHashedValue(): string {
    return this.hashedValue;
  }

  isHashed(): boolean {
    return this.hashedValue.length >= 60 && this.hashedValue.startsWith("$");
  }
}
