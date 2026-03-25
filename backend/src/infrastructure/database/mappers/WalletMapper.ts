import { Wallet } from "@domain/entities/Wallet";
import { IWalletDocument } from "../models/WalletModel";
import { Money } from "@domain/value-objects/Money";
import { WalletOwnerType } from "@domain/value-objects/WalletOwnerType";

export class WalletMapper {
  static toDomain(doc: IWalletDocument): Wallet {
    const available = Money.create(doc.availableBalance, doc.currency);
    const pending = Money.create(doc.pendingBalance, doc.currency);

    return Wallet.fromData({
      id: doc.walletId,
      ownerId: doc.ownerId,
      ownerType: doc.ownerType as WalletOwnerType,
      availableBalance: available,
      pendingBalance: pending,
      currency: doc.currency,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    });
  }

  static toPersistence(entity: Wallet) {
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
