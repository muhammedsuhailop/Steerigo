export declare class ResendOtpDto {
    private email;
    constructor(data: {
        email: string;
    });
    static fromRequest(data: {
        email: string;
    }): ResendOtpDto;
    getEmail(): string;
}
//# sourceMappingURL=ResendOtpDto.d.ts.map