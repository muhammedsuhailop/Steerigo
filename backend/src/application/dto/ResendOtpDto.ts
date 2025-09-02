export class ResendOtpDto {
    public readonly email: string;

    constructor(data: any) {
        this.email = data.email;
    }
}
