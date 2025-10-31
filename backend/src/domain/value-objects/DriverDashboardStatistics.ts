export class DriverDashboardStatistics {
  private constructor(
    private readonly ridesCompleted: number,
    private readonly ridesCancelled: number,
    private readonly totalEarnings: number
  ) {}

  static create(
    ridesCompleted: number,
    ridesCancelled: number,
    totalEarnings: number
  ): DriverDashboardStatistics {
    if (ridesCompleted < 0 || ridesCancelled < 0 || totalEarnings < 0) {
      throw new Error("Statistics values cannot be negative");
    }
    return new DriverDashboardStatistics(
      ridesCompleted,
      ridesCancelled,
      totalEarnings
    );
  }

  getRidesCompleted(): number {
    return this.ridesCompleted;
  }

  getRidesCancelled(): number {
    return this.ridesCancelled;
  }

  getTotalEarnings(): number {
    return this.totalEarnings;
  }
}
