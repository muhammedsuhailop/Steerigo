export class RemoveAvailabilityExceptionRequestDto {
  private readonly userId: string;
  private readonly exceptionId: string;

  constructor(userId: string, exceptionId: string) {
    this.userId = userId;
    this.exceptionId = exceptionId;
  }

  static fromRequest(
    userId: string,
    exceptionId: string,
  ): RemoveAvailabilityExceptionRequestDto {
    return new RemoveAvailabilityExceptionRequestDto(userId, exceptionId);
  }

  getUserId(): string {
    return this.userId;
  }

  getExceptionId(): string {
    return this.exceptionId;
  }

  validate(): string[] {
    const errors: string[] = [];

    if (!this.exceptionId || this.exceptionId.trim().length === 0) {
      errors.push("Exception ID is required");
    }

    return errors;
  }
}
