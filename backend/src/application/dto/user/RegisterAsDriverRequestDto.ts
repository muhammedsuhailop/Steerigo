export class RegisterAsDriverRequestDto {
  public readonly userId: string;

  constructor(userId: string) {
    this.userId = userId;
  }

  validate(): string[] {
    const errors: string[] = [];

    if (!this.userId) {
      errors.push("User ID is required");
    }

    if (this.userId && typeof this.userId !== "string") {
      errors.push("User ID must be a string");
    }

    return errors;
  }
}
