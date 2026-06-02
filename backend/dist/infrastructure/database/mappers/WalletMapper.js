"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WalletMapper = void 0;
const Wallet_1 = require("@domain/entities/Wallet");
const Money_1 = require("@domain/value-objects/Money");
class WalletMapper {
    static toDomain(doc) {
        const available = Money_1.Money.forceCreate(doc.availableBalance, doc.currency);
        const pending = Money_1.Money.create(doc.pendingBalance, doc.currency);
        return Wallet_1.Wallet.fromData({
            id: doc.walletId,
            ownerId: doc.ownerId,
            ownerType: doc.ownerType,
            availableBalance: available,
            pendingBalance: pending,
            currency: doc.currency,
            createdAt: doc.createdAt,
            updatedAt: doc.updatedAt,
        });
    }
    static toPersistence(entity) {
        return {
            walletId: entity.getId(),
            ownerId: entity.getOwnerId(),
            ownerType: entity.getOwnerType(),
            availableBalance: entity.getAvailableBalance().getAmount(),
            pendingBalance: entity.getPendingBalance().getAmount(),
            currency: entity.getCurrency(),
            updatedAt: entity.getUpdatedAt(),
        };
    }
}
exports.WalletMapper = WalletMapper;
//# sourceMappingURL=WalletMapper.js.map