export class ForgotPasswordRequestDto {
    public readonly email: string;

    constructor(data: { email: string }) {
        this.email = data.email;
    }
}