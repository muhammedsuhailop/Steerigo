export class GetDriverDashboardDto {
  private readonly driverId: string;

  constructor(driverId: string) {
    if (!driverId || driverId.trim() === "") {
      throw new Error("Driver ID is required");
    }
    this.driverId = driverId;
  }

  getDriverId(): string {
    return this.driverId;
  }
}
