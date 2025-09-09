export class SignupVerifyDto {
    public readonly email: string;
    public readonly otp: string;

    constructor(data: { email: string, otp: string }) {
        this.email = data.email;
        this.otp = data.otp;
    }
}
