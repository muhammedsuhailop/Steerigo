import { DomainError } from "@domain/errors";

export class Money {
  private constructor(
    private readonly amount: number,
    private readonly currency: string = "INR",
  ) {}

  static create(amount: number, currency: string = "INR"): Money {
    if (amount === null || amount === undefined || isNaN(amount)) {
      throw new DomainError("Invalid money amount");
    }

    if (amount < 0) {
      throw new DomainError("Amount cannot be negative");
    }

    return new Money(Money.round(amount), currency);
  }

  static zero(currency: string = "INR"): Money {
    return Money.create(0, currency);
  }

  getAmount(): number {
    return this.amount;
  }

  getCurrency(): string {
    return this.currency;
  }

  add(other: Money): Money {
    this.validateSameCurrency(other);
    return Money.create(this.amount + other.amount, this.currency);
  }

  subtract(other: Money): Money {
    this.validateSameCurrency(other);

    const result = this.amount - other.amount;

    if (result < 0) {
      throw new DomainError(
        "Money subtraction cannot result in negative value",
      );
    }

    return Money.create(result, this.currency);
  }

  multiply(factor: number): Money {
    if (factor < 0) {
      throw new DomainError("Multiplier cannot be negative");
    }

    return Money.create(this.amount * factor, this.currency);
  }

  equals(other: Money): boolean {
    this.validateSameCurrency(other);
    return this.amount === other.amount;
  }

  greaterThan(other: Money): boolean {
    this.validateSameCurrency(other);
    return this.amount > other.amount;
  }

  lessThan(other: Money): boolean {
    this.validateSameCurrency(other);
    return this.amount < other.amount;
  }

  isZero(): boolean {
    return this.amount === 0;
  }

  private validateSameCurrency(other: Money): void {
    if (this.currency !== other.currency) {
      throw new DomainError("Cannot operate on different currencies");
    }
  }

  private static round(value: number): number {
    return Math.round(value * 100) / 100;
  }

  toJSON() {
    return {
      amount: this.amount,
      currency: this.currency,
    };
  }
}
