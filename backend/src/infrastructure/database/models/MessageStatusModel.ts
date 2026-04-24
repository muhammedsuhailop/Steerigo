import { MessageDeliveryStatus } from "@domain/value-objects/MessageDeliveryStatus";
import { Document, Schema, model, Model, Types } from "mongoose";

export interface IMessageStatusDocument extends Document {
  _id: Types.ObjectId;
  messageId: Types.ObjectId;
  userId: Types.ObjectId;

  status: string;
  updatedAt: Date;
  createdAt: Date;
}

const messageStatusSchema = new Schema<IMessageStatusDocument>(
  {
    messageId: {
      type: Schema.Types.ObjectId,
      ref: "Message",
      required: true,
      index: true,
    },

    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    status: {
      type: String,
      enum: Object.values(MessageDeliveryStatus),
      required: true,
    },
  },
  { timestamps: { createdAt: true, updatedAt: true } },
);

messageStatusSchema.index({ messageId: 1, userId: 1 }, { unique: true });

export const MessageStatusModel: Model<IMessageStatusDocument> = model(
  "MessageStatus",
  messageStatusSchema,
);
