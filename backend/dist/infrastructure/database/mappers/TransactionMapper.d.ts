import { Transaction } from "../../../domain/entities/Transaction";
import { TransactionDirection } from "../../../domain/value-objects/TransactionDirection";
import { TransactionType } from "../../../domain/value-objects/TransactionType";
import { ITransactionDocument } from "../models/TransactionModel";
export declare class TransactionMapper {
    static toDomain(doc: ITransactionDocument): Transaction;
    static toPersistence(entity: Transaction): {
        transactionId: string;
        walletId: string;
        type: TransactionType;
        direction: TransactionDirection;
        amount: number;
        currency: string;
        relatedEntityId: string | undefined;
        relatedEntityType: string | undefined;
        groupId: string | undefined;
        note: string | undefined;
        metadata: Readonly<Record<string, string>>;
        createdAt: Date;
    };
}
//# sourceMappingURL=TransactionMapper.d.ts.map