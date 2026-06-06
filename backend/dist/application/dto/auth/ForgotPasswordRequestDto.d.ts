export declare class ForgotPasswordRequestDto {
    private email;
    constructor(data: {
        email: string;
    });
    static fromRequest(data: {
        email: string;
    }): ForgotPasswordRequestDto;
    getEmail(): string;
}
//# sourceMappingURL=ForgotPasswordRequestDto.d.ts.map