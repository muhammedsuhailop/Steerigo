export class GetUserProfileRequestDto {
  private readonly userId: string;

  constructor(userId: string) {
    if (!userId || userId.trim().length === 0) {
      throw new Error("User ID is required");
    }
    this.userId = userId.trim();
  }

  getUserId(): string {
    return this.userId;
  }
}
