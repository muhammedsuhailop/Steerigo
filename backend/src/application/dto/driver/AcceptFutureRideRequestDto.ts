interface AcceptFutureRideRequestBody {
  requestId: string;
}

export class AcceptFutureRideRequestDto {
  private readonly userId: string;
  public readonly requestId: string;

  constructor(userId: string, requestId: string) {
    this.userId = userId;
    this.requestId = requestId;
  }

  static fromRequest(
    userId: string,
    requestBody: unknown,
  ): AcceptFutureRideRequestDto {
    const body = (requestBody ?? {}) as AcceptFutureRideRequestBody;
    return new AcceptFutureRideRequestDto(userId, body.requestId);
  }

  getUserId(): string {
    return this.userId;
  }

  getRequestId(): string {
    return this.requestId;
  }

  validate(): void {
    if (!this.userId || this.userId.trim().length === 0) {
      throw new Error("userId is required");
    }
    if (!this.requestId || this.requestId.trim().length === 0) {
      throw new Error("requestId is required");
    }
  }
}
