export class UpdateUserStatusResponseDto {
  readonly message: string;
  readonly userId: string;
  readonly newStatus: string;

  constructor(message: string, userId: string, newStatus: string) {
    this.message = message;
    this.userId = userId;
    this.newStatus = newStatus;
  }
}
