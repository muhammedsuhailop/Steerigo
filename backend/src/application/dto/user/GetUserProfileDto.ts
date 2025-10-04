export class GetUserProfileDto {
  public readonly userId: string;

  constructor(userId: string) {
    this.userId = userId;
  }

  validate(): string[] {
    const errors: string[] = [];

    if (!this.userId) {
      errors.push("User ID is required");
    }

    return errors;
  }
}
