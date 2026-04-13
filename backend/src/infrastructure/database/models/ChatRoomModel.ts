import { Document, Schema, model, Model, Types } from "mongoose";
import { UserRole } from "@shared/constants/AuthConstants";
import { ChatRoomStatus } from "@domain/value-objects/ChatRoomStatus";
import { ChatRoomType } from "@domain/value-objects/ChatRoomType";

export interface IChatRoomDocument extends Document {
  _id: Types.ObjectId;
  type: ChatRoomType;
  rideId?: Types.ObjectId;

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

const chatRoomSchema = new Schema<IChatRoomDocument>(
  {
    rideId: {
      type: Schema.Types.ObjectId,
      ref: "Ride",
      required: true,
      unique: true,
      index: true,
    },

    participants: [
      {
        userId: {
          type: Schema.Types.ObjectId,
          required: true,
          ref: "User",
        },
        role: {
          type: String,
          enum: ["RIDER", "DRIVER"],
          required: true,
        },
      },
    ],

    status: {
      type: String,
      enum: Object.values(ChatRoomStatus),
      default: ChatRoomStatus.ACTIVE,
      index: true,
    },

    lastMessageId: {
      type: Schema.Types.ObjectId,
      ref: "Message",
    },

    lastMessageAt: {
      type: Date,
      index: true,
    },
  },
  { timestamps: true },
);

chatRoomSchema.index({ "participants.userId": 1 });

export const ChatRoomModel: Model<IChatRoomDocument> = model(
  "ChatRoom",
  chatRoomSchema,
);
