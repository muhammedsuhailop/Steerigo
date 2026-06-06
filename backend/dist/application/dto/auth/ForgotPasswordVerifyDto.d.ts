export declare class ForgotPasswordVerifyDto {
    private email;
    private otp;
    private newPassword;
    constructor(data: {
        email: string;
        otp: string;
        newPassword: string;
    });
    static fromRequest(data: {
        email: string;
        otp: string;
        newPassword: string;
    }): ForgotPasswordVerifyDto;
    getEmail(): string;
    getOtp(): string;
    getNewPassword(): string;
}
//# sourceMappingURL=ForgotPasswordVerifyDto.d.ts.map