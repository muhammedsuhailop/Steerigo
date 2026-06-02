"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionModel = void 0;
const mongoose_1 = require("mongoose");
const TransactionDirection_1 = require("@domain/value-objects/TransactionDirection");
const TransactionType_1 = require("@domain/value-objects/TransactionType");
const transactionSchema = new mongoose_1.Schema({
    transactionId: {
        type: String,
        required: true,
        unique: true,
        index: true,
    },
    walletId: {
        type: String,
        required: true,
        index: true,
    },
    type: {
        type: String,
        enum: Object.values(TransactionType_1.TransactionType),
        required: true,
        index: true,
    },
    direction: {
        type: String,
        enum: Object.values(TransactionDirection_1.TransactionDirection),
        required: true,
    },
    amount: {
        type: Number,
        required: true,
        min: 0,
    },
    currency: {
        type: String,
        required: true,
    },
    relatedEntityId: {
        type: String,
    },
    relatedEntityType: {
        type: String,
    },
    groupId: {
        type: String,
        index: true,
    },
    note: {
        type: String,
    },
    metadata: {
        type: mongoose_1.Schema.Types.Mixed,
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now,
    },
}, { versionKey: false });
transactionSchema.index({ walletId: 1, createdAt: -1 });
exports.TransactionModel = (0, mongoose_1.model)("Transaction", transactionSchema);
//# sourceMappingURL=TransactionModel.js.map