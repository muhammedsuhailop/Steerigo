import { Document, Model, Types } from "mongoose";
export interface IMessageDocument extends Document {
    _id: Types.ObjectId;
    chatRoomId: Types.ObjectId;
    senderId: Types.ObjectId;
    content: string;
    type: string;
    metadata: {
        imageUrl?: string;
        latitude?: number;
        longitude?: number;
    };
    createdAt: Date;
    updatedAt: Date;
    editedAt?: Date;
    deletedAt?: Date;
}
export declare const MessageModel: Model<IMessageDocument>;
//# sourceMappingURL=MessageModel.d.ts.map