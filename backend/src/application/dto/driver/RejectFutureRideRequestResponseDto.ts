export interface RejectFutureRideRequestResponseDto {
  readonly success: boolean;
  readonly message: string;
  readonly data: {
    readonly futureRequestId: string;
    readonly requestGroupId: string;
    readonly driverId: string;
  };
}
