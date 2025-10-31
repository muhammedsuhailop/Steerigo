export class FareBreakdown {
  private readonly baseFare: number;
  private readonly distanceFare: number;
  private readonly timeFare: number;
  private readonly tax: number;
  private readonly surgeMultiplier: number;

  constructor(
    baseFare: number,
    distanceFare: number,
    timeFare: number,
    tax: number,
    surgeMultiplier: number = 1
  ) {
    this.baseFare = baseFare;
    this.distanceFare = distanceFare;
    this.timeFare = timeFare;
    this.tax = tax;
    this.surgeMultiplier = surgeMultiplier;
  }

  public getTotalFare(): number {
    return (
      (this.baseFare + this.distanceFare + this.timeFare + this.tax) *
      this.surgeMultiplier
    );
  }

  public equals(other: FareBreakdown): boolean {
    return (
      this.baseFare === other.baseFare &&
      this.distanceFare === other.distanceFare &&
      this.timeFare === other.timeFare &&
      this.tax === other.tax &&
      this.surgeMultiplier === other.surgeMultiplier
    );
  }
}
