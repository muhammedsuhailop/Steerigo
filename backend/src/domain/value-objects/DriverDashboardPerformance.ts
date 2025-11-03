export class DriverDashboardPerformance {
  private constructor(
    private readonly acceptanceRate: number,
    private readonly cancellationRate: number,
    private readonly averageRating: number
  ) {}

  static create(
    acceptanceRate: number,
    cancellationRate: number,
    averageRating: number
  ): DriverDashboardPerformance {
    if (acceptanceRate < 0 || acceptanceRate > 100) {
      throw new Error("Acceptance rate must be between 0 and 100");
    }
    if (cancellationRate < 0 || cancellationRate > 100) {
      throw new Error("Cancellation rate must be between 0 and 100");
    }
    if (averageRating < 0 || averageRating > 5) {
      throw new Error("Average rating must be between 0 and 5");
    }
    return new DriverDashboardPerformance(
      acceptanceRate,
      cancellationRate,
      averageRating
    );
  }

  getAcceptanceRate(): number {
    return this.acceptanceRate;
  }

  getCancellationRate(): number {
    return this.cancellationRate;
  }

  getAverageRating(): number {
    return this.averageRating;
  }
}
