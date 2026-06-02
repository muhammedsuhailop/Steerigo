import { Wallet } from "@domain/entities/Wallet";
import { IWalletDocument } from "../models/WalletModel";
import { WalletOwnerType } from "@domain/value-objects/WalletOwnerType";
export declare class WalletMapper {
    static toDomain(doc: IWalletDocument): Wallet;
    static toPersistence(entity: Wallet): {
        walletId: string;
        ownerId: string;
        ownerType: WalletOwnerType;
        availableBalance: number;
        pendingBalance: number;
        currency: string;
        updatedAt: Date;
    };
}
//# sourceMappingURL=WalletMapper.d.ts.map