export class UpdatePasswordDto {
    public readonly currentPassword: string;
    public readonly newPassword: string;

    constructor(data: { currentPassword: string, newPassword: string }) {
        this.currentPassword = data.currentPassword;
        this.newPassword = data.newPassword;
    }
}
