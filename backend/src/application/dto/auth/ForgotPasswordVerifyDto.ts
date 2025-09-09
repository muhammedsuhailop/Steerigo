export class ForgotPasswordVerifyDto {
    public readonly email: string;
    public readonly otp: string;
    public readonly newPassword: string;

    constructor(data: { email: string, otp: string, newPassword: string }) {
        this.email = data.email;
        this.otp = data.otp;
        this.newPassword = data.newPassword;
    }
}
