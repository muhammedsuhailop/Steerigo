export class GetDriverProfileRequestDto {
  constructor(private readonly userId: string) {}

  getUserId(): string {
    return this.userId;
  }

  isValid(): boolean {
    return !!this.userId && this.userId.trim().length > 0;
  }
}
