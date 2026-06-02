import { Document, Model, Types } from "mongoose";
import { UserRole } from "@shared/constants/AuthConstants";
import { ChatRoomType } from "@domain/value-objects/ChatRoomType";
export interface IChatRoomDocument extends Document {
    _id: Types.ObjectId;
    type: ChatRoomType;
    rideId?: string;
    participants: {
        userId: Types.ObjectId;
        role: UserRole;
    }[];
    status: string;
    lastMessageId?: Types.ObjectId;
    lastMessageAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}
export declare const ChatRoomModel: Model<IChatRoomDocument>;
//# sourceMappingURL=ChatRoomModel.d.ts.map