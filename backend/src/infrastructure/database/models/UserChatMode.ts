import { Document, Schema, model, Model, Types } from "mongoose";

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

const userChatSchema = new Schema<IUserChatDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    chatRoomId: {
      type: Schema.Types.ObjectId,
      ref: "ChatRoom",
      required: true,
    },

    lastSeenMessageId: {
      type: Schema.Types.ObjectId,
      ref: "Message",
    },

    unreadCount: {
      type: Number,
      default: 0,
      min: 0,
    },

    isMuted: {
      type: Boolean,
      default: false,
    },

    isPinned: {
      type: Boolean,
      default: false,
    },

    lastMessageAt: {
      type: Date,
      index: true,
    },
  },
  {
    timestamps: true,
    collection: "user_chats",
  },
);

userChatSchema.index({ userId: 1, chatRoomId: 1 }, { unique: true });
userChatSchema.index({ userId: 1, lastMessageAt: -1 });

export const UserChatModel: Model<IUserChatDocument> = model(
  "UserChat",
  userChatSchema,
);
