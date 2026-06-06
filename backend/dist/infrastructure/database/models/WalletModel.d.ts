import { Document, Model } from "mongoose";
export interface IWalletDocument extends Document {
    walletId: string;
    ownerId: string;
    ownerType: string;
    availableBalance: number;
    pendingBalance: number;
    currency: string;
    createdAt: Date;
    updatedAt: Date;
}
export declare const WalletModel: Model<IWalletDocument>;
//# sourceMappingURL=WalletModel.d.ts.map