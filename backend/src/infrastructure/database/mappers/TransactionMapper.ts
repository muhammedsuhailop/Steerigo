import { Transaction } from "@domain/entities/Transaction";
import { Money } from "@domain/value-objects/Money";
import { TransactionDirection } from "@domain/value-objects/TransactionDirection";
import { TransactionType } from "@domain/value-objects/TransactionType";
import { ITransactionDocument } from "../models/TransactionModel";

export class TransactionMapper {
  static toDomain(doc: ITransactionDocument): Transaction {
    const amount = Money.create(doc.amount, doc.currency);

    return Transaction.fromData({
      id: doc.transactionId,
      walletId: doc.walletId,
      type: doc.type as TransactionType,
      direction: doc.direction as TransactionDirection,
      amount,
      relatedEntityId: doc.relatedEntityId,
      relatedEntityType: doc.relatedEntityType,
      groupId: doc.groupId,
      note: doc.note,
      metadata: doc.metadata ?? {},
      createdAt: doc.createdAt,
    });
  }

  static toPersistence(entity: Transaction) {
    const money = entity.getAmount();

    return {
      transactionId: entity.getId(),
      walletId: entity.getWalletId(),

      type: entity.getType(),
      direction: entity.getDirection(),

      amount: money.getAmount(),
      currency: money.getCurrency(),

      relatedEntityId: entity.getRelatedEntityId(),
      relatedEntityType: entity.getRelatedEntityType(),
      groupId: entity.getGroupId(),

      note: entity.getNote(),

      metadata: entity.getMetadata(),

      createdAt: entity.getCreatedAt(),
    };
  }
}
