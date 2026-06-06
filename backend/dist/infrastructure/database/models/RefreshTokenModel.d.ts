import mongoose, { Document } from "mongoose";
export interface IRefreshTokenDocument extends Document {
    userId: string;
    token: string;
    expiresAt: Date;
    isRevoked: boolean;
    createdAt: Date;
    updatedAt: Date;
}
export declare const RefreshTokenModel: mongoose.Model<IRefreshTokenDocument, {}, {}, {}, mongoose.Document<unknown, {}, IRefreshTokenDocument, {}, {}> & IRefreshTokenDocument & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=RefreshTokenModel.d.ts.map