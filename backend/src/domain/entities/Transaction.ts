import { Money } from "@domain/value-objects/Money";
import { TransactionDirection } from "@domain/value-objects/TransactionDirection";
import { TransactionType } from "@domain/value-objects/TransactionType";

export class Transaction {
  private constructor(
    private readonly id: string,
    private readonly walletId: string,
    private readonly type: TransactionType,
    private readonly direction: TransactionDirection,
    private readonly amount: Money,

    private readonly relatedEntityId?: string,
    private readonly relatedEntityType?: string,
    private readonly note?: string,
    private readonly metadata: Readonly<Record<string, string>> = {},

    private readonly createdAt: Date = new Date(),
  ) {}

  static create(params: {
    id: string;
    walletId: string;
    type: TransactionType;
    direction: TransactionDirection;
    amount: Money;
    relatedEntityId?: string;
    relatedEntityType?: string;
    note?: string;
    metadata?: Record<string, string>;
  }): Transaction {
    if (params.amount.getAmount() <= 0) {
      throw new Error("Transaction amount must be positive");
    }

    return new Transaction(
      params.id,
      params.walletId,
      params.type,
      params.direction,
      params.amount,
      params.relatedEntityId,
      params.relatedEntityType,
      params.note,
      params.metadata ?? {},
      new Date(),
    );
  }

  static fromData(data: {
    id: string;
    walletId: string;
    type: TransactionType;
    direction: TransactionDirection;
    amount: Money;
    relatedEntityId?: string;
    relatedEntityType?: string;
    note?: string;
    metadata?: Record<string, string>;
    createdAt: Date;
  }): Transaction {
    return new Transaction(
      data.id,
      data.walletId,
      data.type,
      data.direction,
      data.amount,
      data.relatedEntityId,
      data.relatedEntityType,
      data.note,
      data.metadata ?? {},
      data.createdAt,
    );
  }

  getId(): string {
    return this.id;
  }

  getWalletId(): string {
    return this.walletId;
  }

  getType(): TransactionType {
    return this.type;
  }

  getDirection(): TransactionDirection {
    return this.direction;
  }

  getAmount(): Money {
    return this.amount;
  }

  getRelatedEntityId(): string | undefined {
    return this.relatedEntityId;
  }

  getRelatedEntityType(): string | undefined {
    return this.relatedEntityType;
  }

  getNote(): string | undefined {
    return this.note;
  }

  getMetadata(): Readonly<Record<string, string>> {
    return this.metadata;
  }

  getCreatedAt(): Date {
    return this.createdAt;
  }

  getSignedAmount(): number {
    return this.direction === TransactionDirection.CREDIT
      ? this.amount.getAmount()
      : -this.amount.getAmount();
  }
}
