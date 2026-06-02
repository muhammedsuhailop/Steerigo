"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Transaction = void 0;
const TransactionDirection_1 = require("@domain/value-objects/TransactionDirection");
class Transaction {
    constructor(id, walletId, type, direction, amount, relatedEntityId, relatedEntityType, groupId, note, metadata = {}, createdAt = new Date()) {
        this.id = id;
        this.walletId = walletId;
        this.type = type;
        this.direction = direction;
        this.amount = amount;
        this.relatedEntityId = relatedEntityId;
        this.relatedEntityType = relatedEntityType;
        this.groupId = groupId;
        this.note = note;
        this.metadata = metadata;
        this.createdAt = createdAt;
    }
    static create(params) {
        if (params.amount.getAmount() <= 0) {
            throw new Error("Transaction amount must be positive");
        }
        return new Transaction(params.id, params.walletId, params.type, params.direction, params.amount, params.relatedEntityId, params.relatedEntityType, params.groupId, params.note, params.metadata ?? {}, new Date());
    }
    static fromData(data) {
        return new Transaction(data.id, data.walletId, data.type, data.direction, data.amount, data.relatedEntityId, data.relatedEntityType, data.groupId, data.note, data.metadata ?? {}, data.createdAt);
    }
    getId() {
        return this.id;
    }
    getWalletId() {
        return this.walletId;
    }
    getType() {
        return this.type;
    }
    getDirection() {
        return this.direction;
    }
    getAmount() {
        return this.amount;
    }
    getRelatedEntityId() {
        return this.relatedEntityId;
    }
    getRelatedEntityType() {
        return this.relatedEntityType;
    }
    getGroupId() {
        return this.groupId;
    }
    getNote() {
        return this.note;
    }
    getMetadata() {
        return this.metadata;
    }
    getCreatedAt() {
        return this.createdAt;
    }
    getSignedAmount() {
        return this.direction === TransactionDirection_1.TransactionDirection.CREDIT
            ? this.amount.getAmount()
            : -this.amount.getAmount();
    }
}
exports.Transaction = Transaction;
//# sourceMappingURL=Transaction.js.map