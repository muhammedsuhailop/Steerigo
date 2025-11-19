import { DomainError } from "@domain/errors";

export class Money {
  private constructor(
    private readonly amount: number,
    private readonly currency: string = "INR"
  ) {}

  static create(amount: number, currency: string = "INR"): Money {
    if (amount < 0) {
      throw new DomainError("Amount cannot be negative");
    }
    return new Money(Math.round(amount * 100) / 100, currency);
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

  multiply(factor: number): Money {
    return Money.create(this.amount * factor, this.currency);
  }

  private validateSameCurrency(other: Money): void {
    if (this.currency !== other.currency) {
      throw new DomainError("Cannot operate on different currencies");
    }
  }

  toJSON() {
    return {
      amount: this.amount,
      currency: this.currency,
    };
  }
}
