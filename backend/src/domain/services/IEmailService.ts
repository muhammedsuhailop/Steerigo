export interface IEmailService {
    sendOtp(email: string, otp: string): Promise<void>;
    sendResendOtp(email: string, otp: string): Promise<void>;
    sendPasswordResetOtp(email: string, otp: string, userName: string): Promise<void>;
}
