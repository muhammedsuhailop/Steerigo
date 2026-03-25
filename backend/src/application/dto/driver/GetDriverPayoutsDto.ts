export class GetDriverPayoutsDto {
  private constructor(private readonly userId: string) {}

  static create(userId: string): GetDriverPayoutsDto {
    return new GetDriverPayoutsDto(userId);
  }

  getUserId(): string {
    return this.userId;
  }
}
