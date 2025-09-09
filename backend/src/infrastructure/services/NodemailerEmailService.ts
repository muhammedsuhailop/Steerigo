import { injectable } from 'inversify';
import nodemailer, { Transporter } from 'nodemailer';
import { IEmailService } from '@domain/services/IEmailService';
import { Logger } from '@shared/utils/Logger';

@injectable()
export class NodemailerEmailService implements IEmailService {
    private transporter: Transporter;

    constructor() {
        this.transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: parseInt(process.env.EMAIL_PORT || '587'),
            secure: false,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });
    }


    async sendOtp(email: string, otp: string): Promise<void> {
        try {
            const mailOptions = {
                from: `"SteeriGo" <${process.env.EMAIL_USER}>`,
                to: email,
                subject: 'SteeriGo - Email Verification OTP',
                html: this.getOtpEmailTemplate(otp)
            };

            await this.transporter.sendMail(mailOptions);
            Logger.info('OTP email sent successfully', { email });
            Logger.info('OTP :', { otp })
        } catch (error) {
            Logger.error('Failed to send OTP email', { email, error });
            throw new Error('Failed to send verification email');
        }
    }

    async sendResendOtp(email: string, otp: string): Promise<void> {
        try {
            const mailOptions = {
                from: `"SteeriGo" <${process.env.EMAIL_USER}>`,
                to: email,
                subject: 'SteeriGo - New Verification OTP',
                html: this.getOtpEmailTemplate(otp)
            };

            await this.transporter.sendMail(mailOptions);
            Logger.info('Resend OTP email sent successfully', { email });
        } catch (error) {
            Logger.error('Failed to send resend OTP email', { email, error });
            throw new Error('Failed to send verification email');
        }
    }

    async sendPasswordResetOtp(email: string, otp: string, userName: string): Promise<void> {
        try {
            const mailOptions = {
                from: `"SteeriGo" <${process.env.EMAIL_USER}>`,
                to: email,
                subject: 'SteeriGo - Password Reset OTP',
                html: this.getOtpEmailTemplate(otp)
            };

            await this.transporter.sendMail(mailOptions);
            Logger.info('Password reset OTP email sent successfully', { email });
        } catch (error) {
            Logger.error('Failed to send password reset OTP email', { email, error });
            throw new Error('Failed to send password reset email');
        }
    }

    private getOtpEmailTemplate(otp: string): string {
        return `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <title>Email Verification</title>
        </head>
        <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 20px;">
            <div style="max-width: 600px; margin: 0 auto; background-color: white; padding: 30px; border-radius: 10px;">
                <h2 style="color: #333; text-align: center;">Email Verification</h2>
                <p style="color: #666; font-size: 16px;">Hi there!</p>
                <p style="color: #666; font-size: 16px;">Your SteeriGo signup verification code is:</p>
                <div style="text-align: center; margin: 30px 0;">
                    <span style="background-color: #007bff; color: white; padding: 15px 30px; font-size: 24px; font-weight: bold; border-radius: 5px; display: inline-block; letter-spacing: 2px;">${otp}</span>
                </div>
                <p style="color: #666; font-size: 14px;">This code will expire in ${Math.floor(parseInt(process.env.OTP_TTL_SECONDS || '300') / 60)} minutes.</p>
                <p style="color: #666; font-size: 14px;">If you didn't request this, please ignore this email.</p>
                <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
                <p style="color: #999; font-size: 12px; text-align: center;">© 2025 SteeriGo. All rights reserved.</p>
            </div>
        </body>
        </html>
        `;
    }
}
