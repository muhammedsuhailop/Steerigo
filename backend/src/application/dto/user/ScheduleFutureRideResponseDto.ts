export interface ScheduledRequestInfo {
  readonly requestId: string;
  readonly driverId: string;
  readonly driverUserId: string;
  readonly pickupETA: string;
  readonly totalFare: number;
  readonly currency: string;
}

export interface ScheduleFutureRideResult {
  readonly requestGroupId: string;
  readonly scheduledRequests: ScheduledRequestInfo[];
  readonly totalDriversNotified: number;
  readonly pickupTime: Date;
  readonly expiresAt: Date;
  readonly scheduledAt: Date;
}

export class ScheduleFutureRideResponseDto {
  constructor(
    public readonly result: ScheduleFutureRideResult,
    public readonly message: string,
  ) {}

  static create(
    requestGroupId: string,
    scheduledRequests: ScheduledRequestInfo[],
    pickupTime: Date,
    expiryWindowMs: number,
  ): ScheduleFutureRideResponseDto {
    const now = new Date();

    const result: ScheduleFutureRideResult = {
      requestGroupId,
      scheduledRequests,
      totalDriversNotified: scheduledRequests.length,
      pickupTime,
      expiresAt: new Date(now.getTime() + expiryWindowMs),
      scheduledAt: now,
    };

    const message =
      scheduledRequests.length > 0
        ? `Your ride has been scheduled. ${scheduledRequests.length} drivers have been notified.`
        : "No drivers found near your pickup area for the scheduled time.";

    return new ScheduleFutureRideResponseDto(result, message);
  }
}
