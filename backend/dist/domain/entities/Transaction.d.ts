import { Money } from "@domain/value-objects/Money";
import { TransactionDirection } from "@domain/value-objects/TransactionDirection";
import { TransactionType } from "@domain/value-objects/TransactionType";
export declare class Transaction {
    private readonly id;
    private readonly walletId;
    private readonly type;
    private readonly direction;
    private readonly amount;
    private readonly relatedEntityId?;
    private readonly relatedEntityType?;
    private readonly groupId?;
    private readonly note?;
    private readonly metadata;
    private readonly createdAt;
    private constructor();
    static create(params: {
        id: string;
        walletId: string;
        type: TransactionType;
        direction: TransactionDirection;
        amount: Money;
        relatedEntityId?: string;
        relatedEntityType?: string;
        groupId?: string;
        note?: string;
        metadata?: Record<string, string>;
    }): Transaction;
    static fromData(data: {
        id: string;
        walletId: string;
        type: TransactionType;
        direction: TransactionDirection;
        amount: Money;
        relatedEntityId?: string;
        relatedEntityType?: string;
        groupId?: string;
        note?: string;
        metadata?: Record<string, string>;
        createdAt: Date;
    }): Transaction;
    getId(): string;
    getWalletId(): string;
    getType(): TransactionType;
    getDirection(): TransactionDirection;
    getAmount(): Money;
    getRelatedEntityId(): string | undefined;
    getRelatedEntityType(): string | undefined;
    getGroupId(): string | undefined;
    getNote(): string | undefined;
    getMetadata(): Readonly<Record<string, string>>;
    getCreatedAt(): Date;
    getSignedAmount(): number;
}
//# sourceMappingURL=Transaction.d.ts.map