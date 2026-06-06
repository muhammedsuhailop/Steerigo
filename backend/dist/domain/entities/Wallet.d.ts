import { Money } from "../value-objects/Money";
import { WalletOwnerType } from "../value-objects/WalletOwnerType";
export declare class Wallet {
    private readonly id;
    private readonly ownerId;
    private readonly ownerType;
    private availableBalance;
    private pendingBalance;
    private readonly currency;
    private readonly createdAt;
    private updatedAt;
    private constructor();
    static create(params: {
        id: string;
        ownerId: string;
        ownerType: WalletOwnerType;
        initialBalance?: Money;
    }): Wallet;
    static fromData(data: {
        id: string;
        ownerId: string;
        ownerType: WalletOwnerType;
        availableBalance: Money;
        pendingBalance: Money;
        currency: string;
        createdAt: Date;
        updatedAt: Date;
    }): Wallet;
    credit(amount: Money): void;
    debit(amount: Money): void;
    forceDebit(amount: Money): void;
    hold(amount: Money): void;
    releasePendingToAvailable(amount: Money): void;
    removePending(amount: Money): void;
    private ensureCurrencyMatch;
    getId(): string;
    getOwnerId(): string;
    getOwnerType(): WalletOwnerType;
    getAvailableBalance(): Money;
    getPendingBalance(): Money;
    getCurrency(): string;
    getCreatedAt(): Date;
    getUpdatedAt(): Date;
    getTotalBalance(): Money;
}
//# sourceMappingURL=Wallet.d.ts.map