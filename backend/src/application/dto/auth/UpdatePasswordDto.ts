export class UpdatePasswordDto {
  private userId: string;
  private currentPassword: string;
  private newPassword: string;

  constructor(data: {
    userId: string;
    currentPassword: string;
    newPassword: string;
  }) {
    this.userId = data.userId;
    this.currentPassword = data.currentPassword;
    this.newPassword = data.newPassword;
  }

  getUserId(): string {
    return this.userId;
  }

  getCurrentPassword(): string {
    return this.currentPassword;
  }

  getNewPassword(): string {
    return this.newPassword;
  }
}
