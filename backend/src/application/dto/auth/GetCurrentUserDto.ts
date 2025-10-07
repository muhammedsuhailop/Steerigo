export class GetCurrentUserDto {
  private userId: string;

  constructor(data: { userId: string }) {
    this.userId = data.userId;
  }

  getUserId(): string {
    return this.userId;
  }
}
