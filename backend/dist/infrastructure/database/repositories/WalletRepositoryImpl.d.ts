import { Wallet } from "@domain/entities/Wallet";
import { WalletOwnerType } from "@domain/value-objects/WalletOwnerType";
import { IWalletRepository } from "@domain/repositories/IWalletRepository";
export declare class WalletRepositoryImpl implements IWalletRepository {
    save(wallet: Wallet): Promise<Wallet>;
    findById(id: string): Promise<Wallet | null>;
    findByOwner(ownerId: string, ownerType: WalletOwnerType): Promise<Wallet | null>;
    exists(id: string): Promise<boolean>;
}
//# sourceMappingURL=WalletRepositoryImpl.d.ts.map