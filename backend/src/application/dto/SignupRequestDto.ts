export class SignupRequestDto {
    public readonly name: string;
    public readonly email: string;
    public readonly password: string;
    public readonly mobile?: string;
    public readonly role?: string;

    constructor(data: { name: string, email: string, password: string, mobile: string, role: string }) {
        this.name = data.name;
        this.email = data.email;
        this.password = data.password;
        this.mobile = data.mobile;
        this.role = data.role;
    }
}
