import { Document, Model, Types } from "mongoose";
export interface ITransactionDocument extends Document {
    _id: Types.ObjectId;
    transactionId: string;
    walletId: string;
    type: string;
    direction: string;
    amount: number;
    currency: string;
    relatedEntityId?: string;
    relatedEntityType?: string;
    groupId?: string;
    note?: string;
    metadata?: Record<string, string>;
    createdAt: Date;
}
export declare const TransactionModel: Model<ITransactionDocument>;
//# sourceMappingURL=TransactionModel.d.ts.map