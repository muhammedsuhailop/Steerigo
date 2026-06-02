import { Document, Model, Types } from "mongoose";
export interface IMessageStatusDocument extends Document {
    _id: Types.ObjectId;
    messageId: Types.ObjectId;
    userId: Types.ObjectId;
    status: string;
    updatedAt: Date;
    createdAt: Date;
}
export declare const MessageStatusModel: Model<IMessageStatusDocument>;
//# sourceMappingURL=MessageStatusModel.d.ts.map