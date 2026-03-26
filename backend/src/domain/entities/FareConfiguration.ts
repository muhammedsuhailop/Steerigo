export interface FareRule {
  maxHours: number | null;
  ratePerHour: number;
}

export class FareConfiguration {
  private constructor(
    private readonly id: string,
    private readonly baseAmount: number,
    private readonly baseHours: number,
    private readonly fareRules: FareRule[],
    private readonly platformFeePercentage: number,
    private readonly fareTaxPercentage: number,
    private readonly platformFeeTaxPercentage: number,
    private readonly isActive: boolean,
    private readonly effectiveFrom: Date,
    private readonly effectiveTill: Date | null,
    private readonly maxCancellationCharge: number,
    private readonly createdAt: Date = new Date(),
    private readonly updatedAt: Date = new Date(),
  ) {}

  static create(params: {
    id: string;
    baseAmount: number;
    baseHours: number;
    fareRules: FareRule[];
    platformFeePercentage: number;
    fareTaxPercentage: number;
    platformFeeTaxPercentage: number;
    effectiveFrom: Date;
    effectiveTill?: Date | null;
    maxCancellationCharge: number;
  }): FareConfiguration {
    // Validate and sort rules
    const sortedRules = [...params.fareRules].sort((a, b) => {
      if (a.maxHours === null) return 1;
      if (b.maxHours === null) return -1;
      return a.maxHours - b.maxHours;
    });

    return new FareConfiguration(
      params.id,
      params.baseAmount,
      params.baseHours,
      sortedRules,
      params.platformFeePercentage,
      params.fareTaxPercentage,
      params.platformFeeTaxPercentage,
      true,
      params.effectiveFrom,
      params.effectiveTill || null,
      params.maxCancellationCharge,
    );
  }

  static fromData(data: {
    id: string;
    baseAmount: number;
    baseHours: number;
    fareRules: FareRule[];
    platformFeePercentage: number;
    fareTaxPercentage: number;
    platformFeeTaxPercentage: number;
    isActive: boolean;
    effectiveFrom: Date;
    effectiveTill: Date | null;
    maxCancellationCharge: number;
    createdAt: Date;
    updatedAt: Date;
  }): FareConfiguration {
    return new FareConfiguration(
      data.id,
      data.baseAmount,
      data.baseHours,
      data.fareRules,
      data.platformFeePercentage,
      data.fareTaxPercentage,
      data.platformFeeTaxPercentage,
      data.isActive,
      data.effectiveFrom,
      data.effectiveTill,
      data.maxCancellationCharge,
      data.createdAt,
      data.updatedAt,
    );
  }

  getId(): string {
    return this.id;
  }

  getBaseAmount(): number {
    return this.baseAmount;
  }

  getBaseHours(): number {
    return this.baseHours;
  }

  getFareRules(): FareRule[] {
    return [...this.fareRules];
  }

  getPlatformFeePercentage(): number {
    return this.platformFeePercentage;
  }

  getFareTaxPercentage(): number {
    return this.fareTaxPercentage;
  }

  getPlatformFeeTaxPercentage(): number {
    return this.platformFeeTaxPercentage;
  }

  getMaxCancellationCharge(): number {
    return this.maxCancellationCharge;
  }

  getEffectiveFrom(): Date {
    return this.effectiveFrom;
  }
  getEffectiveTill(): Date | null {
    return this.effectiveTill;
  }

  isActiveAt(date: Date): boolean {
    const isAfterStart = date >= this.effectiveFrom;
    const isBeforeEnd = !this.effectiveTill || date <= this.effectiveTill;
    return this.isActive && isAfterStart && isBeforeEnd;
  }
}
