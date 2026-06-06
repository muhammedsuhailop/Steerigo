"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionMapper = void 0;
const Transaction_1 = require("../../../domain/entities/Transaction");
const Money_1 = require("../../../domain/value-objects/Money");
class TransactionMapper {
    static toDomain(doc) {
        const amount = Money_1.Money.create(doc.amount, doc.currency);
        return Transaction_1.Transaction.fromData({
            id: doc.transactionId,
            walletId: doc.walletId,
            type: doc.type,
            direction: doc.direction,
            amount,
            relatedEntityId: doc.relatedEntityId,
            relatedEntityType: doc.relatedEntityType,
            groupId: doc.groupId,
            note: doc.note,
            metadata: doc.metadata ?? {},
            createdAt: doc.createdAt,
        });
    }
    static toPersistence(entity) {
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
exports.TransactionMapper = TransactionMapper;
//# sourceMappingURL=TransactionMapper.js.map