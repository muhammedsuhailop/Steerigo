export class UpdatePasswordDto {
    public readonly currentPassword: string;
    public readonly newPassword: string;

    constructor(data: any) {
        this.currentPassword = data.currentPassword;
        this.newPassword = data.newPassword;
    }
}
