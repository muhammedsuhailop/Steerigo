export interface EmailService {
  sendVerificationOtp(
    email: string,
    otp: string,
    userName?: string
  ): Promise<void>;
  sendPasswordResetOtp(
    email: string,
    otp: string,
    userName?: string
  ): Promise<void>;
  sendPasswordResetConfirmation(email: string, userName: string): Promise<void>;
  sendWelcomeEmail(email: string, userName: string): Promise<void>;
}
