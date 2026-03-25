import { Money } from "@domain/value-objects/Money";
import { WalletOwnerType } from "@domain/value-objects/WalletOwnerType";

export class Wallet {
  private constructor(
    private readonly id: string,
    private readonly ownerId: string,
    private readonly ownerType: WalletOwnerType,
    private availableBalance: Money,
    private pendingBalance: Money,
    private readonly currency: string,
    private readonly createdAt: Date = new Date(),
    private updatedAt: Date = new Date(),
  ) {}

  static create(params: {
    id: string;
    ownerId: string;
    ownerType: WalletOwnerType;
    initialBalance?: Money;
  }): Wallet {
    const init = params.initialBalance ?? Money.zero("INR");
    return new Wallet(
      params.id,
      params.ownerId,
      params.ownerType,
      init,
      Money.zero(init.getCurrency()),
      init.getCurrency(),
      new Date(),
      new Date(),
    );
  }

  static fromData(data: {
    id: string;
    ownerId: string;
    ownerType: WalletOwnerType;
    availableBalance: Money;
    pendingBalance: Money;
    currency: string;
    createdAt: Date;
    updatedAt: Date;
  }): Wallet {
    return new Wallet(
      data.id,
      data.ownerId,
      data.ownerType,
      data.availableBalance,
      data.pendingBalance,
      data.currency,
      data.createdAt,
      data.updatedAt,
    );
  }

  credit(amount: Money): void {
    this.ensureCurrencyMatch(amount);
    this.availableBalance = this.availableBalance.add(amount);
    this.updatedAt = new Date();
  }

  debit(amount: Money): void {
    this.ensureCurrencyMatch(amount);
    if (this.availableBalance.getAmount() < amount.getAmount()) {
      throw new Error("Insufficient available balance");
    }
    this.availableBalance = this.availableBalance.subtract(amount);
    this.updatedAt = new Date();
  }

  hold(amount: Money): void {
    this.ensureCurrencyMatch(amount);
    this.pendingBalance = this.pendingBalance.add(amount);
    this.updatedAt = new Date();
  }

  releasePendingToAvailable(amount: Money): void {
    this.ensureCurrencyMatch(amount);
    if (this.pendingBalance.getAmount() < amount.getAmount()) {
      throw new Error("Insufficient pending balance");
    }
    this.pendingBalance = this.pendingBalance.subtract(amount);
    this.availableBalance = this.availableBalance.add(amount);
    this.updatedAt = new Date();
  }

  removePending(amount: Money): void {
    this.ensureCurrencyMatch(amount);
    if (this.pendingBalance.getAmount() < amount.getAmount()) {
      throw new Error("Insufficient pending balance");
    }
    this.pendingBalance = this.pendingBalance.subtract(amount);
    this.updatedAt = new Date();
  }

  private ensureCurrencyMatch(amount: Money): void {
    if (amount.getCurrency() !== this.currency) {
      throw new Error("Currency mismatch");
    }
  }

  getId(): string {
    return this.id;
  }
  getOwnerId(): string {
    return this.ownerId;
  }
  getOwnerType(): WalletOwnerType {
    return this.ownerType;
  }
  getAvailableBalance(): Money {
    return this.availableBalance;
  }
  getPendingBalance(): Money {
    return this.pendingBalance;
  }
  getCurrency(): string {
    return this.currency;
  }
  getCreatedAt(): Date {
    return this.createdAt;
  }
  getUpdatedAt(): Date {
    return this.updatedAt;
  }

  getTotalBalance(): Money {
    return this.availableBalance.add(this.pendingBalance);
  }
}
