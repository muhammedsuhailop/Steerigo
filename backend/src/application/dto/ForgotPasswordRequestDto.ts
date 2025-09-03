export class ForgotPasswordRequestDto {
    public readonly email: string;

    constructor(data: any) {
        this.email = data.email;
    }
}