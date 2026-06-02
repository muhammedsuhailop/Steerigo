import { Document, Model } from "mongoose";
export interface IPayoutDocument extends Document {
    payoutId: string;
    driverId: string;
    amount: number;
    currency: string;
    status: string;
    method: string;
    destination?: {
        type: "BANK" | "UPI";
        accountNumber?: string;
        ifsc?: string;
        beneficiaryName?: string;
        bankName?: string;
        upiId?: string;
    };
    externalPayoutId?: string;
    fee?: number;
    feeCurrency?: string;
    failureReason?: string;
    createdAt: Date;
    processedAt?: Date;
    updatedAt: Date;
}
export declare const PayoutModel: Model<IPayoutDocument>;
//# sourceMappingURL=PayoutModel.d.ts.map