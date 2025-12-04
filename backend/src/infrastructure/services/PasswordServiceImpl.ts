import { injectable, inject } from "inversify";
import { IPasswordService } from "@application/services/IPasswordService";
import { CryptoAdapter } from "@infrastructure/adapters/CryptoAdapter";
import { AppConstants } from "@shared/constants/AppConstants";
import { Logger } from "@shared/utils/Logger";
import { TYPES } from "@shared/constants/DITypes";

@injectable()
export class PasswordServiceImpl implements IPasswordService {
  constructor(
    @inject(TYPES.CryptoAdapter) private cryptoAdapter: CryptoAdapter
  ) {}

  async hash(password: string): Promise<string> {
    try {
      if (!password) {
        throw new Error("Password cannot be empty");
      }

      const hashedPassword = await this.cryptoAdapter.hash(
        password,
        AppConstants.BCRYPT_ROUNDS
      );
      Logger.debug("Password hashed successfully");
      return hashedPassword;
    } catch (error) {
      Logger.error("Error hashing password", error);
      throw new Error("Failed to hash password");
    }
  }

  async compare(password: string, hashedPassword: string): Promise<boolean> {
    try {
      if (!password || !hashedPassword) {
        return false;
      }

      const isMatch = await this.cryptoAdapter.compare(
        password,
        hashedPassword
      );
      Logger.debug("Password comparison completed", { isMatch });
      return isMatch;
    } catch (error) {
      Logger.error("Error comparing password", error);
      throw new Error("Failed to compare password");
    }
  }

  generateTemporaryPassword(): string {
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@$!%*?&";
    let password = "";

    // Ensure at least one character from each required category
    password += this.getRandomChar("ABCDEFGHIJKLMNOPQRSTUVWXYZ"); // uppercase
    password += this.getRandomChar("abcdefghijklmnopqrstuvwxyz"); // lowercase
    password += this.getRandomChar("0123456789"); // number
    password += this.getRandomChar("@$!%*?&"); // special char

    // Fill the rest randomly
    for (let i = password.length; i < 12; i++) {
      password += this.getRandomChar(chars);
    }

    // Shuffle the password
    return password
      .split("")
      .sort(() => Math.random() - 0.5)
      .join("");
  }

  validatePasswordStrength(password: string): boolean {
    if (!password || password.length < 8) return false;

    const hasLowerCase = /[a-z]/.test(password);
    const hasUpperCase = /[A-Z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecialChar = /[@$!%*?&]/.test(password);

    return hasLowerCase && hasUpperCase && hasNumber && hasSpecialChar;
  }

  private getRandomChar(chars: string): string {
    return chars.charAt(Math.floor(Math.random() * chars.length));
  }
}
