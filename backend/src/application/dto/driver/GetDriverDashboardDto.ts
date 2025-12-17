export class GetDriverDashboardDto {
  private readonly userId: string;

  constructor(userId: string) {
    if (!userId || userId.trim() === "") {
      throw new Error("User ID is required");
    }
    this.userId = userId;
  }

  static fromRequest(userId: string): GetDriverDashboardDto {
    return new GetDriverDashboardDto(userId);
  }

  getUserId(): string {
    return this.userId;
  }
}
