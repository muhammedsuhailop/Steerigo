import { Document, Model, Types } from "mongoose";
export interface IUserChatDocument extends Document {
    _id: Types.ObjectId;
    userId: Types.ObjectId;
    chatRoomId: Types.ObjectId;
    lastSeenMessageId?: Types.ObjectId;
    unreadCount: number;
    isMuted: boolean;
    isPinned: boolean;
    lastMessageAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}
export declare const UserChatModel: Model<IUserChatDocument>;
//# sourceMappingURL=UserChatMode.d.ts.map