export class LoginDto {
    public readonly email: string;
    public readonly password: string;

    constructor(data: any) {
        this.email = data.email;
        this.password = data.password;
    }
}
