import { MessageType } from "@domain/value-objects/MessageType";
import { Document, Schema, model, Model, Types } from "mongoose";

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

const messageSchema = new Schema<IMessageDocument>(
  {
    chatRoomId: {
      type: Schema.Types.ObjectId,
      ref: "ChatRoom",
      required: true,
      index: true,
    },

    senderId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    content: { type: String },

    type: {
      type: String,
      enum: Object.values(MessageType),
      default: MessageType.TEXT,
    },

    metadata: {
      imageUrl: String,
      latitude: Number,
      longitude: Number,
    },

    editedAt: Date,
    deletedAt: Date,
  },
  { timestamps: true },
);

messageSchema.index({ chatRoomId: 1, createdAt: -1 });

export const MessageModel: Model<IMessageDocument> = model(
  "Message",
  messageSchema,
);
