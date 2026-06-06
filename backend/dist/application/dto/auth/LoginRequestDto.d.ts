export declare class LoginRequestDto {
    private email;
    private password;
    constructor(data: {
        email: string;
        password: string;
    });
    static fromrequest(data: {
        email: string;
        password: string;
    }): LoginRequestDto;
    getEmailValue(): string;
    getPassword(): string;
}
//# sourceMappingURL=LoginRequestDto.d.ts.map