import { Wallet } from "../entities/Wallet";
import { WalletOwnerType } from "../value-objects/WalletOwnerType";
import { IReadOnlyRepository } from "./base/IReadOnlyRepository";
export interface IWalletRepository extends IReadOnlyRepository<Wallet> {
    save(wallet: Wallet): Promise<Wallet>;
    findByOwner(ownerId: string, ownerType: WalletOwnerType): Promise<Wallet | null>;
}
//# sourceMappingURL=IWalletRepository.d.ts.map