export declare class UpdatePasswordDto {
    private readonly userId;
    private readonly currentPassword;
    private readonly newPassword;
    constructor(userId: string, body: {
        currentPassword: string;
        newPassword: string;
    });
    static fromRequest(userId: string, body: {
        currentPassword: string;
        newPassword: string;
    }): UpdatePasswordDto;
    getUserId(): string;
    getCurrentPassword(): string;
    getNewPassword(): string;
}
//# sourceMappingURL=UpdatePasswordDto.d.ts.map