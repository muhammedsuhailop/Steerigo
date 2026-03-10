export interface SuccessfulRequestInfo {
  requestId: string;
  driverId: string;
  driverName: string;
  pickupETA: string;
  totalFare: number;
  currency: string;
}

export interface FailedRequestInfo {
  driverId: string;
  driverName: string;
  reason: string;
}

export interface AutoSearchAndRequestResult {
  requestGroupId: string;
  successfulRequests: SuccessfulRequestInfo[];
  failedRequests: FailedRequestInfo[];
  totalDriversFound: number;
  successCount: number;
  failureCount: number;
  searchedAt: Date;
}

export class AutoSearchAndRequestResponseDto {
  constructor(
    public readonly result: AutoSearchAndRequestResult,
    public readonly message: string,
  ) {}

  static create(
    requestGroupId: string,
    successfulRequests: SuccessfulRequestInfo[],
    failedRequests: FailedRequestInfo[],
    totalDriversFound: number,
  ): AutoSearchAndRequestResponseDto {
    const successCount = successfulRequests.length;
    const failureCount = failedRequests.length;

    const result: AutoSearchAndRequestResult = {
      requestGroupId,
      successfulRequests,
      failedRequests,
      totalDriversFound,
      successCount,
      failureCount,
      searchedAt: new Date(),
    };

    let message: string;
    if (successCount > 0 && failureCount === 0) {
      message = `Successfully sent ${successCount} ride requests`;
    } else if (successCount > 0) {
      message = `Sent ${successCount} ride requests (${failureCount} failed)`;
    } else if (failureCount > 0) {
      message = `Failed to send all ride requests. ${failureCount} drivers were unavailable`;
    } else {
      message = "No drivers found matching your criteria";
    }

    return new AutoSearchAndRequestResponseDto(result, message);
  }
}
