import { IEmailService } from "../../application/services/IEmailService";
export declare class EmailService implements IEmailService {
    private resend;
    constructor();
    private sendEmail;
    sendVerificationOtp(email: string, otp: string, userName?: string): Promise<void>;
    sendPasswordResetOtp(email: string, otp: string, userName?: string): Promise<void>;
    sendPasswordResetConfirmation(email: string, userName: string): Promise<void>;
    sendWelcomeEmail(email: string, userName: string): Promise<void>;
    private getVerificationOtpTemplate;
    private getPasswordResetOtpTemplate;
    private getPasswordResetConfirmationTemplate;
    private getWelcomeEmailTemplate;
}
//# sourceMappingURL=EmailService.d.ts.map