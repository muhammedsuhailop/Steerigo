export class ResendOtpDto {
    public readonly email: string;

    constructor(data: { email: string }) {
        this.email = data.email;
    }
}
