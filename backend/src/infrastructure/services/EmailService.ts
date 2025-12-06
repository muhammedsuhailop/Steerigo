import { injectable } from "inversify";
import nodemailer, { Transporter } from "nodemailer";
import { IEmailService } from "@application/services/IEmailService";
import { Logger } from "@shared/utils/Logger";

@injectable()
export class EmailService implements IEmailService {
  private transporter: Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: parseInt(process.env.EMAIL_PORT || "587"),
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }

  async sendVerificationOtp(
    email: string,
    otp: string,
    userName?: string
  ): Promise<void> {
    try {
      const mailOptions = {
        from: `"Steerigo" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: "Steerigo - Email Verification Code",
        html: this.getVerificationOtpTemplate(otp, userName),
      };

      await this.transporter.sendMail(mailOptions);
      Logger.info("Verification OTP email sent successfully", { email });
    } catch (error) {
      Logger.error("Failed to send verification OTP email", { email, error });
      throw new Error("Failed to send verification email");
    }
  }

  async sendPasswordResetOtp(
    email: string,
    otp: string,
    userName?: string
  ): Promise<void> {
    try {
      const mailOptions = {
        from: `"Steerigo" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: "Steerigo - Password Reset Code",
        html: this.getPasswordResetOtpTemplate(otp, userName),
      };

      await this.transporter.sendMail(mailOptions);
      Logger.info("Password reset OTP email sent successfully", { email });
    } catch (error) {
      Logger.error("Failed to send password reset OTP email", { email, error });
      throw new Error("Failed to send password reset email");
    }
  }

  async sendPasswordResetConfirmation(
    email: string,
    userName: string
  ): Promise<void> {
    try {
      const mailOptions = {
        from: `"Steerigo" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: "Steerigo - Password Reset Successful",
        html: this.getPasswordResetConfirmationTemplate(userName),
      };

      await this.transporter.sendMail(mailOptions);
      Logger.info("Password reset confirmation email sent successfully", {
        email,
      });
    } catch (error) {
      Logger.error("Failed to send password reset confirmation email", {
        email,
        error,
      });
      throw new Error("Failed to send confirmation email");
    }
  }

  async sendWelcomeEmail(email: string, userName: string): Promise<void> {
    try {
      const mailOptions = {
        from: `"Steerigo" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: "Welcome to Steerigo!",
        html: this.getWelcomeEmailTemplate(userName),
      };

      await this.transporter.sendMail(mailOptions);
      Logger.info("Welcome email sent successfully", { email });
    } catch (error) {
      Logger.error("Failed to send welcome email", { email, error });
      throw new Error("Failed to send welcome email");
    }
  }

  private getVerificationOtpTemplate(otp: string, userName?: string): string {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Email Verification</title>
        </head>
        <body>
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #2563eb;">Email Verification</h2>
            
            <p>Hi ${userName || "there"}!</p>
            
            <p>Your Steerigo verification code is:</p>
            
            <div style="background: #f3f4f6; padding: 20px; text-align: center; margin: 20px 0; border-radius: 8px;">
              <span style="font-size: 32px; font-weight: bold; letter-spacing: 4px; color: #2563eb;">${otp}</span>
            </div>
            
            <p>This code will expire in ${Math.floor(
              parseInt(process.env.OTP_TTL_SECONDS || "300") / 60
            )} minutes.</p>
            
            <p>If you didn't request this, please ignore this email.</p>
            
            <hr style="margin: 40px 0; border: none; border-top: 1px solid #e5e7eb;">
            
            <p style="color: #6b7280; font-size: 14px;">
              © 2025 Steerigo. All rights reserved.
            </p>
          </div>
        </body>
      </html>
    `;
  }

  private getPasswordResetOtpTemplate(otp: string, userName?: string): string {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Password Reset</title>
        </head>
        <body>
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #dc2626;">Password Reset Request</h2>
            
            <p>Hi ${userName || "there"}!</p>
            
            <p>You requested to reset your Steerigo password. Use the code below to continue:</p>
            
            <div style="background: #fef2f2; padding: 20px; text-align: center; margin: 20px 0; border-radius: 8px; border: 1px solid #fecaca;">
              <span style="font-size: 32px; font-weight: bold; letter-spacing: 4px; color: #dc2626;">${otp}</span>
            </div>
            
            <p>This code will expire in ${Math.floor(
              parseInt(process.env.OTP_TTL_SECONDS || "300") / 60
            )} minutes.</p>
            
            <p><strong>If you didn't request this password reset, please ignore this email and your password will remain unchanged.</strong></p>
            
            <hr style="margin: 40px 0; border: none; border-top: 1px solid #e5e7eb;">
            
            <p style="color: #6b7280; font-size: 14px;">
              © 2025 Steerigo. All rights reserved.
            </p>
          </div>
        </body>
      </html>
    `;
  }

  private getPasswordResetConfirmationTemplate(userName: string): string {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Password Reset Successful</title>
        </head>
        <body>
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #16a34a;">Password Reset Successful</h2>
            
            <p>Hi ${userName}!</p>
            
            <p>Your Steerigo password has been successfully reset.</p>
            
            <div style="background: #f0fdf4; padding: 20px; margin: 20px 0; border-radius: 8px; border: 1px solid #bbf7d0;">
              <p style="margin: 0; color: #16a34a;"><strong>✓ Your password has been updated</strong></p>
            </div>
            
            <p>You can now log in to your account using your new password.</p>
            
            <p><strong>If you did not make this change, please contact our support team immediately.</strong></p>
            
            <hr style="margin: 40px 0; border: none; border-top: 1px solid #e5e7eb;">
            
            <p style="color: #6b7280; font-size: 14px;">
              © 2025 Steerigo. All rights reserved.
            </p>
          </div>
        </body>
      </html>
    `;
  }

  private getWelcomeEmailTemplate(userName: string): string {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Welcome to Steerigo</title>
        </head>
        <body>
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #2563eb;">Welcome to Steerigo! 🎉</h2>
            
            <p>Hi ${userName}!</p>
            
            <p>Welcome to Steerigo! Your account has been successfully verified and you're all set to get started.</p>
            
            <div style="background: #eff6ff; padding: 20px; margin: 20px 0; border-radius: 8px; border: 1px solid #bfdbfe;">
              <h3 style="margin-top: 0; color: #2563eb;">What's Next?</h3>
              <ul style="margin: 0; padding-left: 20px;">
                <li>Complete your profile</li>
                <li>Explore available rides</li>
                <li>Book your first trip</li>
              </ul>
            </div>
            
            <p>If you have any questions, our support team is here to help.</p>
            
            <hr style="margin: 40px 0; border: none; border-top: 1px solid #e5e7eb;">
            
            <p style="color: #6b7280; font-size: 14px;">
              © 2025 Steerigo. All rights reserved.
            </p>
          </div>
        </body>
      </html>
    `;
  }
}
