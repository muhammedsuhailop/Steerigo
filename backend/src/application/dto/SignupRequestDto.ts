export class SignupRequestDto {
    public readonly name: string;
    public readonly email: string;
    public readonly password: string;
    public readonly mobile?: string;
    public readonly role?: string;

    constructor(data: any) {
        this.name = data.name;
        this.email = data.email;
        this.password = data.password;
        this.mobile = data.mobile;
        this.role = data.role;
    }
}
