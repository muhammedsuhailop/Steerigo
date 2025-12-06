export class UpdateAvailabilityStatusResponseDto {
  readonly id: string;
  readonly driverId: string;
  readonly status: string;
  readonly updatedAt: string;

  constructor(id: string, driverId: string, status: string, updatedAt: string) {
    this.id = id;
    this.driverId = driverId;
    this.status = status;
    this.updatedAt = updatedAt;
  }
}
