export class SignupVerifyDto {
    public readonly email: string;
    public readonly otp: string;

    constructor(data: any) {
        this.email = data.email;
        this.otp = data.otp;
    }
}
