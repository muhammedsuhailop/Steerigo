export class CancelFutureRideResponseDto {
  constructor(
    public readonly requestGroupId: string,
    public readonly cancelledCount: number,
    public readonly cancelledAt: Date,
  ) {}

  static create(
    requestGroupId: string,
    cancelledCount: number,
  ): CancelFutureRideResponseDto {
    return new CancelFutureRideResponseDto(
      requestGroupId,
      cancelledCount,
      new Date(),
    );
  }
}
