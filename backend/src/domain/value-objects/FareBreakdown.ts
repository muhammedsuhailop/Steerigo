import { Money } from "./Money";

export interface TaxBreakdown {
  name: string;
  rate: number;
  amount: Money;
}

export class FareBreakdown {
  private constructor(
    private readonly baseFare: Money,
    private readonly platformFee: Money,
    private readonly fareTax: TaxBreakdown,
    private readonly platformFeeTax: TaxBreakdown,
    private readonly totalFare: Money,
    private readonly durationHours: number,
    private readonly calculatedAt: Date = new Date(),
  ) {}

  static create(params: {
    baseFare: Money;
    platformFee: Money;
    fareTax: TaxBreakdown;
    platformFeeTax: TaxBreakdown;
    totalFare: Money;
    durationHours: number;
  }): FareBreakdown {
    return new FareBreakdown(
      params.baseFare,
      params.platformFee,
      params.fareTax,
      params.platformFeeTax,
      params.totalFare,
      params.durationHours,
    );
  }

  static zero(currency: string): FareBreakdown {
    const zeroMoney = Money.create(0, currency);
    const zeroTax: TaxBreakdown = { name: "None", rate: 0, amount: zeroMoney };
    return new FareBreakdown(
      zeroMoney,
      zeroMoney,
      zeroTax,
      zeroTax,
      zeroMoney,
      0,
    );
  }

  static forCancellation(cancellationFee: Money): FareBreakdown {
    const currency = cancellationFee.getCurrency();
    const zeroMoney = Money.create(0, currency);
    const zeroTax: TaxBreakdown = { name: "None", rate: 0, amount: zeroMoney };
    return new FareBreakdown(
      cancellationFee,
      zeroMoney,
      zeroTax,
      zeroTax,
      cancellationFee,
      0,
    );
  }

  getBaseFare(): Money {
    return this.baseFare;
  }

  getPlatformFee(): Money {
    return this.platformFee;
  }

  getFareTax(): TaxBreakdown {
    return this.fareTax;
  }

  getPlatformFeeTax(): TaxBreakdown {
    return this.platformFeeTax;
  }

  getTotalFare(): Money {
    return this.totalFare;
  }

  getDurationHours(): number {
    return this.durationHours;
  }

  getCalculatedAt(): Date {
    return this.calculatedAt;
  }

  toJSON() {
    return {
      baseFare: this.baseFare.toJSON(),
      platformFee: this.platformFee.toJSON(),
      taxes: {
        fare: {
          name: this.fareTax.name,
          rate: this.fareTax.rate,
          amount: this.fareTax.amount.toJSON(),
        },
        platformFee: {
          name: this.platformFeeTax.name,
          rate: this.platformFeeTax.rate,
          amount: this.platformFeeTax.amount.toJSON(),
        },
      },
      totalFare: this.totalFare.toJSON(),
      durationHours: this.durationHours,
      calculatedAt: this.calculatedAt,
    };
  }
}
