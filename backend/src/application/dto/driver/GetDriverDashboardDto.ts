export class GetDriverDashboardDto {
  private readonly userId: string;

  constructor(userId: string) {
    if (!userId || userId.trim() === "") {
      throw new Error("User ID is required");
    }
    this.userId = userId;
  }

  getUserId(): string {
    return this.userId;
  }
}
