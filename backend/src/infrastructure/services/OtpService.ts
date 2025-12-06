import { injectable } from "inversify";
import otpGenerator from "otp-generator";
import bcrypt from "bcrypt";
import { IOtpService } from "@application/services/IOtpService";
import { AppConstants } from "@shared/constants/AppConstants";
import { Logger } from "@shared/utils/Logger";

@injectable()
export class OtpService implements IOtpService {
  generate(): string {
    try {
      const otp = otpGenerator.generate(AppConstants.OTP_LENGTH, {
        digits: true,
        lowerCaseAlphabets: false,
        upperCaseAlphabets: false,
        specialChars: false,
      });
      Logger.debug("OTP generated successfully");
      return otp;
    } catch (error) {
      Logger.error("Error generating OTP", error);
      throw new Error("Failed to generate OTP");
    }
  }

  async hash(otp: string): Promise<string> {
    try {
      const hashedOtp = await bcrypt.hash(otp, AppConstants.BCRYPT_ROUNDS);
      Logger.debug("OTP hashed successfully");
      return hashedOtp;
    } catch (error) {
      Logger.error("Error hashing OTP", error);
      throw new Error("Failed to hash OTP");
    }
  }

  async verify(otp: string, hashedOtp: string): Promise<boolean> {
    try {
      const isValid = await bcrypt.compare(otp, hashedOtp);
      Logger.debug("OTP verification completed", { isValid });
      return isValid;
    } catch (error) {
      Logger.error("Error verifying OTP", error);
      throw new Error("Failed to verify OTP");
    }
  }

  isExpired(
    createdAt: Date,
    ttlSeconds: number = AppConstants.OTP_TTL_SECONDS
  ): boolean {
    const expiryTime = new Date(createdAt.getTime() + ttlSeconds * 1000);
    return new Date() > expiryTime;
  }
}
