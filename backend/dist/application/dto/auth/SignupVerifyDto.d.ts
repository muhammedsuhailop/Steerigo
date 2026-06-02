export declare class SignupVerifyDto {
    private email;
    private otp;
    constructor(data: {
        email: string;
        otp: string;
    });
    static fromRequest(data: {
        email: string;
        otp: string;
    }): SignupVerifyDto;
    getEmail(): string;
    getOtp(): string;
}
//# sourceMappingURL=SignupVerifyDto.d.ts.map