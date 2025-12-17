export class UpdatePasswordDto {
  private readonly userId: string;
  private readonly currentPassword: string;
  private readonly newPassword: string;

  constructor(
    userId: string,
    body: { currentPassword: string; newPassword: string }
  ) {
    this.userId = userId;
    this.currentPassword = body.currentPassword;
    this.newPassword = body.newPassword;
  }

  static fromRequest(
    userId: string,
    body: { currentPassword: string; newPassword: string }
  ): UpdatePasswordDto {
    return new UpdatePasswordDto(userId, body);
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
