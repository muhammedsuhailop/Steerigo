export class GetCurrentUserDto {
  private userId: string;

  constructor(data: { userId: string }) {
    this.userId = data.userId;
  }

  static fromRequest(data: { userId: string }): GetCurrentUserDto {
    return new GetCurrentUserDto(data);
  }

  getUserId(): string {
    return this.userId;
  }
}
