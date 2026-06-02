"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WalletModel = void 0;
const mongoose_1 = require("mongoose");
const WalletOwnerType_1 = require("@domain/value-objects/WalletOwnerType");
const walletSchema = new mongoose_1.Schema({
    walletId: {
        type: String,
        required: true,
        unique: true,
        index: true,
    },
    ownerId: {
        type: String,
        required: true,
        index: true,
    },
    ownerType: {
        type: String,
        enum: Object.values(WalletOwnerType_1.WalletOwnerType),
        required: true,
        index: true,
    },
    availableBalance: {
        type: Number,
        required: true,
        default: 0,
    },
    pendingBalance: {
        type: Number,
        required: true,
        default: 0,
        min: 0,
    },
    currency: {
        type: String,
        required: true,
    },
}, {
    timestamps: true,
    versionKey: false,
});
walletSchema.index({ ownerId: 1, ownerType: 1 });
exports.WalletModel = (0, mongoose_1.model)("Wallet", walletSchema);
//# sourceMappingURL=WalletModel.js.map