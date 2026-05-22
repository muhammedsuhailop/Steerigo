interface CancelFutureRideRequestBody {
  requestGroupId: string;
}

export class CancelFutureRideDto {
  private readonly riderId: string;
  public readonly requestGroupId: string;

  constructor(riderId: string, requestGroupId: string) {
    this.riderId = riderId;
    this.requestGroupId = requestGroupId;
  }

  static fromRequest(
    riderId: string,
    requestBody: unknown,
  ): CancelFutureRideDto {
    const body = (requestBody ?? {}) as CancelFutureRideRequestBody;
    return new CancelFutureRideDto(riderId, body.requestGroupId);
  }

  getRiderId(): string {
    return this.riderId;
  }

  validate(): void {
    if (!this.requestGroupId || this.requestGroupId.trim().length === 0) {
      throw new Error("requestGroupId is required");
    }

    if (!this.riderId || this.riderId.trim().length === 0) {
      throw new Error("riderId is required");
    }
  }
}
